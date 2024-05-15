""" Module provides interface to web APIs of CADD tool. """

import argparse
import requests


class BadResponseException(Exception):
    """Custom exception for bad responses."""


class DownloadError(Exception):
    """Custom exception for download errors."""


def fetch_cadd_score(cadd_version, chromosome, position):
    """
    Fetches a single SNV (Single Nucleotide Variant) score
    from the Combined Annotation Dependent Depletion (CADD) tool.
    
    :param str cadd_version: Version of the CADD model used, e.g., "v1.3" or "GRCh38-v1.7".
    :param int chromosome: Chromosome number where the SNV is located.
    :param int position: Genomic position of the SNV on the chromosome.
    :return: A dictionary containing CADD scores and annotations
    for the specified SNV, or None if an error occurs.
    """

    url = f"https://cadd.gs.washington.edu/api/v1.0/{cadd_version}/{chromosome}:{position}"
    try:
        response = requests.get(url, timeout = 30)
        if response.status_code == 200:
            data = response.json()
            return data
        raise BadResponseException (f"Error: {response.status_code} - {response.text}")
    except requests.exceptions.Timeout as exc:
        raise DownloadError("Error: Timeout occurred while trying to reach the server.") from exc
    except requests.exceptions.RequestException as req_err:
        raise DownloadError(f"Error: {req_err}") from req_err
    except ValueError as exc:
        raise BadResponseException("Error: Invalid JSON format in response.") from exc
    return None

def fetch_cadd_scores(cadd_version, chromosome, start, end):
    """
    Fetches CADD (Combined Annotation Dependent Depletion) scores for a range of genomic positions.

    :param str cadd_version: Version of the CADD model used, e.g., "v1.3" or "GRCh38-v1.7".
    :param int chromosome: Chromosome number for the genomic region.
    :param int start: Genomic start position of the region.
    :param int end: Genomic end position of the region.
    :return: A dictionary containing CADD scores and annotations
    for the specified genomic region, or None if an error occurs.
    """

    url = f"https://cadd.gs.washington.edu/api/v1.0/{cadd_version}/{chromosome}:{start}-{end}"
    try:
        response = requests.get(url, timeout = 30)
        if response.status_code == 200:
            data = response.json()
            return data
        print(f"Error: {response.status_code} - {response.text}")
        return None
    except requests.exceptions.Timeout as exc:
        raise DownloadError("Error: Timeout occurred while trying to reach the server.") from exc
    except requests.exceptions.RequestException as req_err:
        raise DownloadError(f"Error: {req_err}") from req_err
    except ValueError as exc:
        raise BadResponseException("Error: Invalid JSON format in response.") from exc
    return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch CADD scores for genomic positions.")
    parser.add_argument("version", help="CADD version, e.g., 'v1.3' or 'GRCh38-v1.7'")
    parser.add_argument("chromosome", type=int, help="Chromosome number")
    parser.add_argument("--position", type=int, help="Genomic position (for single SNV)")
    parser.add_argument("--start", type=int,
                        help="Genomic start position (for a range of positions)")
    parser.add_argument("--end", type=int, help="Genomic end position (for a range of positions)")

    args = parser.parse_args()

    if args.position:
        result = fetch_cadd_score(args.version, args.chromosome, args.position)
        print(result)
    elif args.start and args.end:
        result = fetch_cadd_scores(args.version, args.chromosome, args.start, args.end)
        print(result)
    else:
        print("Please provide either '--position' for single SNV \
              or '--start' and '--end' for a range of positions.")
