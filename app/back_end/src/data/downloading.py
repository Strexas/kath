""" Module providing a functionality to collect data from various sources """

import glob
import logging
import os
import time

import requests
import pandas as pd
from pandas.core.interchange.dataframe_protocol import DataFrame
from requests import RequestException

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait

from .constants import (LOVD_FILE_URL,
                        LOVD_PATH,
                        DATABASES_DOWNLOAD_PATHS,
                        LOVD_FILE_URL_EYS,
                        STORE_AS_LOVD,
                        STORE_AS_GNOMAD)


# EXCEPTIONS
class BadResponseException(Exception):
    """Custom exception for bad responses."""


class DownloadError(Exception):
    """Custom exception for download errors."""


def get_file_from_url(url:str, save_to:str, override:bool=False):
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
        logging.info("Created directory: %s", directory)

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


def download_lovd_database_for_eys_gene(save_to:str = STORE_AS_LOVD, override:bool=False):
    """
    Gets file from url and saves it into provided path. Overrides, if override is True.

    :param str save_to: path to save (default: 'data/lovd/lovd_eys.txt')
    :param bool override: needs override
    """

    url = LOVD_FILE_URL_EYS

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


def download_genes_lovd(gene_list: list, folder_path:str=LOVD_PATH, raise_exception:bool=False):
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


def download_database_for_eys_gene(database_name:str, override:bool=False):
    """
    downloads chosen database
    and handles where it should be saved,
    renames the downloaded (latest) file to appropriate name
    :param database_name: the name of the database
    :param override: should an existing file be overriden with a new one
    """

    save_as = DATABASES_DOWNLOAD_PATHS[database_name]["store_as"]
    os_path = os.path.join(os.getcwd(), "..", "data", database_name, save_as)

    if os.path.exists(os_path) and override:
        os.remove(os_path)
    elif os.path.exists(os_path) and not override:
        return

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
    WebDriverWait(driver, 30).until(ec.element_to_be_clickable((By.XPATH, clickable)))
    driver.execute_script(button_location)

    time.sleep(30)
    driver.quit()

    list_of_files = glob.glob(os.path.join(os.getcwd(), "..", "data", database_name, '*'))
    latest_file = max(list_of_files, key=os.path.getctime)
    os.rename(latest_file, os_path)


def download_selected_database_for_eys_gene(database_name:str, save_path:str="", override:bool=False):
    """
    Calls a function to download a database.

    :param database_name: the name of the database that should be downloaded
    :param save_path: path to save the data
    :param override: should be already existing file be overwritten
    """
    if not isinstance(database_name, str):
        raise TypeError("Database name should be a string")

    database_name = database_name.lower()

    # if save_path is not provided, save to default location
    if database_name == "lovd" and save_path == "":
        save_path = STORE_AS_LOVD
    elif database_name == "gnomad" and save_path == "":
        save_path = STORE_AS_GNOMAD

    # check if database_name is supported
    if database_name not in DATABASES_DOWNLOAD_PATHS:
        raise IndexError(f"Requested for {database_name} database is not supported")

    # download the database
    if database_name == "lovd":
        download_lovd_database_for_eys_gene(save_path, override)
    elif database_name == "gnomad":
        download_data_from_gnomad_eys(save_path, override)
    else:
        raise IndexError(f"Requested for {database_name} is not yet supported")


def prepare_popmax_calculation(df:pd.DataFrame, pop_data:dict, name:str, pop_ids:list[str], index:int):
    """
    prepares the calculation of popmax and popmax population for a variant.
    genome and exome data of ac and an.

    :param DataFrame df: DataFrame containing gnomAD data
    :param dict pop_data: dictionary containing population data
    :param str name: name of the population
    :param list[str] pop_ids: list of population ids
    :param int index: index of the variant
    """

    for pop_id in pop_ids:
        df.loc[index, f'{name}_ac_{pop_id}'] = 0
        df.loc[index, f'{name}_an_{pop_id}'] = 0
    if isinstance(pop_data, list):
        for pop in pop_data:
            variant_id = pop['id']
            df.loc[index, f'{name}_ac_{variant_id}'] = pop['ac']
            df.loc[index, f'{name}_an_{variant_id}'] = pop['an']


