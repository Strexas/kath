# kath

Tool with GUI for analysis of gene variations data from LOVD, GNOMAD and CLINVAR databases.

## Installation on Ubuntu
Install Python and its dependencies
```
sudo apt update
sudo apt install python3 python3-dev python3-pip
python install -r requirements.txt
```
## Usage
### CADD
CADD SNV scoress can be obtained in JSON format:
`python tools/cadd/cadd.py v1.3 5 --position 2003402` or
`python tools/cadd/cadd.py GRCh38-v1.4 22 --start 44044001 --end 44044002`