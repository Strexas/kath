import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext } from '@/features/editor/hooks';
import { useStatusContext } from '@/hooks';
import { MergeType as MergeTypeIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface MergeGroupButtonsProps {}

export const MergeGroupButtons: React.FC<MergeGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
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
      console.log(
        'Clicked Merge LOVD & gnomAD Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  lovd:',
        lovdFile,
        '\n  gnomad:',
        gnomadFile
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
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
      console.log(
        'Clicked Merge LOVD & ClinVar Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  lovd:',
        lovdFile,
        '\n  clinvar:',
        clinvarFile
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
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
