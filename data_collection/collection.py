""" Module providing a functionality to collect data from various sources """

import glob
import logging
import os
import time

import requests
from requests import RequestException

import selenium.common
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from .constants import (LOVD_FILE_URL,
                        LOVD_PATH,
                        DATABASES_DOWNLOAD_PATHS)


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

    # check if path is not directory
    if os.path.isdir(save_to):
        raise IsADirectoryError("Specified path is a directory, specify name of file")

    # check if directory exists, if not - create
    directory = os.path.dirname(save_to)
    if not os.path.exists(directory):
        os.makedirs(directory)
        logging.info(f"Created directory: {directory}")

    # check if file exist and needs to override
    if os.path.exists(save_to) and not override:
        raise FileExistsError(f"The file at {save_to} already exists.")

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


def download_genes_lovd(gene_list: list, folder_path=LOVD_PATH, raise_exception=False):
    """
    Downloads data into txt files from gene_list.

    :param list gene_list: list of gene's symbols
    :param str folder_path: folder to save the data
    :param bool raise_exception: raise exception if True, otherwise log
    """

    for gene in gene_list:
        file_path = os.path.join(folder_path, gene + ".txt")
        url = LOVD_FILE_URL + gene
        try:
            response = requests.get(url, timeout=10)
        except RequestException as e:
            raise DownloadError(f"Error while downloading file from {url}") from e

        if response.status_code != 200:
            raise BadResponseException(f"Bad response from {url}."
                                       f" Status code: {response.status_code}")
        # If gene does not exist, the first word of the file will be Error
        valid = 'Error' not in response.text[:6]
        if valid:
            get_file_from_url(url, file_path)
        elif raise_exception:
            raise ValueError(f"Symbol: {gene} does not exist in the LOVD database")
        else:
            logging.error("Symbol: %s does not exist in the LOVD database", gene)


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
    firefox_options.set_preference("browser.download.dir",
                                   os.path.join(os.getcwd(),
                                                "..",
                                                "data",
                                                database_name))
    firefox_options.set_preference("browser.helperApps.neverAsk.saveToDisk",
                                   "application/octet-stream")

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
    :param override: should be already existing file be overwritten
    """

    try:
        if database_name not in DATABASES_DOWNLOAD_PATHS:
            raise IndexError(f"Requested {database_name} database is not supported")

        # pylint: disable=eval-used
        eval(DATABASES_DOWNLOAD_PATHS[database_name]["function"])(database_name, override)

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
