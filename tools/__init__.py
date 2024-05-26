"""
This module provides access to the tools for fetching scores for genetic variants.
"""

# CADD IMPORT
from .cadd.cadd import (
    # SNV scoring
    fetch_cadd_score,
    fetch_cadd_scores
)
