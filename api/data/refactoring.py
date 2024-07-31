""" Module dedicated for refactoring collected data for further processing """

import os
import logging

import pandas
import requests

import pandas as pd
from pandas import DataFrame

from .constants import LOVD_TABLES_DATA_TYPES, LOVD_PATH


def set_lovd_dtypes(df_dict):
    """
    Convert data from LOVD format table to desired data format based on specified data types.

    :param dict[str, tuple[DataFrame, list[str]] df_dict: Dictionary of tables saved as DataFrame
    """

    for table_name in df_dict:
        frame: DataFrame = df_dict[table_name]
        for column in frame.columns:
            if column not in LOVD_TABLES_DATA_TYPES[table_name]:
                raise ValueError(f"Column {column} is undefined in LOVD_TABLES_DATA_TYPES")

            match LOVD_TABLES_DATA_TYPES[table_name][column]:
                case "Date":
                    frame[column] = pd.to_datetime(frame[column], errors='coerce')
                case "Boolean":
                    frame[column] = frame[column].map({"0": False, "1": True})
                case "String":
                    frame[column] = frame[column].astype('string')
                case "Integer":
                    frame[column] = pd.to_numeric(frame[column]).astype('Int64')
                case "Double":
                    frame[column] = pd.to_numeric(frame[column]).astype('float')
                case _:
                    raise ValueError(f"Undefined data type: "
                                     f"{LOVD_TABLES_DATA_TYPES[table_name][column]}")


def parse_lovd(path=LOVD_PATH + '/lovd_data.txt'):
    """
    Converts data from text file with LOVD format to dictionary of tables.

    Key is name of table, value is data saved as pandas DataFrame.
    Notes for each table are displayed with log.

    **IMPORTANT:** It doesn't provide types for data inside. Use convert_lovd_to_datatype for this.

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

        # Notify about parsing in log
        logging.info("Parsing file %s using parse_lovd.", path)

        while True:
            line = f.readline()

            if line == '':
                break

            table_name = line.split("##")[1].strip()

            # Save notes for each table
            notes = ""
            i = 1
            line = f.readline()
            while line.startswith("##"):
                notes += f"\n    - Note {i}: {line[3:-1]}"
                i += 1
                line = f.readline()

            # Log notes for each table
            if notes:
                logging.info("[%s]%s", table_name, notes)

            table_header = [column[3:-3] for column in line[:-1].split('\t')]
            frame = DataFrame([], columns=table_header)
            line = f.readline()
            while line != '\n':
                variables = [variable[1:-1] for variable in line[:-1].split('\t')]
                observation = DataFrame([variables], columns=table_header)
                frame = pd.concat([frame, observation], ignore_index=True)
                line = f.readline()

            d[table_name] = frame

            # skip inter tables lines
            [f.readline() for _ in range(1)]  # pylint: disable=expression-not-assigned

    return d


def from_clinvar_name_to_cdna_position(name):
    """
    Custom cleaner to extract cDNA position from Clinvar `name` variable.

    :param str name:
    :returns: extracted cDNA
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


def save_lovd_as_vcf(data, save_to="./lovd.vcf"):
    """
    Gets hg38 variants from LOVD and saves as VCF file.
    :param DataFrame data: LOVD DataFrame with data
    :param str save_to: path where to save VCF file.
    """
    df = data["Variants_On_Genome"]
    if "VariantOnGenome/DNA/hg38" not in df.columns:
        raise ValueError("VariantOnGenome/DNA/hg38 is not in the LOVD DataFrame.")

    save_to_dir = os.path.dirname(save_to)
    if not os.path.exists(save_to_dir):
        os.makedirs(save_to_dir)

    with open(save_to, "w", encoding="UTF-8") as f:
        header = ("##fileformat=VCFv4.2\n"
                  "##contig=<ID=6,length=63719980>\n"
                  "#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO\n")
        f.write(header)
        for variant in df.loc[:, "VariantOnGenome/DNA/hg38"]:
            if len(variant) != 13 or variant[-2] != '>':
                logging.warning("Skipping variant %s", variant)
                continue
            record = ["6", variant[2:-3], ".", variant[-3], variant[-1], ".", ".", "."]

            f.write("\t".join(record))
            f.write("\n")


