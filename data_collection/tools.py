"""Module providing a functionality to collect data from various sources."""

import os
import logging
import requests
import pandas as pd
import selenium.common
from pandas import DataFrame
from requests import RequestException
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
import glob
from constants import LOVD_VARIABLES_DATA_TYPES
from constants import (LOVD_FILE_URL_EYS,
                       GNOMAD_URL_EYS,
                       CLINVAR_URL_EYS)


# EXCEPTIONS
class BadResponseException(Exception):
    """Custom exception for bad responses."""


class DownloadError(Exception):
    """Custom exception for download errors."""



def get_file_from_url(url, save_to, override=False):
    """
    Gets file from url and saves it into provided path. Overrides, if override is True.

    :param str url: link with file
    :param str save_to: path to save
    :param bool override: needs override
    """

    # check if directory exists, if not - create
    save_to_dir = os.path.dirname(save_to)
    if not os.path.exists(save_to_dir):
        os.makedirs(save_to_dir)
    # check if directory exists, if not - create
    save_to_dir = os.path.dirname(save_to)
    if not os.path.exists(save_to_dir):
        os.makedirs(save_to_dir)

    # check if file exist and needs to override
    if os.path.exists(save_to) and not override:
        print(f"The file at {save_to} already exists.")
        return

    try:
        response = requests.get(url, timeout=10)
    except RequestException as e:
        raise DownloadError(f"Error while downloading file from {url}") from e

    if response.status_code != 200:
        raise BadResponseException(f"Bad response from {url}."
                                   f" Status code: {response.status_code}")

    with open(save_to, "wb") as f:
        f.write(response.content)


def download_lovd_database_for_eys_gene(database_name, override=False):
    """
    Gets file from url and saves it into provided path. Overrides, if override is True.

    :param str database_name: database to download
    :param bool override: needs override
    """

    url = DATABASES_DOWNLOAD_PATHS[database_name]["url"]
    save_to = DATABASES_DOWNLOAD_PATHS[database_name]["store_as"]

    # check if directory exists, if not - create
    save_to_dir = os.path.dirname(save_to)
    if not os.path.exists(save_to_dir):
        os.makedirs(save_to_dir)

    # check if file exist and needs to override
    if os.path.exists(save_to) and not override:
        print(f"The file at {save_to} already exists.")
        return

    try:
        response = requests.get(url, timeout=10)
    except RequestException as e:
        raise DownloadError(f"Error while downloading file from {url}") from e

    if response.status_code != 200:
        raise BadResponseException(f"Bad response from {url}."
                                   f" Status code: {response.status_code}")

    with open(save_to, "wb") as f:
        f.write(response.content)


def convert_lovd_data_types(frame, table_name):
    """
    Converts DataFrame object data types from object to specific type.

    :param DataFrame frame: pointer to LOVD DataFrame
    :param str table_name: name of a LOVD DataFrame
    """

    for column, data_type in LOVD_VARIABLES_DATA_TYPES.items():
        if column not in frame.columns:
            continue

        match [data_type]:
            case ["Date"]:
                frame[column] = pd.to_datetime(frame[column], errors='coerce')
            case ["Boolean"]:
                frame[column] = (frame[column] != 0).astype('bool')
            case ["String"]:
                frame[column] = frame[column].astype('string')
            case ["Integer"]:
                frame[column] = pd.to_numeric(frame[column], errors='coerce').astype('Int64')
            case ["Double"]:
                frame[column] = pd.to_numeric(frame[column], errors='coerce').astype('float')

    # exception
    if table_name == "Genes":
        frame['id'] = frame['id'].astype('string')


def from_lovd_to_pandas(path):
    """
    Converts data from text file with LOVD format to dictionary of tables. \
    Key is name of table, value is tuple, where first element is data saved as \
    pandas DataFrame and second element is list of notes.

    :param str path: path to text file
    :returns: dictionary of tables
    :rtype: dict[str, tuple[DataFrame, list[str]]]
    """

    # Check if the file exists
    if not os.path.exists(path):
        raise FileNotFoundError(f"The file at {path} does not exist.")

    d = {}

    with open(path, encoding="UTF-8") as f:
        # skip header
        [f.readline() for _ in range(4)]  # pylint: disable=expression-not-assigned

        while True:
            line = f.readline()

            if line == '':
                break

            table_name = line.split("##")[1].strip()

            notes = []
            line = f.readline()
            while line.startswith("##"):
                notes.append(line[2:-1])
                line = f.readline()

            table_header = [column[3:-3] for column in line[:-1].split('\t')]
            frame = DataFrame([], columns=table_header)
            line = f.readline()
            while line != '\n':
                variables = [variable[1:-1] for variable in line[:-1].split('\t')]
                observation = DataFrame([variables], columns=table_header)
                frame = pd.concat([frame, observation], ignore_index=True)
                line = f.readline()

            # formats the frame
            convert_lovd_data_types(frame, table_name)

            d[table_name] = (frame, notes)
            # skip inter tables lines
            [f.readline() for _ in range(1)]  # pylint: disable=expression-not-assigned

    return d


