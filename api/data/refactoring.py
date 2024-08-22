""" Module dedicated for refactoring collected data for further processing """

import os
import logging

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


def get_variant_ids_from_clinvar_name_api(name, count=100):
    """
    Extracts variant ids from ClinVar `name` variable. /n
    key of dictionary is the size of the list of ids.

    :param str name: name of variant
    :param int count: number of ids to extract
    :returns: ids of variants
    :rtype: str
    """

    result = {}
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=clinvar&term="
    clinvar_url = f"{base_url}{name}&retmode=json&retmax={count}"

    request = requests.get(clinvar_url)

    if request.status_code != 200:
        raise ValueError(f"Request failed with status code {request.status_code}")

    data = request.json()

    result['idlist'] = data['esearchresult']['idlist']
    result['count'] = data['esearchresult']['count']

    return result


def extract_nested_json(flat_parsed, parsed_from, required_column, prefix, join_prefix):
    """
    Extracts nested JSON data from dictionary.

    :param DataFrame parsed_from: normalised JSON data
    :param str required_column: column to extract
    :param str prefix: prefix for extracted columns
    """

    data_set = parsed_from.get(required_column, [])
    for idx, data in enumerate(data_set):
        flat_data = pd.json_normalize(data, sep='_')
        flat_data = flat_data.add_prefix(f'{prefix}_{idx}_')
        flat_parsed = flat_parsed.join(flat_data, rsuffix=f'_{idx}_{join_prefix}')


def request_clinvar_api_data(gene_id):
    """
    Requests ClinVar API for data about variant with given id.
    Converts it to pandas dataframe.

    :param str gene_id: id of variant (may be multiple)
    :returns: DataFrame from ClinVar API
    :rtype: DataFrame
    """
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=clinvar&id="
    clinvar_url = f"{base_url}{gene_id}&retmode=json"

    request = requests.get(clinvar_url)

    if request.status_code != 200:
        raise ValueError(f"Request failed with status code {request.status_code}")

    results = request.json()['result']

    flattened_data = []

    for uid in results['uids']:
        entry = results[uid]

        flattened_entry = pd.json_normalize(entry, sep='_')

        variation_set = flattened_entry.at[0, 'variation_set']
        for idx, var_set in enumerate(variation_set):
            flat_var_set = pd.json_normalize(var_set, sep='_')
            flat_var_set = flat_var_set.add_prefix(f'variation_set_{idx}_')

            extract_nested_json(flat_var_set, var_set, 'variation_loc', f'variation_set_{idx}_loc', 'loc')
            extract_nested_json(flat_var_set, var_set, 'variation_xrefs', f'variation_set_{idx}_xrefs', 'xrefs')
            extract_nested_json(flat_var_set, var_set, 'allele_freq_set', f'variation_set_{idx}_allele_freq', 'allele_freq')

            flat_var_set = flat_var_set.drop(
                columns=[f'variation_set_{idx}_variation_loc',
                         f'variation_set_{idx}_variation_xrefs',
                         f'variation_set_{idx}_allele_freq_set'])
            flattened_entry = flattened_entry.join(flat_var_set, rsuffix=f'_{idx}_vs')

        # this extraction is different from the previous ones

        genes = flattened_entry.at[0, 'genes']
        for idx, gene in enumerate(genes):
            flat_genes = pd.json_normalize(gene, sep='_')
            flat_genes = flat_genes.add_prefix(f'gene_{idx}_')
            flattened_entry = flattened_entry.join(flat_genes, rsuffix=f'_{idx}_g')

        germline_classification_trait_set = flattened_entry.at[0,
        'germline_classification_trait_set']
        for idx, germline_set in enumerate(germline_classification_trait_set):
            flat_germline_set = pd.json_normalize(germline_set, sep='_')
            flat_germline_set = flat_germline_set.add_prefix(f'germline_set_{idx}_')

            extract_nested_json(flat_germline_set, germline_set, 'trait_xrefs', f'germline_set_{idx}_trait_xrefs', 'trait_xrefs')

            flat_germline_set = flat_germline_set.drop(columns=[f'germline_set_{idx}_trait_xrefs'])
            flattened_entry = flattened_entry.join(flat_germline_set, rsuffix=f'_{idx}_gls')

        flattened_entry = flattened_entry.drop(columns=['variation_set',
                                                        'genes',
                                                        'germline_classification_trait_set'])

        flattened_data.append(flattened_entry)

    df = pd.concat(flattened_data, ignore_index=True)

    return df


