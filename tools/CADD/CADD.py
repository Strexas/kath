import requests

def fetch_cadd_score(cadd_version, chromosome, position):
    """
    Fetches a single SNV (Single Nucleotide Variant) score from the Combined Annotation Dependent Depletion (CADD) tool.
    
    :param str cadd_version: Version of the CADD model used, e.g., "v1.3" or "GRCh38-v17.7".
    :param int chromosome: Chromosome number where the SNV is located.
    :param int position: Genomic position of the SNV on the chromosome.
    :return: A dictionary containing CADD scores and annotations for the specified SNV, or None if an error occurs.
    """
    url = f"https://cadd.gs.washington.edu/api/v1.0/{cadd_version}/{chromosome}:{position}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
