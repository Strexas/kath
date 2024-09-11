import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext } from '@/features/editor/hooks';
import { useStatusContext } from '@/hooks';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface DownloadGroupButtonsProps {}

export const DownloadGroupButtons: React.FC<DownloadGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
  const { saveTo, override, gene } = useToolbarContext();

  const handleDownloadLovdClick = useCallback(async () => {
    blockedStateUpdate(true);

    try {
      console.log(
        'Clicked Download Lovd Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  gene:',
        gene
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
    } catch (error) {
      console.error('Error downloading LOVD file:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, gene]);

  const handleDownloadClinvarClick = useCallback(async () => {
    blockedStateUpdate(true);

    try {
      console.log(
        'Clicked Download Clinvar Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  gene:',
        gene
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
    } catch (error) {
      console.error('Error downloading ClinVar file:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, gene]);

  const handleDownloadGnomadClick = useCallback(async () => {
    blockedStateUpdate(true);

    try {
      console.log(
        'Clicked Download Gnomad Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  gene:',
        gene
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
    } catch (error) {
      console.error('Error downloading gnomAD file:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, gene]);

  const buttons: ToolbarGroupItemProps[] = useMemo(
    () => [
      {
        group: 'download',
        icon: DownloadIcon,
        label: 'LOVD',
        onClick: handleDownloadLovdClick,
      },
      {
        group: 'download',
        icon: DownloadIcon,
        label: 'ClinVar',
        onClick: handleDownloadClinvarClick,
      },
      {
        group: 'download',
        icon: DownloadIcon,
        label: 'gnomAD',
        onClick: handleDownloadGnomadClick,
      },
    ],
    [handleDownloadLovdClick, handleDownloadClinvarClick, handleDownloadGnomadClick]
  );

  return (
    <>
      {buttons.map((button, index) => (
        <ToolbarGroupItem key={index} {...button} />
      ))}
    </>
  );
};
