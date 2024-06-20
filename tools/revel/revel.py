import pandas as pd
import os

current_script_dir = os.path.dirname(os.path.abspath(__file__))
revel_file = os.path.join(current_script_dir, 'revel_with_transcript_ids')

def get_revel_scores(chromosome, position):
    variants = []
    revel_data = pd.read_csv(revel_file)
    
    variants = revel_data[
        (revel_data['chr'] == chromosome) &
        (revel_data['hg19_pos'] == position)
    ]

    return variants
