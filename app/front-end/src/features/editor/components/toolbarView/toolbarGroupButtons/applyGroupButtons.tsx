import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { findUniqueFileName, generateTimestamp } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { Deblur as DeblurIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface ApplyGroupButtonsProps {}

export const ApplyGroupButtons: React.FC<ApplyGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
  const { fileTree } = useWorkspaceContext();
  const { saveTo, override, applyTo, applyErrorStateUpdate } = useToolbarContext();

  const applySpliceAiClick = useCallback(async () => {
    if (!applyTo) {
      applyErrorStateUpdate('Please select a file');
      return;
    }

    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== '/' ? saveTo : findUniqueFileName(fileTree, `spliceai_${timestamp}.csv`);

      await axios.get(`${Endpoints.WORKSPACE_APPLY}/spliceai/${savePath}`, {
        params: {
          override,
          applyTo,
        },
      });
    } catch (error) {
      console.error('Error applying SpliceAI:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, applyTo]);

  const applyCaddClick = useCallback(async () => {
    if (!applyTo) {
      applyErrorStateUpdate('Please select a file');
      return;
    }

    blockedStateUpdate(true);

    try {
      const timestamp = generateTimestamp();
      const savePath = saveTo !== '/' ? saveTo : findUniqueFileName(fileTree, `cadd_${timestamp}.csv`);

      await axios.get(`${Endpoints.WORKSPACE_APPLY}/cadd/${savePath}`, {
        params: {
          override,
          applyTo,
        },
      });
    } catch (error) {
      console.error('Error applying CADD:', error);
    } finally {
      blockedStateUpdate(false);
    }
  }, [saveTo, override, applyTo]);

  const buttons: ToolbarGroupItemProps[] = useMemo(
    () => [
      {
        group: 'apply',
        icon: DeblurIcon,
        label: 'Apply SpliceAI',
        onClick: applySpliceAiClick,
      },
      {
        group: 'apply',
        icon: DeblurIcon,
        label: 'Apply CADD',
        onClick: applyCaddClick,
      },
    ],
    [applySpliceAiClick, applyCaddClick]
  );

  return (
    <>
      {buttons.map((button, index) => (
        <ToolbarGroupItem key={index} {...button} />
      ))}
    </>
  );
};
