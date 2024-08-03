""" Module executes general pipeline for data collection. FILE WILL BE DEPRECATED. """

import logging
import pandas as pd

from .collection import store_database_for_eys_gene
from .refactoring import parse_lovd, set_lovd_dtypes, from_clinvar_name_to_cdna_position
from .constants import (DATA_PATH,
                        LOVD_PATH,
                        GNOMAD_PATH,
                        CLINVAR_PATH)

# Configure logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S")


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


def merge_lovd_clinvar(lovd, clinvar):
    """
        merge LOVD and ClinVar dataframes on genomic positions.

        parameters:
        lovd :  LOVD dataframe.
        clinvar : ClinVar dataframe.

        returns:
        pd.DataFrame: merged dataframe with combined information from `lovd` and `clinvar`.

        """
    start_merge = pd.merge(lovd,
                           clinvar,
                           how="outer",
                           left_on="position_g_start",
                           right_on="GRCh38Location_clinvar").drop(["Name_clinvar", "GRCh38Location_clinvar"],
                                                                   axis=1)

    end_merge = pd.merge(lovd,
                         clinvar,
                         how="outer",
                         left_on="position_g_end",
                         right_on="GRCh38Location_clinvar").drop(["Name_clinvar", "GRCh38Location_clinvar"],
                                                                 axis=1)

    main_frame = start_merge.combine_first(end_merge)

    return main_frame


def main():
    """
    Main function implementing pipeline for data collection and merging of data from
    LOVD, GNOMAD and CLINVAR.
    """

    # Download all data
    store_database_for_eys_gene('lovd', True)
    store_database_for_eys_gene('gnomad', True)
    store_database_for_eys_gene('clinvar', True)

    # Read and convert data
    lovd_data = parse_lovd(LOVD_PATH + "/lovd_data.txt")
    gnomad_data = pd.read_csv(GNOMAD_PATH + "/gnomad_data.csv")
    clinvar_data = pd.read_csv(CLINVAR_PATH + "/clinvar_data.txt", sep='\t')

    set_lovd_dtypes(lovd_data)

    # renaming databases' columns
    gnomad_data.columns += "(gnomad)"
    clinvar_data.columns += "_clinvar"

    variants_on_genome = lovd_data["Variants_On_Genome"].copy()

    variants_on_genome['position_g_start'] = variants_on_genome['position_g_start'].astype(str)
    variants_on_genome['position_g_end'] = variants_on_genome['position_g_end'].astype(str)

    # merge Variants_On_Transcripts with Variants_On_Genome to add position_g_start and position_g_end
    main_frame = pd.merge(lovd_data["Variants_On_Transcripts"],
                          variants_on_genome[['id', 'position_g_start', 'position_g_end']],
                          on='id',
                          how='left')

    # Merging Clinvar
    clinvar = clinvar_data.copy()[["Name_clinvar",
                                   "Germline classification_clinvar",
                                   "Accession_clinvar",
                                   "GRCh38Location_clinvar"]]

    clinvar["VariantOnTranscript/DNA_clinvar"] = (clinvar["Name_clinvar"].
                                                  apply(from_clinvar_name_to_cdna_position))

    main_frame = merge_lovd_clinvar(main_frame, clinvar)
    # MERGING GnomAd
    main_frame = (pd.merge(main_frame,
                           gnomad_data,
                           how="left",
                           left_on="VariantOnTranscript/DNA",
                           right_on="HGVS Consequence(gnomad)").
                  drop("HGVS Consequence(gnomad)",
                       axis=1))

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
    main_frame = pd.merge(main_frame,
                          lovd_with_gnomad,
                          how="left",
                          on=list(main_frame.columns[:13]))

    main_frame.to_csv(DATA_PATH + "/final.csv")


if __name__ == "__main__":
    main()
