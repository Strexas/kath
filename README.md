# kath

VERY NICE TOOL DESCRIPTION

## Install
1. Install Python and its dependencies
```
sudo apt update
sudo apt install python3 python3-dev python3-pip
python install -r requirements.txt
```

2. Download files required for spliceAI and test tool, output should be the same as output.vcf in tests/tools/spliceai/output.vcf
```
./install_spliceai.sh
spliceai -I ./tests/tools/spliceai/input.vcf -O ./tests/tools/spliceai/actual_output.vcf -R ./tools/spliceai/hg19.fa -A grch37
```

## Usage
### CADD
CADD SNV scoress can be obtained in JSON format:
```
python -c 'from tools.CADD.CADD import *; print(fetch_cadd_score("v1.3", 5, 2003402))'
```