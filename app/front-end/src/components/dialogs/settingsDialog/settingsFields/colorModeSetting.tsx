import { SettingsSelectField } from '@/components/dialogs/settingsDialog';
import { useThemeContext } from '@/hooks';

export const ColorModeSetting = () => {
  const ThemeContext = useThemeContext();

  const handleThemeChange = () => {
    ThemeContext.update();
  };

  return (
    <SettingsSelectField
      title='Color mode'
      description='Toggle between light and dark modes'
      settings={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
      value={ThemeContext.mode}
      onChange={handleThemeChange}
    />
  );
};
