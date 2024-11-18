"""CADD and SpliceAI Tool Package Initialization."""

from .cadd import (
    BadResponseException,
    DownloadError,
    fetch_cadd_scores,
    evaluate_cadd_score,
    prepare_data_cadd,
    add_cadd_eval_column,
)

from .spliceai import (
    SpliceAIError,
    write_vcf,
    run_spliceai,
    parse_spliceai_vcf,
    add_spliceai_eval_columns,
)

__all__ = [
    # CADD related exports
    "BadResponseException",
    "DownloadError",
    "fetch_cadd_scores",
    "evaluate_cadd_score",
    "prepare_data_cadd",
    "add_cadd_eval_column",
    # SpliceAI related exports
    "SpliceAIError",
    "write_vcf",
    "run_spliceai",
    "parse_spliceai_vcf",
    "add_spliceai_eval_columns",
]
