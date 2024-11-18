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

def get_single_revel_score(chromosome, grch38_position, ref, alt, revel_file=revel_file):
    """
    Retrieve REVEL score for a single variant based on criteria.
    
    Parameters:
    - revel_file: Path to the REVEL data file.
    - chromosome: Chromosome number of the variant (e.g., '1' for chromosome 1).
    - grch38_position: Position of the variant on the chromosome (GRCh38 build).
    - ref: Reference nucleotide base at the variant position.
    - alt: Alternate nucleotide base at the variant position.
    
    Returns:
    - REVEL score for the matching variant or None if not found.
    """
    try:
        # Read the CSV with Dask, treating 'grch38_pos' as string initially
        ddf = dd.read_csv(revel_file, dtype={
            'chr': 'str',
            'grch38_pos': 'str',  # Read as string to handle non-integer values
            'ref': 'str',
            'alt': 'str',
            'aaref': 'str',
            'aaalt': 'str',
            'REVEL': 'float32',
            'Ensembl_transcriptid': 'str'
        })
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return None

    # Convert 'grch38_pos' to numeric, coercing errors to NaN
    ddf['grch38_pos'] = dd.to_numeric(ddf['grch38_pos'], errors='coerce')

    # Drop rows with NaN in 'grch38_pos'
    ddf = ddf.dropna(subset=['grch38_pos'])

    # Convert 'grch38_pos' to integer
    ddf['grch38_pos'] = ddf['grch38_pos'].astype('int64')

    # Ensure 'chr' is stripped of whitespace
    ddf['chr'] = ddf['chr'].str.strip()

    # Filter chromosomes less than the target (optional, for clarity)
    ddf = ddf[ddf['chr'].astype(int) >= chromosome]

    # Filter chromosomes equal to the target
    target_chrom = ddf['chr'].astype(int) == chromosome
    filtered_ddf = ddf[target_chrom]

    # Further filter by position, ref, and alt
    filtered_ddf = filtered_ddf[
        (filtered_ddf['grch38_pos'] == grch38_position) &
        (filtered_ddf['ref'].str.strip() == ref) &
        (filtered_ddf['alt'].str.strip() == alt)
    ]

    # Compute the filtered result
    result = filtered_ddf[['REVEL']].compute()

    if not result.empty:
        # Return the first matching REVEL score
        return result['REVEL'].iloc[0]
    else:
        return None