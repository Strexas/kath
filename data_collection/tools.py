import requests
import os
import pandas as pd
from pandas import DataFrame


# Exceptions
class BadResponseException(Exception):
    pass


class DownloadError(Exception):
    pass


# CONSTANTS
LOVD_DATA_TYPES = {
    'Genes': {
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
        'updated_date': 'Date'
    },
    'Variants_On_Transcripts': {
        'id': 'Integer',
        'transcriptid': 'Integer',
        'effectid': 'Integer',
        'position_c_start': 'Integer',
        'position_c_start_intron': 'Integer',
        'position_c_end': 'Integer',
        'position_c_end_intron': 'Integer',
        'VariantOnTranscript/DNA': 'String',
        'VariantOnTranscript/RNA': 'String',
        'VariantOnTranscript/Protein': 'String',
        'VariantOnTranscript/Exon': 'String'
    },
    'Diseases': {
        'id': 'Integer',
        'symbol': 'String',
        'name': 'String',
        'inheritance': 'String',
        'id_omim': 'Integer',
        'tissues': 'String',
        'features': 'String',
        'remarks': 'String',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date'
    },
    'Transcripts': {
        'id': 'Integer',
        'geneid': 'String',
        'name': 'String',
        'id_mutalyzer': 'Integer',
        'id_ncbi': 'String',
        'id_ensembl': 'String',
        'id_protein_ncbi': 'String',
        'id_protein_ensembl': 'String',
        'id_protein_uniprot': 'String',
        'remarks': 'String',
        'position_c_mrna_start': 'Integer',
        'position_c_mrna_end': 'Integer',
        'position_c_cds_end': 'Integer',
        'position_g_mrna_start': 'Integer',
        'position_g_mrna_end': 'Integer',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date'
    },
    'Phenotypes': {
        'id': 'Integer',
        'diseaseid': 'Integer',
        'individualid': 'Integer',
        'owned_by': 'Integer',
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
        'Phenotype/Diagnosis/Criteria': 'String'
    },
    'Screenings': {
        'id': 'Integer',
        'individualid': 'Integer',
        'variants_found': 'Integer',
        'owned_by': 'Integer',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date',
        'Screening/Technique': 'String',
        'Screening/Template': 'String',
        'Screening/Tissue': 'String',
        'Screening/Remarks': 'String'
    },
    'Individuals': {
        'id': 'Integer',
        'fatherid': 'String',
        'motherid': 'String',
        'panelid': 'Integer',
        'panel_size': 'Integer',
        'license': 'String',
        'owned_by': 'Integer',
        'Individual/Reference': 'String',
        'Individual/Remarks': 'String',
        'Individual/Gender': 'String',
        'Individual/Consanguinity': 'String',
        'Individual/Origin/Geographic': 'String',
        'Individual/Age_of_death': 'String',
        'Individual/VIP': 'String',
        'Individual/Data_av': 'String',
        'Individual/Treatment': 'String',
        'Individual/Origin/Population': 'String',
        'Individual/Individual_ID': 'String'
    },
    'Variants_On_Genome': {
        'id': 'Integer',
        'allele': 'Integer',
        'effectid': 'Integer',
        'chromosome': 'Integer',
        'position_g_start': 'Integer',
        'position_g_end': 'Integer',
        'type': 'String',
        'average_frequency': 'Double',
        'owned_by': 'Integer',
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
        'VariantOnGenome/ClinicalClassification/Method': 'String'
    },
    'Screenings_To_Variants': {
        'screeningid': 'Integer',
        'variantid': 'Integer'
    }
}


def get_file_from_url(url, save_to, override=False):
    """
    Gets file from url and saves it into provided path. Overrides, if override is True.

    :param str url: link with file
    :param str save_to: path to save
    :param bool override: needs override
    """

    try:
        # check if directory exists, if not - create
        save_to_dir = os.path.dirname(save_to)
        if not os.path.exists(save_to_dir):
            os.makedirs(save_to_dir)

        # check if file exist and needs to override
        if os.path.exists(save_to) and not override:
            print(f"The file at {save_to} already exists.")
            return

        try:
            response = requests.get(url)
        except requests.exceptions.RequestException as e:
            raise DownloadError(f"Error downloading file from {url}: {e}")

        if response.status_code != 200:
            raise BadResponseException(f"Bad response from {url}. Status code: {response.status_code}")

        with open(save_to, "wb") as f:
            f.write(response.content)

    # check request exceptions
    except BadResponseException as e:
        print(f"Error: {e}")

    except DownloadError as e:
        print(f"Error: {e}")

    except Exception as e:
        print(f"Error: {e}")


# write a function which takes a dictionary of tables and converts the data from LOVD format to the desired data format based on the specified data types
def convert_lovd_to_datatypes(table):
    """
    Converts data from LOVD format to the desired data format based on the specified data types.

    :param dict[str, tuple[DataFrame, list[str]]] table: dictionary of tables
    :returns: dictionary of tables with converted data types
    :rtype: dict[str, tuple[DataFrame, list[str]]]
    """

    try:
        for table_name, (frame, notes) in table.items():
            if table_name in LOVD_DATA_TYPES:
                frame = frame.astype(LOVD_DATA_TYPES[table_name])

            table[table_name] = (frame, notes)

        return table
    except Exception as e:
        print(f"Error: {e}")


def convert_lovd_to_datatype(table):
    """
    Convert data from LOVD format table to desired data format based on specified data types.

    :param dict table: Dictionary of tables where each table is represented by its name
     and contains a tuple with a DataFrame and a list of notes.
    """

    for constant_table_name, attributes in LOVD_DATA_TYPES.items():
        frame, notes = table[constant_table_name]
        for column, data_type in attributes.items():
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
                case _:
                    continue


def from_lovd_to_pandas(path):
    """
    Converts data from text file with LOVD format to dictionary of tables. \
    Key is name of table, value is tuple, where first element is data saved as \
    pandas DataFrame and second element is list of notes.

    :param str path: path to text file
    :returns: dictionary of tables
    :rtype: dict[str, tuple[DataFrame, list[str]]]
    """

    try:
        # Check if the file exists
        if not os.path.exists(path):
            raise FileNotFoundError(f"The file at {path} does not exist.")

        d = dict()

        with open(path) as f:
            # skip header
            [f.readline() for _ in range(4)]

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

                d[table_name] = (frame, notes)
                # skip inter tables lines
                [f.readline() for _ in range(1)]

        return d
    except FileNotFoundError as e:
        print(f"Error: {e}")

    except Exception as e:
        print(f"Error: {e}")


def from_clinvar_name_to_DNA(name):
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


def calculate_max_frequency(row):
    """
    Calculating maximum allele frequency in GNOMAD row.

    :param row: row in dataframe
    :returns: panda series with 'PopMax', 'PopMax population' fields
    :rtype: pd.Series
    """

    population_groups = [
        'Admixed American',
        'African/African American',
        'Amish',
        'Ashkenazi Jewish',
        'East Asian',
        'European (Finnish)',
        'European (non-Finnish)',
        'Middle Eastern',
        'South Asian']

    max_freq = 0
    max_pop = population_groups[0]

    for group in population_groups:
        count_column = f'Allele Count {group}(gnomad)'
        number_column = f'Allele Number {group}(gnomad)'
        freq = row[count_column] / row[number_column]
        if (freq > max_freq):
            max_freq = freq
            max_pop = group

    return pd.Series([max_freq, max_pop], index=['PopMax', 'PopMax population'])
