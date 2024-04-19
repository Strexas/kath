"""
Package for data collection purposes provides both collection and refactoring functionality.

Data from LOVD, ClinVar and GnomAd databases can be downloaded using this package. GnomAd and
ClinVar are limited with EYS gene, but it is possible to download data for any gene in LOVD.

All necessary functionality can be imported directly from data_collection without
specifying the module.

data collection pipeline example is established for project's specific usage.
"""

# CONSTANTS IMPORT
from .constants import (
  # URLs for LOVD database
  LOVD_URL, LOVD_URL_EYS, LOVD_FILE_URL, LOVD_FILE_URL_EYS,

  # URLs for gnomAD database
  GNOMAD_URL, GNOMAD_URL_EYS, GNOMAD_FILE_URL_EYS,

  # URLs for ClinVar database
  CLINVAR_URL, CLINVAR_URL_EYS, CLINVAR_FILE_URL_EYS,

  # Paths for data storage
  DATA_PATH, LOVD_PATH, GNOMAD_PATH, CLINVAR_PATH,

  # Data types for tables
  LOVD_TABLES_DATA_TYPES,

  # Paths for database downloads
  DATABASES_DOWNLOAD_PATHS
)

# DATA COLLECTION IMPORT
from .collection import (
    # Custom exceptions
    BadResponseException,
    DownloadError,

    # Custom utility functions
    get_file_from_url,

    # Functions for downloading databases
    download_lovd_database_for_eys_gene,
    download_genes_lovd,
    download_database_for_eys_gene,

    # Functions for storing databases
    store_database_for_eys_gene
)

# DATA REFACTORING IMPORT
from .refactoring import (
  # Functions for refactoring data
  convert_lovd_to_datatype,
  parse_lovd,
  from_clinvar_name_to_cdna_position,

  # Functions for data merging
  merge_lovd_with_gnomad,
)
