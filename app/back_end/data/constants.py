"""Module for constants used in data collection."""

import os

# files
LOVD_URL = "https://databases.lovd.nl/shared/genes"
LOVD_URL_EYS = LOVD_URL + "EYS"
LOVD_FILE_URL = "https://databases.lovd.nl/shared/download/all/gene/"
LOVD_FILE_URL_EYS = LOVD_FILE_URL + "EYS"
STORE_AS_LOVD = "../app/back_end/src/workspace/lovd/lovd_data.txt"
STORE_AS_GNOMAD = "../app/back_end/src/workspace/gnomad/gnomad_data.csv"

GNOMAD_URL = "https://gnomad.broadinstitute.org/gene"
GNOMAD_URL_EYS = "https://gnomad.broadinstitute.org/gene/ENSG00000188107?dataset=gnomad_r4"
GNOMAD_FILE_URL_EYS = ("https://drive.usercontent.google.com/u/0/uc?id=1crkDCVcC0PSnv0JPGj3FpemBs28"
                       "-T_3y&export=download")

CLINVAR_URL = "https://www.ncbi.nlm.nih.gov/clinvar"
CLINVAR_URL_EYS = "https://www.ncbi.nlm.nih.gov/clinvar/?term=eys%5Bgene%5D&redir=gene"
CLINVAR_FILE_URL_EYS = ("https://drive.usercontent.google.com/u/0/uc?id=1RK5XBK3k5h0K6f-qfwJSQj7tlF"
                        "-H2U6u&export=download")

# paths
DATA_PATH = os.path.join(__file__[:__file__.index("kath") + 4], "app/back_end/src/workspace/")

LOVD_PATH = os.path.join(DATA_PATH, "lovd/")
GNOMAD_PATH = os.path.join(DATA_PATH, "gnomad/")
CLINVAR_PATH = os.path.join(DATA_PATH, "clinvar/")
DEFAULT_SAVE_PATH = os.path.join(DATA_PATH, "merged_data/")

DATABASES_DOWNLOAD_PATHS = {
    "clinvar": {
        "button": 'document.getElementsByName(\"EntrezSystem2.PEntrez.clinVar.'
                  'clinVar_Entrez_ResultsPanel.Entrez_DisplayBar.SendToSubmit\")[0].click()',
        "url": CLINVAR_URL_EYS,
        "store_as": "clinvar_data.txt",
        "clickable": "/html/body/div[1]/div[1]/form/div[1]/div[5]/div/div[2]/"
                     "div[2]/div[1]/div/div[1]/a[3]",
    },
    "gnomad": {
        "button": "document.getElementsByClassName"
                  "('Button__BaseButton-sc-1eobygi-0 Button-sc-1eobygi-1 indcWT')[4].click()",
        "url": GNOMAD_URL_EYS,
        "store_as": "gnomad_data.csv",
        "clickable": "/html/body/div[1]/div[3]/div[2]/div/div[7]/div[4]/div[2]/button[1]",
    },
    "lovd": {}
}
