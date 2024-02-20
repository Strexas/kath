import pandas as pd
from tools import get_file_from_url, from_lovd_to_pandas, from_clinvar_name_to_DNA, store_database

# CONSTANTS
# files
LOVD_URL = "https://databases.lovd.nl/shared/genes/EYS"
LOVD_FILE_URL = "https://databases.lovd.nl/shared/download/all/gene/EYS"

GNOMAD_URL = "https://gnomad.broadinstitute.org/gene/ENSG00000188107?dataset=gnomad_r4"
GNOMAD_FILE_URL = "https://drive.usercontent.google.com/u/0/uc?id=1crkDCVcC0PSnv0JPGj3FpemBs28-T_3y&export=download"

CLINVAR_URL = "https://www.ncbi.nlm.nih.gov/clinvar/?term=eys%5Bgene%5D&redir=gene"
CLINVAR_FILE_URL = "https://drive.usercontent.google.com/u/0/uc?id=1RK5XBK3k5h0K6f-qfwJSQj7tlF-H2U6u&export=download"

# path
DATA_PATH = "../data"
LOVD_PATH = DATA_PATH + "/lovd"
GNOMAD_PATH = DATA_PATH + "/gnomad"
CLINVAR_PATH = DATA_PATH + "/clinvar"


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
        'South Asian',
        'Remaining'
    ]

    max_freq = 0
    max_pop = population_groups[0]

    for group in population_groups:
        count_column = f'Allele Count {group}(gnomad)'
        number_column = f'Allele Number {group}(gnomad)'
        freq = row[count_column] / row[number_column]

        if freq > max_freq:
            max_freq = freq
            max_pop = group

    return pd.Series([max_freq, max_pop], index=['PopMax', 'PopMax population'])


# MAIN
# Download all data
get_file_from_url(LOVD_FILE_URL, LOVD_PATH + f"/lovd_data.txt", override=True)
#get_file_from_url(GNOMAD_FILE_URL, GNOMAD_PATH + f"/gnomad_data.csv", override=True)
#get_file_from_url(CLINVAR_FILE_URL, CLINVAR_PATH + f"/clinvar_data.txt", override=True)
store_database('gnomad', True)
store_database('clinvar', True)

# Read and convert data
lovd_data = from_lovd_to_pandas(LOVD_PATH + "/lovd_data.txt")
gnomad_data = pd.read_csv(GNOMAD_PATH + "/gnomad_data.csv")
clinvar_data = pd.read_csv(CLINVAR_PATH + "/clinvar_data.txt", sep='\t')

# renaming databases' columns
gnomad_data.columns += "(gnomad)"
clinvar_data.columns += "(clinvar)"

# Reading main working table
main_frame = lovd_data["Variants_On_Transcripts"][0].copy()
notes = lovd_data["Variants_On_Transcripts"][1][::]

# Merging Clinvar
clinvar = clinvar_data.copy()[["Name(clinvar)", "Germline classification(clinvar)", "Accession(clinvar)"]]
clinvar["VariantOnTranscript/DNA"] = clinvar["Name(clinvar)"].apply(from_clinvar_name_to_DNA)

main_frame = pd.merge(main_frame,
                      clinvar,
                      how="outer",
                      on=["VariantOnTranscript/DNA"]).drop("Name(clinvar)", axis=1)

# MERGING GnomAd
main_frame = pd.merge(main_frame,
                      gnomad_data,
                      how="left",
                      left_on="VariantOnTranscript/DNA",
                      right_on="HGVS Consequence(gnomad)").drop("HGVS Consequence(gnomad)", axis=1)


# Calculating frequencies
lovd_without_association_in_gnomad = pd.isnull(main_frame["Hemizygote Count Remaining(gnomad)"])
lovd_with_gnomad = main_frame[~lovd_without_association_in_gnomad].copy()
max_values = lovd_with_gnomad.apply(calculate_max_frequency, axis=1)
lovd_with_gnomad[['PopMax(gnomad)', 'PopMax population(gnomad)']] = max_values

# Leaving necessary columns

lovd_with_gnomad = lovd_with_gnomad.loc[:, ['id',
                                            'transcriptid',
                                            'effectid',
                                            'position_c_start',
                                            'position_c_start_intron',
                                            'position_c_end',
                                            'position_c_end_intron',
                                            'VariantOnTranscript/DNA',
                                            'VariantOnTranscript/RNA',
                                            'VariantOnTranscript/Protein',
                                            'VariantOnTranscript/Exon',
                                            'Germline classification(clinvar)',
                                            'Accession(clinvar)',
                                            'Allele Frequency(gnomad)',
                                            'Homozygote Count(gnomad)',
                                            'PopMax(gnomad)',
                                            'PopMax population(gnomad)']]

# final join
main_frame = main_frame.iloc[:, range(13)]
main_frame = pd.merge(main_frame, lovd_with_gnomad, how="left", on=list(main_frame.columns[:13]))

main_frame.to_csv(DATA_PATH + "/final.csv")