def request_clinvar_api_data(gene_id: str):
    """
    Requests ClinVar API for data about variant with given id.\n
    Converts it to pandas dataframe.

    :param str gene_id: id of variant (may be multiple)
    :returns: dataframe from ClinVar API
    :rtype: dataframe
    """

    path = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=clinvar&id={gene_id}&retmode=json"

    request = requests.get(path)

    if request.status_code != 200:
        raise ValueError(f"Request failed with status code {request.status_code}")

    data = request.json()

    # Extract the 'result' part of the JSON
    results = data['result']

    # Extract the 'uids' part of the JSON
    flattened_data = []

    for uid in results['uids']:
        entry = results[uid]

        # Using pd.json_normalize to flatten the JSON data
        flattened_entry = pd.json_normalize(entry, sep='_')

        flattened_variation_set = pd.json_normalize(flattened_entry['variation_set'][0], sep='_')
        flattened_variation_xrefs = pd.json_normalize(flattened_variation_set['variation_xrefs'][0], sep='_')
        flattened_variation_loc0 = pd.json_normalize(flattened_variation_set['variation_loc'][0][0],
                                                     sep='_')  # 1/2 frames
        flattened_variation_loc0 = flattened_variation_loc0.add_prefix('0_')
        flattened_variation_loc1 = pd.json_normalize(flattened_variation_set['variation_loc'][0][1],
                                                     sep='_')  # 2/2 frames
        flattened_variation_loc1 = flattened_variation_loc1.add_prefix('1_')
        flattened_allele_freq_set = pd.json_normalize(flattened_variation_set['allele_freq_set'][0], sep='_')

        flattened_genes0 = pd.json_normalize(flattened_entry['genes'][0][0], sep='_')  # 1/2 frames
        flattened_genes0 = flattened_genes0.add_prefix('0_')
        flattened_genes1 = pd.json_normalize(flattened_entry['genes'][0][1], sep='_')  # 2/2 frames
        flattened_genes1 = flattened_genes1.add_prefix('1_')

        flattened_germline_classification_trait_set = pd.json_normalize(
            flattened_entry['germline_classification_trait_set'][0], sep='_')
        flattened_trait_xrefs = pd.json_normalize(flattened_germline_classification_trait_set['trait_xrefs'][0],
                                                  sep='_')

        # dropping extracted nests
        flattened_entry = flattened_entry.drop(columns=['variation_set', 'genes', 'germline_classification_trait_set'],
                                               axis=1)
        flattened_variation_set = flattened_variation_set.drop(
            columns=['variation_xrefs', 'variation_loc', 'allele_freq_set'], axis=1)
        flattened_germline_classification_trait_set = flattened_germline_classification_trait_set.drop(
            columns=['trait_xrefs'], axis=1)

        # adding extracted nests to the frames
        flattened_germline_classification_trait_set = pd.concat(
            [flattened_germline_classification_trait_set, flattened_trait_xrefs], axis=1)

        flattened_variation_set = pd.concat([flattened_variation_set, flattened_variation_xrefs], axis=1)
        flattened_variation_set = pd.concat([flattened_variation_set, flattened_variation_loc0], axis=1)  # might break
        flattened_variation_set = pd.concat([flattened_variation_set, flattened_variation_loc1], axis=1)  # might break
        flattened_variation_set = pd.concat([flattened_variation_set, flattened_allele_freq_set], axis=1)

        flattened_entry = pd.concat([flattened_entry, flattened_variation_set], axis=1)
        flattened_entry = pd.concat([flattened_entry, flattened_genes0], axis=1)
        flattened_entry = pd.concat([flattened_entry, flattened_genes1], axis=1)
        flattened_entry = pd.concat([flattened_entry, flattened_germline_classification_trait_set], axis=1)

        # Append the flattened entry to the list
        flattened_data.append(flattened_entry)

    # Concatenate all flattened entries into a single DataFrame
    df = pd.concat(flattened_data, ignore_index=True)

    return df
