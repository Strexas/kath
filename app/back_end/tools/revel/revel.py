import os
import pandas as pd
import dask.dataframe as dd

current_script_dir = os.path.dirname(os.path.abspath(__file__))
revel_file = os.path.join(current_script_dir, 'revel_with_transcript_ids')


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

def get_single_revel_score(chromosome, grch38_position, ref, alt, chunk_size=1000, revel_file=revel_file):
    """
    Retrieve REVEL score for a single variant based on criteria, with data type conversion for optimization.
    
    Parameters:
    - revel_file: Path to the REVEL data file.
    - chromosome: Chromosome number of the variant (e.g., '1' for chromosome 1).
    - grch38_position: Position of the variant on the chromosome (GRCh38 build).
    - ref: Reference nucleotide base at the variant position.
    - alt: Alternate nucleotide base at the variant position.
    
    Returns:
    - REVEL score for the matching variant or None if not found.
    """
    # Load file as a Dask DataFrame, setting up dtypes as in your previous code
    ddf = dd.read_csv(revel_file, dtype={
        'chr': 'str',
        'grch38_pos': 'int64',
        'ref': 'str',
        'alt': 'str',
        'aaref': 'str',
        'aaalt': 'str',
        'REVEL': 'float32',
        'Ensembl_transcriptid': 'str'
    })

    # Filter in parallel based on the criteria
    filtered_ddf = ddf[
        (ddf['chr'].str.strip() == str(chromosome)) &
        (ddf['grch38_pos'] == grch38_position) &
        (ddf['ref'].str.strip() == ref) &
        (ddf['alt'].str.strip() == alt)
    ]

    # Compute and bring the filtered result into memory
    result = filtered_ddf[['REVEL']].compute()  # Brings the result into a Pandas DataFrame

    # Return the first matching REVEL score, if any
    return result['REVEL'].iloc[0] if not result.empty else None