import { ToolbarGroupItem, ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';
import { useToolbarContext } from '@/features/editor/hooks';
import { useStatusContext } from '@/hooks';
import { Deblur as DeblurIcon } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';

export interface ApplyGroupButtonsProps {}

export const ApplyGroupButtons: React.FC<ApplyGroupButtonsProps> = () => {
  const { blockedStateUpdate } = useStatusContext();
  const { saveTo, override, applyTo, applyErrorStateUpdate } = useToolbarContext();

  const applySpliceAiClick = useCallback(async () => {
    if (!applyTo) {
      applyErrorStateUpdate('Please select a file');
      return;
    }

    blockedStateUpdate(true);

    try {
      console.log(
        'Clicked Apply SpliceAI Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  applyTo:',
        applyTo
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
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
      console.log(
        'Clicked Merge LOVD & ClinVar Button! Params:\n  saveTo:',
        saveTo,
        '\n  override:',
        override,
        '\n  applyTo:',
        applyTo
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this line
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
