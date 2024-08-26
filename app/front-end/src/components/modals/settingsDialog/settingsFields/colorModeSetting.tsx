import SettingsSelectField from '@/components/modals/settingsDialog/settingsSelectField';
import { useThemeContext } from '@/hooks';
import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

export default function ColorModeSetting() {
  const ThemeContext = useThemeContext();

  const [switchTheme, setSwitchTheme] = useState(ThemeContext.mode);

  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const selectedTheme = event.target.value as 'light' | 'dark';
    setSwitchTheme(selectedTheme);
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
      value={switchTheme}
      onChange={handleThemeChange}
    />
  );
}
