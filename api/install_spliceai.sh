#!/bin/bash
mkdir ./tools/spliceai

wget http://hgdownload.cse.ucsc.edu/goldenPath/hg19/bigZips/hg19.fa.gz -O ./tools/spliceai/hg19.fa.gz
gzip -d ./tools/spliceai/hg19.fa.gz -c ./tools/spliceai/hg19.fa

wget http://hgdownload.cse.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz -O ./tools/spliceai/hg38.fa.gz
gzip -d ./tools/spliceai/hg38.fa.gz -c ./tools/spliceai/hg38.fa
