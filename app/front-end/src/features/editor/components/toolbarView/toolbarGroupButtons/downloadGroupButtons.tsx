import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { defaultSaveTo } from '@/features/editor/stores';
import { findUniqueFileName, generateTimestamp, getFileExtension } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface DownloadGroupButtonsProps {}

export const DownloadGroupButtons: React.FC<DownloadGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
  const { fileTree } = useWorkspaceContext();
  const { saveTo, saveToErrorStateUpdate, override, gene } = useToolbarContext();

  const handleDownloadLovdClick = useCallback(async () => {
    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== defaultSaveTo ? saveTo.id : findUniqueFileName(fileTree, `lovd_${timestamp}.txt`);
      if (getFileExtension(savePath) !== 'txt') {
        saveToErrorStateUpdate('Select .txt');
        return
      }
      saveToErrorStateUpdate('');

      await axios.get(`${Endpoints.WORKSPACE_DOWNLOAD}/${savePath}`, {
        params: {
          source: 'lovd',
          override,
          gene,
        },
      });
    } catch (error) {
      console.error('Error downloading LOVD file:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, gene]);

  const handleDownloadClinvarClick = useCallback(async () => {
    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== defaultSaveTo ? saveTo.id : findUniqueFileName(fileTree, `clinvar_${timestamp}.csv`);
      if (getFileExtension(savePath) !== 'csv') {
        saveToErrorStateUpdate('Select .csv');
        return
      }
      saveToErrorStateUpdate('');

      await axios.get(`${Endpoints.WORKSPACE_DOWNLOAD}/${savePath}`, {
        params: {
          source: 'clinvar',
          override,
          gene,
        },
      });
    } catch (error) {
      console.error('Error downloading ClinVar file:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, gene]);

  const handleDownloadGnomadClick = useCallback(async () => {
    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== defaultSaveTo ? saveTo.id : findUniqueFileName(fileTree, `gnomad_${timestamp}.csv`);
      if (getFileExtension(savePath) !== 'csv') {
        saveToErrorStateUpdate('Select .csv');
        return
      }
      saveToErrorStateUpdate('');

      await axios.get(`${Endpoints.WORKSPACE_DOWNLOAD}/${savePath}`, {
        params: {
          source: 'gnomad',
          override,
          gene,
        },
      });
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
        disabled: true,
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