def request_gnomad_api_data(to_file=True):
    """
    Requests gnomAD API for data about EYS gene containing:
    - variant_id
    - cDNA change
    - protein change
    - allele frequency
    - homozygote count
    - popmax
    - popmax population

    :param bool to_file: if True, saves data to variants.csv
    :returns: DataFrame from gnomAD API
    :rtype: DataFrame
    """

    url = 'https://gnomad.broadinstitute.org/api'
    query = """
    query{
      gene(gene_id: "ENSG00000188107", reference_genome: GRCh38) {
        variants(dataset: gnomad_r4)
        {
          variant_id
          chrom
          pos
          ref
          hgvsc
          hgvsp
          alt
          exome {
          ac
          an
          ac_hom
            populations
            {
              id
              ac
              an
            }
          }
          genome
          {
            ac
            an
            ac_hom
            populations
            {
              id
              ac
              an
            }
          }
        }
      }
    }
    """
    response = requests.post(url, json={'query': query})
    if response.status_code == 200:
        data = response.json()['data']['gene']['variants']

        df = pd.json_normalize(data)

        df['total_ac'] = df['exome.ac'].fillna(0) + df['genome.ac'].fillna(0)
        df['total_an'] = df['exome.an'].fillna(0) + df['genome.an'].fillna(0)

        df['cDNA change'] = df['hgvsc'].fillna(0)
        df['Protein change'] = df['hgvsp'].fillna(0)

        df['Allele Frequency'] = df['total_ac'] / df['total_an']
        df['Homozygote Count'] = df['exome.ac_hom'].fillna(0) + df['genome.ac_hom'].fillna(0)
        exome_populations = df['exome.populations']
        genome_populations = df['genome.populations']
        ids = ['afr', 'eas', 'asj', 'sas', 'nfe', 'fin', 'mid', 'amr', 'ami', 'remaining']

        def process_population_data(pop_data, name, pop_ids, index):
            for pop_id in pop_ids:
                df.loc[index, f'{name}_ac_{pop_id}'] = 0
                df.loc[index, f'{name}_an_{pop_id}'] = 0
            if type(pop_data) == list:
                for pop in pop_data:
                    id = pop['id']
                    df.loc[index, f'{name}_ac_{id}'] = pop['ac']
                    df.loc[index, f'{name}_an_{id}'] = pop['an']

        for i in range(len(exome_populations)):
            exome_pop = exome_populations[i]
            process_population_data(exome_pop, 'exome', ids, i)
            genome_pop = genome_populations[i]
            process_population_data(genome_pop, 'genome', ids, i)

        for id in ids:
            df[f'Allele_Frequency_{id}'] = (df[f'exome_ac_{id}'].fillna(0) + df[f'genome_ac_{id}'].fillna(0)) / (
                        df[f'exome_an_{id}'].fillna(0) + df[f'genome_an_{id}'].fillna(0))
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
        for i in range(len(df)):
            max = 0
            maxid = ''
            for id in ids:
                if df.loc[i, f'Allele_Frequency_{id}'] > max:
                    max = df.loc[i, f'Allele_Frequency_{id}']
                    maxid = id
            df.loc[i, 'Popmax'] = max
            df.loc[i, 'Popmax population'] = population_mapping[maxid]
        not_to_drop = ['Popmax', 'Popmax population', 'Homozygote Count', 'Allele Frequency', 'variant_id',
                       'cDNA change', 'Protein change']
        df = df.drop([col for col in df.columns if col not in not_to_drop], axis=1)
        if to_file:
            df.to_csv('variants.csv', index=True)

    else:
        print('Error:', response.status_code)

    return df
