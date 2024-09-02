""" Module dedicated for refactoring collected data for further processing """

import os
import logging

import requests

import pandas as pd
from pandas import DataFrame

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


def add_g_position_to_gnomad(gnomad):
    """
    Create new column 'hg38_gnomAD' from 'gnomAD ID' in the gnomAD dataframe.

    Parameters:
    gnomad : pd.DataFrame
        gnomAD dataframe. This function modifies it in-place.
    """
    gnomad[['chromosome', 'position', 'ref', 'alt']] = gnomad['gnomAD ID'].str.split('-', expand=True)
    gnomad['hg38'] = 'g.' + gnomad['position'] + gnomad['ref'] + '>' + gnomad['alt']
    gnomad.drop(columns=['chromosome', 'position', 'ref', 'alt'], inplace=True)


def merge_gnomad_lovd(lovd, gnomad):
    """
    merge LOVD and gnomAD dataframes on genomic positions.

    parameters:
    lovd : pd.DataFrame
        LOVD dataframe.
    gnomAD : pd.DataFrame
        gnomAD dataframe.

    returns:
    pd.DataFrame
        merged dataframe with combined information from LOVD and gnomAD.
    """

    add_g_position_to_gnomad(gnomad)
    gnomad.columns = [col + '_gnomad' for col in gnomad.columns]

    main_frame = pd.merge(
        lovd,
        gnomad,
        how="outer",
        left_on="VariantOnGenome/DNA/hg38",
        right_on="hg38_gnomad")

    return main_frame


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


def process_population_data(df, pop_data, name, pop_ids, index):
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
    df.loc[:, 'Homozygote Count'] = df.loc[:, 'exome.ac_hom'].fillna(0) + df.loc[:, 'genome.ac_hom'].fillna(0)
    exome_populations = df.loc[:, 'exome.populations']
    genome_populations = df.loc[:, 'genome.populations']
    population_ids = ['afr', 'eas', 'asj', 'sas', 'nfe', 'fin', 'mid', 'amr', 'ami', 'remaining']

    for i in range(len(exome_populations)):
        exome_pop = exome_populations[i]
        process_population_data(df, exome_pop, 'exome', population_ids, i)
        genome_pop = genome_populations[i]
        process_population_data(df, genome_pop, 'genome', population_ids, i)

    for population_id in population_ids:
        df.loc[:, f'Allele_Frequency_{population_id}'] = (
               (df.loc[:, f'exome_ac_{population_id}'].fillna(0) + df.loc[:, f'genome_ac_{population_id}'].fillna(0)) / (
                df.loc[:, f'exome_an_{population_id}'].fillna(0) + df.loc[:, f'genome_an_{population_id}'].fillna(0)))
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
                   'variant_id', 'cDNA change', 'Protein change']

    df = df.filter(not_to_drop, axis="columns")

    df.rename(columns={'variant_id': 'gnomAD ID'})

    return df
