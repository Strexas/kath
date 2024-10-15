"""
Retrieves REVEL scores for specific variants based on chromosomeand position from a CSV file.
"""


import os
import pandas as pd

REVEL_SAVE_PATH = "../../data/revel"
current_script_dir = os.path.dirname(os.path.abspath(__file__))
revel_file = os.path.join(current_script_dir, 'revel_with_transcript_ids')


def get_revel_scores(chromosome, position, save_Path=REVEL_SAVE_PATH):
    """
    Retrieve REVEL scores for variants at a specific chromosome and position.
    
    :param int chromosome: Chromosome number to filter the variants.
    :param int position: Sequence position (hg19) to filter the variants.
    :return: A pandas DataFrame containing the filtered variants with REVEL scores.
    """
    variants = []
    revel_data = pd.read_csv(revel_file)

    variants = revel_data[
        (revel_data['chr'] == chromosome) &
        (revel_data['hg19_pos'] == position)
    ]

    if not os.path.isdir(save_Path):
        os.mkdir(save_Path)

    file_name = os.path.join(save_Path, "Revel_output")

    variants.to_csv(file_name)

    return variants
