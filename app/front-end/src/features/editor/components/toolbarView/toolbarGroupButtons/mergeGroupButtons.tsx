import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { findUniqueFileName, generateTimestamp } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { MergeType as MergeTypeIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface MergeGroupButtonsProps {}

export const MergeGroupButtons: React.FC<MergeGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
  const { fileTree } = useWorkspaceContext();
  const {
    saveTo,
    override,
    lovdFile,
    clinvarFile,
    gnomadFile,
    lovdErrorStateUpdate,
    clinvarErrorStateUpdate,
    gnomadErrorStateUpdate,
  } = useToolbarContext();

  const mergeLovdAndGnomadClick = useCallback(async () => {
    clinvarErrorStateUpdate('');

    if (!lovdFile) lovdErrorStateUpdate('Please select a LOVD file');
    if (!gnomadFile) gnomadErrorStateUpdate('Please select a gnomAD file');
    if (!lovdFile || !gnomadFile) return;

    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== '/' ? saveTo : findUniqueFileName(fileTree, `lovd_gnomad_${timestamp}.csv`);

      await axios.get(`${Endpoints.WORKSPACE_MERGE}/lovd_gnomad/${savePath}`, {
        params: {
          override,
          lovdFile,
          gnomadFile,
        },
      });
    } catch (error) {
      console.error('Error merging LOVD & gnomAD files:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, lovdFile, gnomadFile]);

  const mergeLovdAndClinvarClick = useCallback(async () => {
    gnomadErrorStateUpdate('');

    if (!lovdFile) lovdErrorStateUpdate('Please select a LOVD file');
    if (!clinvarFile) clinvarErrorStateUpdate('Please select a ClinVar file');
    if (!lovdFile || !clinvarFile) return;

    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== '/' ? saveTo : findUniqueFileName(fileTree, `lovd_clinvar_${timestamp}.csv`);

      await axios.get(`${Endpoints.WORKSPACE_MERGE}/lovd_clinvar/${savePath}`, {
        params: {
          override,
          lovdFile,
          clinvarFile,
        },
      });
    } catch (error) {
      console.error('Error merging LOVD & ClinVar files:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, lovdFile, clinvarFile]);

  const buttons: ToolbarGroupItemProps[] = useMemo(
    () => [
      {
        group: 'merge',
        icon: MergeTypeIcon,
        label: 'Merge LOVD & gnomAD',
        onClick: mergeLovdAndGnomadClick,
      },
      {
        group: 'merge',
        icon: MergeTypeIcon,
        label: 'Merge LOVD & ClinVar',
        onClick: mergeLovdAndClinvarClick,
      },
    ],
    [mergeLovdAndGnomadClick, mergeLovdAndClinvarClick]
  );

  return (
    <>
      {buttons.map((button, index) => (
        <ToolbarGroupItem key={index} {...button} />
      ))}
    </>
  );
};