def download_data_from_gnomad_eys(path:str=STORE_AS_GNOMAD, override:bool=False):
    """
    Requests gnomAD API for data about a specific gene containing:
    - variant_id
    - cDNA change
    - protein change
    - allele frequency
    - homozygote count
    - popmax
    - popmax population

    :param str path: path to save the data (default: 'app/back_end/src/workspace/gnomad/gnomad_data.csv')
    :param bool override: should an existing file be overriden with a new one
    """

    # Ensure the directory exists
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)

    if os.path.exists(path) and not override:
        print(f"The file at {path} already exists.")
        logging.info("The file at %s already exists.", path)
        return

    url = 'https://gnomad.broadinstitute.org/api'
    query = f"""
    query{{
      gene(gene_symbol: "EYS", reference_genome: GRCh38) {{
        variants(dataset: gnomad_r4)
        {{
          variant_id
          chrom
          pos
          ref
          hgvsc
          hgvsp
          alt
          exome {{
          ac
          an
          ac_hom
            populations
            {{
              id
              ac
              an
            }}
          }}
          genome
          {{
            ac
            an
            ac_hom
            populations
            {{
              id
              ac
              an
            }}
          }}
        }}
      }}
    }}
    """

    response = requests.post(url, json={'query': query}, timeout=300)  # timeout set to 5 minutes

    if response.status_code != 200:
        if not os.path.isfile(path):
            f = open('logs.txt', 'x')
            f.write(response.text)
            logging.error("Error while downloading data from gnomAD API. Check logs.txt for more information.")
        else:
            f = open('logs.txt', 'a')
            f.write(response.text)
            logging.error("Error while downloading data from gnomAD API. Check logs.txt for more information.")

    data = response.json()['data']['gene']['variants']

    df = pd.json_normalize(data)

    df.loc[:, 'total_ac'] = df.loc[:, 'exome.ac'].fillna(0) + df.loc[:, 'genome.ac'].fillna(0)
    df.loc[:, 'total_an'] = df.loc[:, 'exome.an'].fillna(0) + df.loc[:, 'genome.an'].fillna(0)

    df.loc[:, 'HGVS Consequence'] = df.loc[:, 'hgvsc'].fillna(0)  # cDNA change
    df.loc[:, 'Protein Consequence'] = df.loc[:, 'hgvsp'].fillna(0)  # Protein change

    df.loc[:, 'Allele Frequency'] = df.loc[:, 'total_ac'] / df.loc[:, 'total_an']
    df.loc[:, 'Homozygote Count'] = df.loc[:, 'exome.ac_hom'].fillna(0) + df.loc[:, 'genome.ac_hom'].fillna(0)
    exome_populations = df.loc[:, 'exome.populations']
    genome_populations = df.loc[:, 'genome.populations']
    population_ids = ['afr', 'eas', 'asj', 'sas', 'nfe', 'fin', 'mid', 'amr', 'ami', 'remaining']

    for i in range(len(exome_populations)):
        exome_pop = exome_populations[i]
        prepare_popmax_calculation(df, exome_pop, 'exome', population_ids, i)
        genome_pop = genome_populations[i]
        prepare_popmax_calculation(df, genome_pop, 'genome', population_ids, i)

    for population_id in population_ids:
        df.loc[:, f'Allele_Frequency_{population_id}'] = (
               (df.loc[:, f'exome_ac_{population_id}'].fillna(0) + df.loc[:, f'genome_ac_{population_id}'].fillna(0)) /
               (df.loc[:, f'exome_an_{population_id}'].fillna(0) + df.loc[:, f'genome_an_{population_id}'].fillna(0)))
    population_mapping = {
            'afr': 'African/African American',
            'eas': 'East Asian',
            'asj': 'Ashkenazi Jew',
            'sas': 'South Asian',
            'nfe': 'European (non-Finnish)',
            'fin': 'European (Finnish)',
            'mid': 'Middle Eastern',
            'amr': 'Admixed American',
            'ami': "Amish",
            'remaining': 'Remaining',
            '': ''
        }

    for i in range(df.shape[0]):
        max_pop = 0
        max_id = ''
        for population_id in population_ids:
            if df.loc[i, f'Allele_Frequency_{population_id}'] > max_pop:
                max_pop = df.loc[i, f'Allele_Frequency_{population_id}']
                max_id = population_id
        df.loc[i, 'Popmax'] = max_pop
        df.loc[i, 'Popmax population'] = population_mapping[max_id]
    not_to_drop = ['Popmax', 'Popmax population', 'Homozygote Count', 'Allele Frequency',
                   'variant_id', 'cDNA change', 'Protein change', 'gnomAD ID']

    df.rename(columns={'variant_id': 'gnomAD ID'})

    df = df.filter(not_to_drop, axis="columns")

    if not os.path.isfile(path) or override:
        df.to_csv(path, index=False)