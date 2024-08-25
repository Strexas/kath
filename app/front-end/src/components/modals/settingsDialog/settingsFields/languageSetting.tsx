import SettingsSelectField from '@/components/modals/settingsDialog/settingsSelectField';
import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

export default function LanguageSetting() {
  // TODO: Implement language switching functionality and replace with correct values

  const [switchLanguage, setSwitchLanguage] = useState('en');

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value;
    setSwitchLanguage(selectedLanguage);
  };

  return (
    <SettingsSelectField
      title='Language'
      description='Change the language of the application'
      settings={[
        { value: 'en', label: 'English' },
        { value: 'lt', label: 'Lithuanian' },
        { value: 'it', label: 'Italian' },
      ]}
      value={switchLanguage}
      onChange={handleLanguageChange}
    />
  );
}
