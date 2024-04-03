"""
Package for data collection purposes provides both collection and refactoring functionality.

Data from LOVD, ClinVar and GnomAd databases can be downloaded using this package. GnomAd and
ClinVar are limited with EYS gene, but it is possible to download data for any gene in LOVD.

All necessary functionality can be imported directly from data_collection without
specifying the module.

data collection pipeline example is established for project's specific usage.
"""

# CONSTANTS IMPORT
# TODO: specify imports of constants
from .constants import *


# DATA COLLECTION IMPORT
# TODO: specify imports of data collection
from .collection import *


# DATA REFACTORING IMPORT
# TODO: specify imports of data collection
from .refactoring import *
