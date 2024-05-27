""" Module dedicated for refactoring collected data for further processing """

import os
import logging
import re

import pandas as pd
import numpy as np
from pandas import DataFrame

from .constants import LOVD_TABLES_DATA_TYPES


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


def parse_lovd(path):
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


def filter_eys_genes(clinvar_data):
    """
    Filters out EYS genes from ClinVar data.

    :param DataFrame clinvar_data: Dataframe data
    :returns: filtered data
    """
    filtered_data = []
    ends = {'del', 'delins', 'dup', 'ins', 'inv', 'subst'}
    for item in clinvar_data["Name"]:
        if "(EYS)" in item:
            match = re.match(r'^.*\(EYS\):(c\.[A-Za-z0-9_]+>[A-Za-z])(?:\s*\(.*\))?', item)
            if match and not any(end in match.group(1) for end in ends):
                filtered_data.append(match.group(1))
            else:
                filtered_data.append("")
        else:
            filtered_data.append("")

    return filtered_data


def lovd_clinvar_merge(lovd, clinvar):
    """
    Merges LOVD and GnomAD data based on the DNA position.

    :param dict[str, dict[DataFrame, str]] lovd: LOVD data
    :param DataFrame clinvar: ClinVar data
    :returns: Merged data
    :rtype: list[str]
    """
    # region_EYS_extraction
    filtered_data = filter_eys_genes(clinvar)

    lovd_data = lovd

    gene_ids = []

    for key, value in lovd_data["Variants_On_Transcripts"]["VariantOnTranscript/DNA"].items():
        if value in filtered_data:
            gene_id = key
            if gene_id:
                gene_ids.append(key)
                print(key)

    final_dna = []
    for key, value in lovd_data["Variants_On_Genome"]["VariantOnGenome/DNA/hg38"].items():
        if key in gene_ids:
            gene = value
            if gene:
                final_dna.append(gene)

    return final_dna
