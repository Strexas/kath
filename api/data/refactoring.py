""" Module dedicated for refactoring collected data for further processing """

import os
import logging
import re


import pandas as pd
from pandas import DataFrame

from pyliftover import LiftOver

from .constants import LOVD_TABLES_DATA_TYPES, LOVD_PATH, GNOMAD_TABLES_DATA_TYPES, GNOMAD_PATH, \
    DEFAULT_SAVE_PATH


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


def set_gnomad_dtypes(df):
    """
    Convert data from gnomAD format table to desired data format based on specified data types.

    :param DataFrame df: DataFrame containing gnomAD data
    """

    for column in df.columns:
        if column not in GNOMAD_TABLES_DATA_TYPES:
            raise ValueError(f"Column {column} is undefined in GNOMAD_TABLES_DATA_TYPES")
        match GNOMAD_TABLES_DATA_TYPES[column]:
            case "Date":
                df[column] = pd.to_datetime(df[column], errors='coerce')
            case "Boolean":
                df[column] = df[column].map({"0": False, "1": True})
            case "String":
                df[column] = df[column].astype('string')
            case "Integer":
                df[column] = pd.to_numeric(df[column], errors='coerce').astype('Int64')
            case "Double":
                df[column] = pd.to_numeric(df[column], errors='coerce').astype('float')
            case _:
                raise ValueError(f"Undefined data type: {GNOMAD_TABLES_DATA_TYPES[column]}")


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


def parse_gnomad(path=GNOMAD_PATH + '/gnomad_data.csv'):
    """
    Parses data from a gnomAD format text file into a pandas DataFrame.

    :param str path: path to the gnomAD data file
    :returns: pandas DataFrame containing gnomAD data
    :rtype: pd.DataFrame
    """

    # Check if the file exists
    if not os.path.exists(path):
        raise FileNotFoundError(f"The file at {path} does not exist.")
    logging.info("Parsing file %s using parse_gnomad.", path)
    try:
        gnomad_data = pd.read_csv(path, sep=',', encoding='UTF-8')
        return gnomad_data
    except Exception as e:
        logging.error("Error parsing gnomAD data: %s", str(e))
        raise e


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


def lovd_fill_hg38(lovd: pd.DataFrame):
    """
    Fills missing hg38 values in the LOVD dataframe
    by converting hg19 values to hg38.
    New column 'hg38_gnomad_format' is added to store
    the converted positions in the format '6-position-ref-alt'.
    :param lovd: pandas DataFrame containing following columns:
               - 'VariantOnGenome/DNA': hg19 values.
               - 'VariantOnGenome/DNA/hg38': hg38 values.
    :return: None: Modifies the input DataFrame in-place by adding
                'hg38_gnomad_format' column.
    """

    if lovd.empty:
        return
    lovd.loc[:,'hg38_gnomad_format'] = lovd.loc[:,'VariantOnGenome/DNA/hg38'].replace('', pd.NA)
    missing_hg38_mask = lovd.loc[:,'hg38_gnomad_format'].isna()
    lovd.loc[missing_hg38_mask, 'hg38_gnomad_format'] = (lovd.loc[missing_hg38_mask,
                                                                'VariantOnGenome/DNA'].
                                                         apply(convert_hg19_if_missing))
    lovd.loc[:,'hg38_gnomad_format'] = lovd.loc[:,'hg38_gnomad_format'].apply(convert_to_gnomad_gen)


def convert_hg19_if_missing(hg19: str, lo = LiftOver('hg19', 'hg38')):
    """
    Converts hg19 variant to hg38 if hg38 is missing.
    :param hg19: a row from the DataFrame.
    :param lo: converter for genomic data between reference assemblies
    :return: hg38 value or a conversion of the hg19 value in the format 'g.positionref>alt'.
    """

    if pd.isna(hg19) or '_' in hg19:
        return "?"

    match = re.search(r'g\.(\d+)', hg19)
    if not match:
        return '?'

    position_str = match.group(1)
    new_pos = lo.convert_coordinate('chr6', int(position_str))[0][1]
    return f"g.{new_pos}{hg19[-3:]}"



