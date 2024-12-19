""" Module provides interface to web APIs of CADD tool. """
import argparse
import requests
import pandas as pd


class BadResponseException(Exception):
    """Custom exception for bad responses."""


class DownloadError(Exception):
    """Custom exception for download errors."""


def fetch_cadd_scores(cadd_version, chromosome, start, end=None):
    """
    Fetches CADD (Combined Annotation Dependent Depletion)
    scores for either a single SNV or a range of genomic positions.

    :param str cadd_version: Version of the CADD model used, e.g., "v1.3" or "GRCh38-v1.7".
    :param int chromosome: Chromosome number where the SNV or genomic region is located.
    :param int start: Genomic start position (or single position for SNV) of the region.
    :param int end: (Optional) Genomic end position of the region.
    If not provided, fetches a single SNV.
    :return: A dictionary containing CADD scores and annotations
    for the specified SNV or region, or None if an
    error occurs.
    """

    if end:
        url = f"https://cadd.gs.washington.edu/api/v1.0/{cadd_version}/{chromosome}:{start}-{end}"
    else:
        url = f"https://cadd.gs.washington.edu/api/v1.0/{cadd_version}/{chromosome}:{start}"

    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            data = response.json()
            return data
        raise BadResponseException(
            f"Error: Received status code {response.status_code} - "
            f"{response.reason}: {response.text}")

    except requests.exceptions.Timeout as exc:
        raise DownloadError(
            "Error: Timeout occurred while trying to reach the server. "
            "Please check your internet connection or the server status.") from exc

    except requests.exceptions.RequestException as req_err:
        raise DownloadError(
            f"Error: An unexpected error occurred while making the request. "
            f"Details: {req_err}") from req_err

    except ValueError as exc:
        raise BadResponseException(
            "Error: Invalid JSON format in response. "
            "Please ensure the server is returning valid JSON.") from exc


def evaluate_cadd_score(row, cadd_version="GRCh38-v1.7"):
    """
    Evaluates the CADD score for a given row in the
     DataFrame and returns the highest PHRED score evaluation.
    Handles cases where the response is malformed or incomplete.

    :param row: A row from the DataFrame.
    :param str cadd_version: The CADD version to use for fetching the score.
    :return: A string indicating the evaluation result based
     on the highest PHRED score, or an error message.
    """
    position = row.loc["hg38_gnomad_format"]

    if  pd.isna(position):
        chromosome = row.loc["Chromosome_gnomad"]
        position= row.loc["Position_gnomad"]
    else:
        chromosome = row.loc["hg38_gnomad_format"].split('-')[0]
        position = row.loc["hg38_gnomad_format"].split('-')[1]

    score = fetch_cadd_scores(cadd_version, chromosome, position)

    if score is None or not isinstance(score, list) or len(score) < 2:
        return "CADD score unavailable" #intended

    try:
        score_df = pd.DataFrame(score[1:], columns=score[0])
    except (IndexError, ValueError) as e:
        raise ValueError(f"Error processing CADD score: {e}") from e

    if "PHRED" not in score_df.columns:
        raise KeyError("PHRED score unavailable")

    sorted_df = score_df.sort_values(by="PHRED", ascending=False)
    highest_score_row = sorted_df.iloc[0]

    return highest_score_row.loc['PHRED']


def prepare_data_cadd(data:pd.DataFrame):
    """
    Prepares the DataFrame for CADD evaluation by extracting chromosome
    and position from the 'variant_id_gnomad' column.

    :param data: DataFrame.
    :return: Updated DataFrame with 'Chromosome_gnomad' and 'Position_gnomad' columns.
    """
    if 'variant_id_gnomad' not in data.columns:
        raise KeyError("The 'variant_id_gnomad' column is missing from the DataFrame.")
    try:
        split_data = data['variant_id_gnomad'].str.split('-', n=2, expand=True)
        data[['Chromosome_gnomad', 'Position_gnomad']] = split_data[[0, 1]]
    except ValueError as e:
        raise ValueError(
            f"Error processing 'variant_id_gnomad': {e}. "
            f"This may be due to unexpected formatting or delimiters.")

    data['Chromosome_gnomad'] = data['Chromosome_gnomad'].astype('Int64')
    data['Position_gnomad'] = data['Position_gnomad'].astype('Int64')

    if 'Chromosome_gnomad' not in data.columns or 'Position_gnomad' not in data.columns:
        raise RuntimeError("The columns 'Chromosome_gnomad' or 'Position_gnomad' "
                           "were not created successfully.")
    return data


def add_cadd_eval_column(data:pd.DataFrame, cadd_version="GRCh38-v1.7"):
    """
    Adds a column 'cadd_eval' to the DataFrame based on CADD score evaluations for each row.

    :param data: The merged DataFrame with genomic data.
    :param str cadd_version: The version of the CADD model to use for score fetching.
    :return: The updated DataFrame with the 'cadd_eval' column.
    """
    data = prepare_data_cadd(data)
    try:
        data["cadd_eval(PHRED)"] = data.apply(evaluate_cadd_score, axis=1, cadd_version=cadd_version)
    except ValueError as e:
        raise ValueError(
            f"Error occurred while applying 'evaluate_cadd_score': {e}. "
            f"This may be due to incorrect data types or NaN values in the input DataFrame.")
    if "cadd_eval(PHRED)" not in data.columns:
        raise RuntimeError("CADD evaluation column 'cadd_eval(PHRED)' was not created successfully.")

    return data


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
        result = fetch_cadd_scores(args.version, args.chromosome, args.position)
        print(result)
    elif args.start and args.end:
        result = fetch_cadd_scores(args.version, args.chromosome, args.start, args.end)
        print(result)
    else:
        print("Please provide either '--position' for single SNV \
              or '--start' and '--end' for a range of positions.")
