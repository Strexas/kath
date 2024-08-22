"""Module for constants used in data collection."""

import os

# files
LOVD_URL = "https://databases.lovd.nl/shared/genes"
LOVD_URL_EYS = LOVD_URL + "EYS"
LOVD_FILE_URL = "https://databases.lovd.nl/shared/download/all/gene/"
LOVD_FILE_URL_EYS = LOVD_FILE_URL + "EYS"
STORE_AS_LOVD = "../data/lovd/lovd_data.txt"

GNOMAD_URL = "https://gnomad.broadinstitute.org/gene"
GNOMAD_URL_EYS = "https://gnomad.broadinstitute.org/gene/ENSG00000188107?dataset=gnomad_r4"
GNOMAD_FILE_URL_EYS = ("https://drive.usercontent.google.com/u/0/uc?id=1crkDCVcC0PSnv0JPGj3FpemBs28"
                       "-T_3y&export=download")

CLINVAR_URL = "https://www.ncbi.nlm.nih.gov/clinvar"
CLINVAR_URL_EYS = "https://www.ncbi.nlm.nih.gov/clinvar/?term=eys%5Bgene%5D&redir=gene"
CLINVAR_FILE_URL_EYS = ("https://drive.usercontent.google.com/u/0/uc?id=1RK5XBK3k5h0K6f-qfwJSQj7tlF"
                        "-H2U6u&export=download")

# paths
DATA_PATH = os.path.join(__file__[:__file__.index("kath") + 4], "data/")

LOVD_PATH = os.path.join(DATA_PATH, "lovd/")
GNOMAD_PATH = os.path.join(DATA_PATH, "gnomad/")
CLINVAR_PATH = os.path.join(DATA_PATH, "clinvar/")