def convert_to_gnomad_gen(variant: str):
    """
    converts a variant string from hg38 format
    to the format used by gnomAD ('6-position-ref-alt').
    :param variant: str: the variant in the format 'g.startRef>Alt'.
    :return: str: variant formatted as '6-position-ref-alt'
    or '?' if the input contains interval ranges or is invalid.
    """

    patterns = {
        'dup': re.compile(r'^g\.(\d+)dup$'),
        'del': re.compile(r'^g\.(\d+)del$'),
        'ref_alt': re.compile(r'^g\.(\d+)([A-Z])>([A-Z])$')
    }

    match = patterns['dup'].match(variant)
    if match:
        position = match.group(1)
        return f"6-{position}-dup"

    match = patterns['del'].match(variant)
    if match:
        position = match.group(1)
        return f"6-{position}-del"

    match = patterns['ref_alt'].match(variant)
    if match:
        position = match.group(1)
        ref = match.group(2)
        alt = match.group(3)
        return f"6-{position}-{ref}-{alt}"

    return "?"


def merge_gnomad_lovd(lovd, gnomad):
    """
    Merge LOVD and gnomAD dataframes on genomic positions.

    Parameters:
    lovd : pd.DataFrame
        LOVD dataframe.
    gnomAD : pd.DataFrame
        gnomAD dataframe.

    Returns:
    pd.DataFrame
        Merged dataframe with combined information from LOVD and gnomAD.
    """

    lovd_fill_hg38(lovd)
    gnomad.columns = [col + '_gnomad' for col in gnomad.columns]

    merged_frame = pd.merge(
        lovd,
        gnomad,
        how="outer",
        left_on="hg38_gnomad_format",
        right_on="gnomAD ID_gnomad"
    )

    return merged_frame


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


def find_popmax_in_gnomad(data):
    """
    Finds popmax in gnomad data
    :param DataFrame data: Gnomad data.
    """

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
    population_ids = ['afr', 'eas', 'asj', 'sas', 'nfe', 'fin', 'mid', 'amr', 'ami', 'remaining']

    for i in range(data.shape[0]):
        max_pop = 0
        max_id = ''
        for population_id in population_ids:
            if data.loc[i, f'Allele_Frequency_{population_id}'] > max_pop:
                max_pop = data.loc[i, f'Allele_Frequency_{population_id}']
                max_id = population_id
        data.loc[i, 'Popmax'] = max_pop
        data.loc[i, 'Popmax population'] = population_mapping[max_id]


def routing_merge(lovd_path:str=LOVD_PATH,
                  gnomad_path:str=GNOMAD_PATH,
                  save_path:str=DEFAULT_SAVE_PATH,
                  overwrite:bool=False):
    """
    Merges data from provided paths and saves to new location
    :param overwrite: does file requires overwriting
    :param lovd_path: path to LOVD dataframe
    :param gnomad_path: path to gnomAD dataframe
    :param save_path: path where to save merged data
    :return: None
    """

    save_as = os.path.join(save_path, "lovd_gnomad.csv")

    if os.path.exists(save_as) and not overwrite:
        return

    if not os.path.exists(save_path):
        os.makedirs(save_path)

    if not os.path.exists(os.path.join(lovd_path, "lovd_data.txt")):
        raise FileNotFoundError(f"LOVD data file not found at: {lovd_path}")

    if not os.path.exists(os.path.join(gnomad_path, "gnomad_data.csv")):
        raise FileNotFoundError(f"gnomAD data file not found at: {gnomad_path}")

    lovd_data = parse_lovd(lovd_path + "/lovd_data.txt")
    gnomad_data = parse_gnomad(gnomad_path + '/gnomad_data.csv')

    set_lovd_dtypes(lovd_data)
    set_gnomad_dtypes(gnomad_data)

    # Extract "Variants_On_Genome" and merge it with "Variants_On_Transcripts"
    variants_on_genome = lovd_data["Variants_On_Genome"].copy()
    gnomad_data = gnomad_data.copy()

    lovd_data = pd.merge(
        lovd_data["Variants_On_Transcripts"],
        variants_on_genome[['id', 'VariantOnGenome/DNA', 'VariantOnGenome/DNA/hg38']],
        on='id',
        how='left'
    )

    final_data = merge_gnomad_lovd(lovd_data, gnomad_data)

    try:
        final_data.to_csv(save_as)
        print(f"Merged data saved to {save_path}")
    except OSError as e:
        print(f"Error saving file: {e}")