def from_clinvar_name_to_dna(name):
    """
    Custom cleaner to extract DNA from Clinvar name variable.

    :param str name:
    :returns: extracted DNA
    :rtype: str
    """

    start = name.find(":") + 1
    ends = {'del', 'delins', 'dup', 'ins', 'inv', 'subst'}

    if "p." in name:
        name = name[:name.index("p.") - 1].strip()

    end = len(name)

    for i in ends:
        if i in name:
            end = name.index(i) + len(i)
            break

    return name[start:end]


def download_gene_lovd(gene_list:list,folder_path,raise_exception = False):
    """
    Downloads data into txt files from gene_list.

    :param list gene_list: list of gene's symbols
    :param str folder_path: folder to save the data
    :param bool raise_exception: raise exception if True, otherwise log
    """

    for gene in gene_list:
        file_path = folder_path + '/'+gene + ".txt"
        url = f"https://databases.lovd.nl/shared/download/all/gene/{gene}"
        try:
            response = requests.get(url, timeout=10)
        except RequestException as e:
            raise DownloadError(f"Error while downloading file from {url}") from e

        if response.status_code != 200:
            raise BadResponseException(f"Bad response from {url}."
                                       f" Status code: {response.status_code}")
        #If gene does not exist, the first word of the file will be Error
        valid = 'Error' not in response.text[:6]
        if valid:
            get_file_from_url(url,file_path)
        elif raise_exception:
            raise ValueError(f"Symbol: {gene} does not exist in the LOVD database")
        else:
            logging.error("Symbol: %s does not exist in the LOVD database",gene)


def download_database_for_eys_gene(database_name, override=False):
    """
    downloads chosen database
    and handles where it should be saved,
    renames the downloaded (latest) file to appropriate name
    :param database_name: the name of the database
    :param override: should an existing file be overriden with a new one
    """

    url = DATABASES_DOWNLOAD_PATHS[database_name]["url"]
    button_location = DATABASES_DOWNLOAD_PATHS[database_name]["button"]
    clickable = DATABASES_DOWNLOAD_PATHS[database_name]["clickable"]

    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    firefox_options.add_argument('--headless')
    firefox_options.set_preference("browser.download.folderList", 2)
    firefox_options.set_preference("browser.download.manager.showWhenStarting", False)
    firefox_options.set_preference("browser.download.dir", os.path.join(os.getcwd(), "..", "data", database_name))
    firefox_options.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/octet-stream")

    driver = webdriver.Firefox(options=firefox_options)
    driver.get(url)
    WebDriverWait(driver, 30).until(EC.element_to_be_clickable((By.XPATH, clickable)))
    driver.execute_script(button_location)

    time.sleep(30)
    driver.quit()

    save_as = DATABASES_DOWNLOAD_PATHS[database_name]["store_as"]
    os_path = os.path.join(os.getcwd(), "..", "data", database_name, save_as)

    if os.path.exists(os_path) and override:
        os.remove(os_path)
    elif os.path.exists(os_path) and not override:
        print("File already exists")
        return
    list_of_files = glob.glob(os.path.join(os.getcwd(), "..", "data", database_name, '*'))
    latest_file = max(list_of_files, key=os.path.getctime)
    os.rename(latest_file, os_path)


def store_database_for_eys_gene(database_name, override=False):
    """
    calls a function to download a database
    :param database_name: the name of the database that should be downloaded
    :param override: should already existing file be overwritten
    """
    try:
        if database_name not in DATABASES_DOWNLOAD_PATHS:
            raise IndexError(f"Requested {database_name} database is not supported")

        DATABASES_DOWNLOAD_PATHS[database_name]["function"](database_name, override)

    except TimeoutError as e:
        print(f"Error: {e}")
    except selenium.common.InvalidArgumentException as e:
        print(f"Error: {e}")
    except selenium.common.exceptions.WebDriverException as e:
        print(f"Error: {e}")
    except ValueError as e:
        print(f"Error:{e}")
    except IndexError as e:
        print(f"Error:{e}")
    except BadResponseException as e:
        print(f"Error:{e}")
    except DownloadError as e:
        print(f"Error:{e}")


DATABASES_DOWNLOAD_PATHS = {
    "clinvar": {
        "button": 'document.getElementsByName(\"EntrezSystem2.PEntrez.clinVar.clinVar_Entrez_ResultsPanel.Entrez_DisplayBar.SendToSubmit\")[0].click()',
        "url": CLINVAR_URL_EYS,
        "store_as": "clinvar_data.txt",
        "clickable": "/html/body/div[1]/div[1]/form/div[1]/div[5]/div/div[2]/div[2]/div[1]/div/div[1]/a[3]",
        "function": download_database_for_eys_gene
    },
    "gnomad": {
        "button":"document.getElementsByClassName('Button__BaseButton-sc-1eobygi-0 Button-sc-1eobygi-1 indcWT')[4].click()",
        "url": GNOMAD_URL_EYS,
        "store_as": "gnomad_data.csv",
        "clickable": "/html/body/div[1]/div[3]/div[2]/div/div[7]/div[4]/div[2]/button[1]",
        "function": download_database_for_eys_gene
    },
    "lovd": {
        "url": LOVD_FILE_URL_EYS,
        "store_as": "../data/lovd/lovd_data.txt",
        "function": download_lovd_database_for_eys_gene
    }
}
