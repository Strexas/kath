import os
import subprocess
from glob import glob


def run_command(command: str) -> None:
    """
    Executes a shell command and raises an exception if it fails.
    Args:
        command (str): The command to run.
    """
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Error executing command: {command}") from e


def align_fasta_fastq_to_destination(destination_path:str, fasta_file:str, fastq_file_folder:str) -> None:
    """
    Performs alignment and variant calling for sequencing data using GATK, BWA, and SAMtools.

    This function aligns sequencing data from a FASTA file and a folder containing FASTQ files,
    performs sorting, indexing, marking duplicates, adding read groups, and finally calls variants.
    The process utilizes the following tools: BWA, GATK, and SAMtools.

    1. Index the FASTA reference file using BWA, GATK, and Samtools:
        - `bwa index hg38.fa`
        - `gatk CreateSequenceDictionary -R hg38.fa`
        - `samtools faidx hg38.fa`

    2. Perform alignment of the FASTQ file to the FASTA reference using BWA MEM:
        - `bwa mem hg38.fa {fasta_file}.fastq > {base_name}.sam`

    3. Convert and sort the SAM file to generate a BAM file:
        - `samtools view -Sb {base_name}.sam | samtools sort -o {base_name}_sorted.bam`

    4. Index the sorted BAM file:
        - `samtools index {base_name}_sorted.bam`

    5. Mark duplicate reads using GATK MarkDuplicates:
        - `gatk MarkDuplicates -I {base_name}_sorted.bam -O {base_name}_dedup.bam -M dedup_metrics.txt`

    6. Add or replace read groups for consistency:
        - `gatk AddOrReplaceReadGroups
        -I {base_name}_dedup.bam
        -O {base_name}_dedup_with_rg.bam
        -RGID 1
        -RGLB lib1
        -RGPL ILLUMINA
        -RGPU unit1
        -RGSM {base_name}`

    7. Index the updated BAM file:
        - `samtools index {base_name}_dedup_with_rg.bam`

    8. Call variants using GATK HaplotypeCaller:
        - `gatk HaplotypeCaller -R hg38.fa -I {base_name}_dedup_with_rg.bam -O {base_name}_variants.vcf`

    Args:
        destination_path: The path to the destination file (where to save it) in the user's workspace
        fasta_file: The path to the FASTA file to be used in align
        fastq_file_folder: The path to the FASTQ file folder to be used in align

    Returns: None

    """

    run_fasta_indexing(fasta_file)
    fastq_files = glob(os.path.join(fastq_file_folder, "*.fastq"))
    if not fastq_files:
        raise FileNotFoundError(f"No FASTQ files found in the folder: {fastq_file_folder}")

    for fastq_file in fastq_files:
        base_name = os.path.splitext(os.path.basename(fastq_file))[0]
        sam_file = f"{base_name}.sam"
        bam_file = f"{base_name}_sorted.bam"
        dedup_bam = f"{base_name}_dedup.bam"
        final_bam = f"{base_name}_dedup_with_rg.bam"
        vcf_file = os.path.join(destination_path, f"{base_name}_variants.vcf")

        run_command(f"./bwa-0.7.17/bwa mem {fasta_file} {fastq_file} > {sam_file}")

        run_command(f"./samtools-1.21/samtools view -Sb {sam_file} | ./samtools-1.21/samtools sort -o {bam_file}")

        run_command(f"./samtools-1.21/samtools index {bam_file}")

        run_command(
            f"./gatk-4.6.1.0/gatk MarkDuplicates -I {bam_file} -O {dedup_bam} -M {base_name}_dedup_metrics.txt")

        run_command(f"./gatk-4.6.1.0/gatk AddOrReplaceReadGroups -I {dedup_bam} -O {final_bam} "
                    f"-RGID 1 -RGLB lib1 -RGPL ILLUMINA -RGPU unit1 -RGSM {base_name}")

        run_command(f"./samtools-1.21/samtools index {final_bam}")

        run_command(f"./gatk-4.6.1.0/gatk HaplotypeCaller -R {fasta_file} -I {final_bam} -O {vcf_file}")


def run_fasta_indexing(fasta_file: str, algorithm: str = "is") -> None:
    """
    Runs the bwa index command with optional parameters for prefix and algorithm type.

    Args:
        fasta_file (str): Path to the FASTA file to be indexed.
        algorithm (str, optional): Algorithm for constructing the BWT index. Can be such values :
        - is -> linear-time algorithm for constructing suffix array.
        It requires 5.37N memory where N is the size of the database.
        IS is moderately fast, but does not work with database larger than 2GB.
        - bwtsw -> Algorithm implemented in BWT-SW. This method works with the whole human genome.
        Defaults to 'is' due to its simplicity.
    """
    index_files = [
        f"{fasta_file}.amb",
        f"{fasta_file}.ann",
        f"{fasta_file}.bwt",
        f"{fasta_file}.pac",
        f"{fasta_file}.sa"
    ]
    if algorithm not in ["is", "bwtsw"]:
        raise ValueError("Invalid algorithm choice. Use 'is' or 'bwtsw'.")

    if not all(os.path.exists(file) for file in index_files):
        command = f"./bwa-0.7.17/bwa index {fasta_file}"
        run_command(command)

    gatk_index_dict = f"{os.path.splitext(fasta_file)[0]}.dict"
    if not os.path.exists(gatk_index_dict):
        command = f"./gatk-4.6.1.0/gatk CreateSequenceDictionary -R {fasta_file}"
        run_command(command)

    samtools_index_file = f"{fasta_file}.fai"
    if not os.path.exists(samtools_index_file):
        command = f"./samtools-1.21/samtools faidx {fasta_file}"
        run_command(command)