#!/bin/bash
mkdir -p ./tools/revel

wget https://rothsj06.dmz.hpc.mssm.edu/revel-v1.3_all_chromosomes.zip -O ./tools/revel/revel-v1.3_all_chromosomes.zip
unzip ./tools/revel/revel-v1.3_all_chromosomes.zip -d ./tools/revel

#rm ./tools/revel/revel-v1.3_all_chromosomes.zip
