import argparse

from tests.tools.cadd.cadd import fetch_cadd_scores

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