# variable data types
LOVD_TABLES_DATA_TYPES = {
    'Genes': {
        'id': 'String',
        'name': 'String',
        'chromosome': 'Integer',
        'chrom_band': 'String',
        'imprinting': 'String',
        'refseq_genomic': 'String',
        'refseq_UD': 'String',
        'reference': 'String',
        'url_homepage': 'String',
        'url_external': 'String',
        'allow_download': 'Boolean',
        'id_hgnc': 'Integer',
        'id_entrez': 'Integer',
        'id_omim': 'Integer',
        'show_hgmd': 'Boolean',
        'show_genecards': 'Boolean',
        'show_genetests': 'Boolean',
        'show_orphanet': 'Boolean',
        'note_index': 'String',
        'note_listing': 'String',
        'refseq': 'String',
        'refseq_url': 'String',
        'disclaimer': 'Boolean',
        'disclaimer_text': 'String',
        'header': 'String',
        'header_align': 'Integer',
        'footer': 'String',
        'footer_align': 'Integer',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date',
        'updated_by': 'Integer',
        'updated_date': 'Date'
    },
    'Variants_On_Transcripts': {
        'id': 'Integer',
        'transcriptid': 'Integer',
        'effectid': 'Integer',
        'position_c_start': 'Integer',
        'position_c_start_intron': 'Integer',
        'position_c_end': 'Integer',
        'position_c_end_intron': 'Integer',
        'VariantOnTranscript/DNA': 'String',
        'VariantOnTranscript/RNA': 'String',
        'VariantOnTranscript/Protein': 'String',
        'VariantOnTranscript/Exon': 'String'
    },
    'Diseases': {
        'id': 'Integer',
        'symbol': 'String',
        'name': 'String',
        'inheritance': 'String',
        'id_omim': 'Integer',
        'tissues': 'String',
        'features': 'String',
        'remarks': 'String',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date'
    },
    'Transcripts': {
        'id': 'Integer',
        'geneid': 'String',
        'name': 'String',
        'id_mutalyzer': 'Integer',
        'id_ncbi': 'String',
        'id_ensembl': 'String',
        'id_protein_ncbi': 'String',
        'id_protein_ensembl': 'String',
        'id_protein_uniprot': 'String',
        'remarks': 'String',
        'position_c_mrna_start': 'Integer',
        'position_c_mrna_end': 'Integer',
        'position_c_cds_end': 'Integer',
        'position_g_mrna_start': 'Integer',
        'position_g_mrna_end': 'Integer',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date'
    },
    'Phenotypes': {
        'id': 'Integer',
        'diseaseid': 'Integer',
        'individualid': 'Integer',
        'owned_by': 'Integer',
        'Phenotype/Inheritance': 'String',
        'Phenotype/Age': 'String',
        'Phenotype/Additional': 'String',
        'Phenotype/Biochem_param': 'String',
        'Phenotype/Age/Onset': 'String',
        'Phenotype/Age/Diagnosis': 'String',
        'Phenotype/Severity_score': 'String',
        'Phenotype/Onset': 'String',
        'Phenotype/Protein': 'String',
        'Phenotype/Tumor/MSI': 'String',
        'Phenotype/Enzyme/CPK': 'String',
        'Phenotype/Heart/Myocardium': 'String',
        'Phenotype/Lung': 'String',
        'Phenotype/Diagnosis/Definite': 'String',
        'Phenotype/Diagnosis/Initial': 'String',
        'Phenotype/Diagnosis/Criteria': 'String'
    },
    'Screenings': {
        'id': 'Integer',
        'individualid': 'Integer',
        'variants_found': 'Integer',
        'owned_by': 'Integer',
        'created_by': 'Integer',
        'created_date': 'Date',
        'edited_by': 'Integer',
        'edited_date': 'Date',
        'Screening/Technique': 'String',
        'Screening/Template': 'String',
        'Screening/Tissue': 'String',
        'Screening/Remarks': 'String'
    },
    'Individuals': {
        'id': 'Integer',
        'fatherid': 'String',
        'motherid': 'String',
        'panelid': 'Integer',
        'panel_size': 'Integer',
        'license': 'String',
        'owned_by': 'Integer',
        'Individual/Reference': 'String',
        'Individual/Remarks': 'String',
        'Individual/Gender': 'String',
        'Individual/Consanguinity': 'String',
        'Individual/Origin/Geographic': 'String',
        'Individual/Age_of_death': 'String',
        'Individual/VIP': 'String',
        'Individual/Data_av': 'String',
        'Individual/Treatment': 'String',
        'Individual/Origin/Population': 'String',
        'Individual/Individual_ID': 'String'
    },
    'Variants_On_Genome': {
        'id': 'Integer',
        'allele': 'Integer',
        'effectid': 'Integer',
        'chromosome': 'Integer',
        'position_g_start': 'Integer',
        'position_g_end': 'Integer',
        'type': 'String',
        'average_frequency': 'Double',
        'owned_by': 'Integer',
        'VariantOnGenome/DBID': 'String',
        'VariantOnGenome/DNA': 'String',
        'VariantOnGenome/Frequency': 'String',
        'VariantOnGenome/Reference': 'String',
        'VariantOnGenome/Restriction_site': 'String',
        'VariantOnGenome/Published_as': 'String',
        'VariantOnGenome/Remarks': 'String',
        'VariantOnGenome/Genetic_origin': 'String',
        'VariantOnGenome/Segregation': 'String',
        'VariantOnGenome/dbSNP': 'String',
        'VariantOnGenome/VIP': 'String',
        'VariantOnGenome/Methylation': 'String',
        'VariantOnGenome/ISCN': 'String',
        'VariantOnGenome/DNA/hg38': 'String',
        'VariantOnGenome/ClinVar': 'String',
        'VariantOnGenome/ClinicalClassification': 'String',
        'VariantOnGenome/ClinicalClassification/Method': 'String'
    },
    'Screenings_To_Variants': {
        'screeningid': 'Integer',
        'variantid': 'Integer'
    },
    'Genes_To_Diseases': {
        'geneid': 'String',
        'diseaseid': 'Integer'
    },
    'Individuals_To_Diseases': {
        'individualid': 'Integer',
        'diseaseid': 'Integer'
    },
    'Screenings_To_Genes': {
        'screeningid': 'Integer',
        'geneid': 'String'}
}
GNOMAD_TABLES_DATA_TYPES = {
    "gnomAD ID": "String",
    "Chromosome": "String",
    "Position": "Integer",
    "rsIDs": "String",
    "Reference": "String",
    "Alternate": "String",
    "Source": "String",
    "Filters - exomes": "String",
    "Filters - genomes": "String",
    "Transcript": "String",
    "HGVS Consequence": "String",
    "Protein Consequence": "String",
    "Transcript Consequence": "String",
    "VEP Annotation": "String",
    "ClinVar Clinical Significance": "String",
    "ClinVar Variation ID": "Integer",
    "Flags": "String",
    "Allele Count": "Integer",
    "Allele Number": "Integer",
    "Allele Frequency": "Double",
    "Homozygote Count": "Integer",
    "Hemizygote Count": "Integer",
    "Filters - joint": "String",
    "GroupMax FAF group": "String",
    "GroupMax FAF frequency": "Double",
    "cadd": "Double",
    "revel_max": "Double",
    "spliceai_ds_max": "Double",
    "pangolin_largest_ds": "Double",
    "phylop": "Double",
    "sift_max": "Double",
    "polyphen_max": "Double",
    "Allele Count African/African American": "Integer",
    "Allele Number African/African American": "Integer",
    "Homozygote Count African/African American": "Integer",
    "Hemizygote Count African/African American": "Integer",
    "Allele Count Admixed American": "Integer",
    "Allele Number Admixed American": "Integer",
    "Homozygote Count Admixed American": "Integer",
    "Hemizygote Count Admixed American": "Integer",
    "Allele Count Ashkenazi Jewish": "Integer",
    "Allele Number Ashkenazi Jewish": "Integer",
    "Homozygote Count Ashkenazi Jewish": "Integer",
    "Hemizygote Count Ashkenazi Jewish": "Integer",
    "Allele Count East Asian": "Integer",
    "Allele Number East Asian": "Integer",
    "Homozygote Count East Asian": "Integer",
    "Hemizygote Count East Asian": "Integer",
    "Allele Count European (Finnish)": "Integer",
    "Allele Number European (Finnish)": "Integer",
    "Homozygote Count European (Finnish)": "Integer",
    "Hemizygote Count European (Finnish)": "Integer",
    "Allele Count Middle Eastern": "Integer",
    "Allele Number Middle Eastern": "Integer",
    "Homozygote Count Middle Eastern": "Integer",
    "Hemizygote Count Middle Eastern": "Integer",
    "Allele Count European (non-Finnish)": "Integer",
    "Allele Number European (non-Finnish)": "Integer",
    "Homozygote Count European (non-Finnish)": "Integer",
    "Hemizygote Count European (non-Finnish)": "Integer",
    "Allele Count Amish": "Integer",
    "Allele Number Amish": "Integer",
    "Homozygote Count Amish": "Integer",
    "Hemizygote Count Amish": "Integer",
    "Allele Count South Asian": "Integer",
    "Allele Number South Asian": "Integer",
    "Homozygote Count South Asian": "Integer",
    "Hemizygote Count South Asian": "Integer",
    "Allele Count Remaining": "Integer",
    "Allele Number Remaining": "Integer",
    "Homozygote Count Remaining": "Integer",
    "Hemizygote Count Remaining": "Integer"
}

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
