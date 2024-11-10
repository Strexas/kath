import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { defaultSaveTo } from '@/features/editor/stores';
import { findUniqueFileName, generateTimestamp } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { FormatIndentIncrease as FormatIndentIncreaseIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface AlignGroupButtonsProps {}

export const AlignGroupButtons: React.FC<AlignGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
  const { fileTree } = useWorkspaceContext();
  const { saveTo, fastaFile, fastqFileFolder, fastaErrorStateUpdate, fastqErrorStateUpdate } = useToolbarContext();

  const alignClick = useCallback(async () => {
    if (!fastaFile) fastaErrorStateUpdate('Please select a FASTA file');
    if (!fastqFileFolder) fastqErrorStateUpdate('Please select a FASTQ files folder');
    if (!fastaFile || !fastqFileFolder) return;

    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath =
        saveTo !== defaultSaveTo ? saveTo.id : findUniqueFileName(fileTree, `aligned_fasta_fastq_${timestamp}.vcf`);

      await axios.get(`${Endpoints.WORKSPACE_ALIGN}/fasta_fastq/${savePath}`, {
        params: {
          fastaFile: fastaFile.id,
          fastqFileFolder: fastqFileFolder.id,
        },
      });
    } catch (error) {
      console.error('Error aligning FASTQ and FASTA files:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, fastaFile, fastqFileFolder]);

  const buttons: ToolbarGroupItemProps[] = useMemo(
    () => [
      {
        group: 'align',
        icon: FormatIndentIncreaseIcon,
        label: 'Align',
        onClick: alignClick,
      },
    ],
    [alignClick]
  );

  return (
    <>
      {buttons.map((button, index) => (
        <ToolbarGroupItem key={index} {...button} />
      ))}
    </>
  );
};
