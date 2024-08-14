""" Module dedicated for refactoring collected data for further processing """

import os
import logging

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


def merge_lovd_clinvar(lovd, clinvar):
    """
    merge LOVD and ClinVar dataframes on genomic positions.

    parameters:
    lovd : pd.DataFrame
        LOVD dataframe.
    clinvar : pd.DataFrame
        ClinVar dataframe.

    returns:
    pd.DataFrame
        merged dataframe with combined information from LOVD and ClinVar.
    """

    clinvar[['GRCh38Location_start', 'GRCh38Location_end']] = clinvar['GRCh38Location'].str.split(' - ', expand=True)

    clinvar['GRCh38Location_start'] = clinvar['GRCh38Location_start'].astype(pd.Int64Dtype())
    clinvar['GRCh38Location_end'] = clinvar['GRCh38Location_end'].astype(pd.Int64Dtype())

    start_merge = pd.merge(
        lovd,
        clinvar,
        how="outer",
        left_on="position_g_start",
        right_on="GRCh38Location_start").drop(["Name", "GRCh38Location"], axis=1, errors='raise')

    end_merge = pd.merge(
        lovd,
        clinvar,
        how="outer",
        left_on="position_g_end",
        right_on="GRCh38Location_end").drop(["Name", "GRCh38Location"], axis=1, errors='raise')

    main_frame = start_merge.combine_first(end_merge)

    main_frame = main_frame.rename(columns={
        "Germline classification": "Germline classification_clinvar",
        "Accession": "Accession_clinvar",
    })
    return main_frame


def filter_clinvar_for_eys(clinvar_data):
    """
    filters the ClinVar dataframe.

    parameters:
    clinvar_data : pd.DataFrame
        ClinVar dataframe.

    returns:
    pd.DataFrame
        Filtered dataframe.
    """
    eys_mask = clinvar_data['Name'].str.contains('EYS', case=False, na=False)
    no_del_or_dup_mask = ~clinvar_data['Name'].str.contains('del|dup', case=False, na=False)

    combined_mask = eys_mask & no_del_or_dup_mask
    filtered_clinvar = clinvar_data[combined_mask]

    return filtered_clinvar
