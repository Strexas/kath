"""Module providing a functionality to collect data from various sources."""

import os
import logging
import requests
from requests.exceptions import RequestException
import pandas as pd
from pandas import DataFrame


# EXCEPTIONS
class BadResponseException(Exception):
    """Custom exception for bad responses."""


class DownloadError(Exception):
    """Custom exception for download errors."""

# CONSTANTS
LOVD_VARIABLES_DATA_TYPES = {
    'id': 'String',
    'name': 'String',
    'chromosome': 'Integer',
    'chrom_band': 'String',
    'imprinting': 'String',
    'refseq_genomic': 'String',
    'refseq_UD': 'String',
    'reference': 'String',
    'url_homepage': 'String',
    'url_external': 'String',
    'allow_download': 'Boolean',
    'id_hgnc': 'Integer',
    'id_entrez': 'Integer',
    'id_omim': 'Integer',
    'show_hgmd': 'Boolean',
    'show_genecards': 'Boolean',
    'show_genetests': 'Boolean',
    'show_orphanet': 'Boolean',
    'note_index': 'String',
    'note_listing': 'String',
    'refseq': 'String',
    'refseq_url': 'String',
    'disclaimer': 'Boolean',
    'disclaimer_text': 'String',
    'header': 'String',
    'header_align': 'Integer',
    'footer': 'String',
    'footer_align': 'Integer',
    'created_by': 'Integer',
    'created_date': 'Date',
    'edited_by': 'Integer',
    'edited_date': 'Date',
    'updated_by': 'Integer',
    'updated_date': 'Date',
    'transcriptid': 'Integer',
    'effectid': 'Integer',
    'position_c_start': 'Integer',
    'position_c_start_intron': 'Integer',
    'position_c_end': 'Integer',
    'position_c_end_intron': 'Integer',
    'VariantOnTranscript/DNA': 'String',
    'VariantOnTranscript/RNA': 'String',
    'VariantOnTranscript/Protein': 'String',
    'VariantOnTranscript/Exon': 'String',
    'symbol': 'String',
    'inheritance': 'String',
    'id_omin': 'Integer',
    'tissues': 'String',
    'features': 'String',
    'remarks': 'String',
    'geneid': 'String',
    'id_mutalyzer': 'Integer',
    'id_ncbi': 'String',
    'id_ensembl': 'String',
    'id_protein_ncbi': 'String',
    'id_protein_ensembl': 'String',
    'id_protein_uniprot': 'String',
    'position_c_mrna_start': 'Integer',
    'position_c_mrna_end': 'Integer',
    'position_c_cds_end': 'Integer',
    'position_g_mrna_start': 'Integer',
    'position_g_mrna_end': 'Integer',
    'diseaseid': 'Integer',
    'individualid': 'Integer',
    'Phenotype/Inheritance': 'String',
    'Phenotype/Age': 'String',
    'Phenotype/Additional': 'String',
    'Phenotype/Biochem_param': 'String',
    'Phenotype/Age/Onset': 'String',
    'Phenotype/Age/Diagnosis': 'String',
    'Phenotype/Severity_score': 'String',
    'Phenotype/Onset': 'String',
    'Phenotype/Protein': 'String',
    'Phenotype/Tumor/MSI': 'String',
    'Phenotype/Enzyme/CPK': 'String',
    'Phenotype/Heart/Myocardium': 'String',
    'Phenotype/Lung': 'String',
    'Phenotype/Diagnosis/Definite': 'String',
    'Phenotype/Diagnosis/Initial': 'String',
    'Phenotype/Diagnosis/Criteria': 'String',
    'variants_found': 'Integer',
    'Screening/Technique': 'String',
    'Screening/Template': 'String',
    'Screening/Tissue': 'String',
    'Screening/Remarks': 'String',
    'fatherid': 'String',
    'motherid': 'String',
    'panelid': 'Integer',
    'panel_size': 'Integer',
    'license': 'String',
    'Individual/Reference': 'String',
    'Individual/Remarks': 'String',
    'Individual/Gender': 'String',
    'Individual/Consanguinity': 'String',
    'Individual/Age_of_death': 'String',
    'Individual/VIP': 'String',
    'Individual/Data_av': 'String',
    'Individual/Treatment': 'String',
    'Individual/Origin/Population': 'String',
    'Individual/Individual_ID': 'String',
    'allele': 'Integer',
    'position_g_start': 'Integer',
    'position_g_end': 'Integer',
    'type': 'String',
    'average_frequency': 'Double',
    'VariantOnGenome/DBID': 'String',
    'VariantOnGenome/DNA': 'String',
    'VariantOnGenome/Frequency': 'String',
    'VariantOnGenome/Reference': 'String',
    'VariantOnGenome/Restriction_site': 'String',
    'VariantOnGenome/Published_as': 'String',
    'VariantOnGenome/Remarks': 'String',
    'VariantOnGenome/Genetic_origin': 'String',
    'VariantOnGenome/Segregation': 'String',
    'VariantOnGenome/dbSNP': 'String',
    'VariantOnGenome/VIP': 'String',
    'VariantOnGenome/Methylation': 'String',
    'VariantOnGenome/ISCN': 'String',
    'VariantOnGenome/DNA/hg38': 'String',
    'VariantOnGenome/ClinVar': 'String',
    'VariantOnGenome/ClinicalClassification': 'String',
    'VariantOnGenome/ClinicalClassification/Method': 'String',
    'screeningid': 'Integer',
    'variantid': 'Integer',
    'owned_by': 'Integer',
    'Individual/Origin/Geographic': 'String'
}

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
