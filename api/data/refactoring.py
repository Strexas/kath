""" Module dedicated for refactoring collected data for further processing """

import os
import logging
import re

import requests

import pandas as pd
from pandas import DataFrame

from pyliftover import LiftOver

from .constants import LOVD_TABLES_DATA_TYPES, LOVD_PATH, GNOMAD_TABLES_DATA_TYPES, GNOMAD_PATH



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


def prepare_popmax_calculation(df, pop_data, name, pop_ids, index):
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


def request_gnomad_api_data(gene_name):
    """
    Requests gnomAD API for data about a specific gene containing:
    - variant_id
    - cDNA change
    - protein change
    - allele frequency
    - homozygote count
    - popmax
    - popmax population

    :param str gene_name: name of gene
    :param bool to_file: if True, saves data to variants.csv
    :returns: DataFrame from gnomAD API
    :rtype: DataFrame
    """

    url = 'https://gnomad.broadinstitute.org/api'
    query = f"""
    query{{
      gene(gene_symbol: "{gene_name}", reference_genome: GRCh38) {{
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
        print('Error:', response.status_code)

    data = response.json()['data']['gene']['variants']

    df = pd.json_normalize(data)

    df.loc[:, 'total_ac'] = df.loc[:, 'exome.ac'].fillna(0) + df.loc[:, 'genome.ac'].fillna(0)
    df.loc[:, 'total_an'] = df.loc[:, 'exome.an'].fillna(0) + df.loc[:, 'genome.an'].fillna(0)

    df.loc[:, 'HGVS Consequence'] = df.loc[:, 'hgvsc'].fillna(0)  # cDNA change
    df.loc[:, 'Protein Consequence'] = df.loc[:, 'hgvsp'].fillna(0)  # Protein change

    df.loc[:, 'Allele Frequency'] = df.loc[:, 'total_ac'] / df.loc[:, 'total_an']
    df.loc[:, 'Homozygote Count'] = (df.loc[:, 'exome.ac_hom'].fillna(0)
                                     + df.loc[:, 'genome.ac_hom'].fillna(0))
    exome_populations = df.loc[:, 'exome.populations']
    genome_populations = df.loc[:, 'genome.populations']
    population_ids = ['afr', 'eas', 'asj', 'sas', 'nfe', 'fin', 'mid', 'amr', 'ami', 'remaining']

    for i in range(exome_populations.shape[0]):
        exome_pop = exome_populations[i]
        prepare_popmax_calculation(df, exome_pop, 'exome', population_ids, i)
        genome_pop = genome_populations[i]
        prepare_popmax_calculation(df, genome_pop, 'genome', population_ids, i)

    for population_id in population_ids:
        df.loc[:, f'Allele_Frequency_{population_id}'] = (
               (df.loc[:, f'exome_ac_{population_id}'].fillna(0)
                + df.loc[:, f'genome_ac_{population_id}'].fillna(0))
               / (df.loc[:, f'exome_an_{population_id}'].fillna(0)
                  + df.loc[:, f'genome_an_{population_id}'].fillna(0)))

    find_popmax_in_gnomad(df)
    not_to_drop = ['Popmax', 'Popmax population', 'Homozygote Count', 'Allele Frequency',
                   'variant_id', 'cDNA change', 'Protein change']

    df = df.filter(not_to_drop, axis="columns")

    df.rename(columns={'variant_id': 'gnomAD ID'})

    return df
