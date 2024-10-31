import os
import pandas as pd

current_script_dir = os.path.dirname(os.path.abspath(__file__))
revel_file = os.path.join(current_script_dir, 'revel_with_transcript_ids')

import pandas as pd

def get_revel_scores(revel_file, chromosome, grch38_position, ref=None, alt=None, amino_acid_ref=None, amino_acid_alt=None):
    """
    Retrieve REVEL scores for specific variants based on criteria.
    
    Parameters:
    - revel_file: Path to the REVEL data file.
    - chromosome: Chromosome number of the variant (e.g., '1' for chromosome 1).
    - grch38_position: Position of the variant on the chromosome (GRCh38 build).
    - ref (optional): Reference nucleotide base at the variant position.
    - alt (optional): Alternate nucleotide base at the variant position.
    - amino_acid_ref (optional): Reference amino acid.
    - amino_acid_alt (optional): Alternate amino acid.
    
    Returns:
    - List of matching variants with REVEL scores.
    """
    
    variants = []
    revel_data = pd.read_csv(revel_file)
    
    for index, row in revel_data.iterrows():
        if row['chr'] == chromosome and row['grch38_pos'] == grch38_position:
            if ref and alt:
                if row['ref'] == ref and row['alt'] == alt:
                    variants.append(row)
            elif amino_acid_ref and amino_acid_alt:
                if row['aaref'] == amino_acid_ref and row['aaalt'] == amino_acid_alt:
                    variants.append(row)
            else:
                variants.append(row)

    return variants
