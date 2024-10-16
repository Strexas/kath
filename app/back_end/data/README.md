**Download FASTA file for SpliceAI**
   ```powershell
   mkdir -p app/back-end/src/workspace/fasta && cd app/back-end/src/workspace/fasta && curl -O https://hgdownload.cse.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && gunzip hg38.fa.gz
   ```
   This will download FASTA "hg38.fa" file that is required for correct work of SpliceAI