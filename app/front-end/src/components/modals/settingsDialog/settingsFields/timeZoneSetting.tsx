import SettingsSelectField from '@/components/modals/settingsDialog/settingsSelectField';
import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

export default function LanguageSetting() {
  // TODO: Implement time zone switching functionality and replace with correct values

  const [switchTimeZone, setSwitchTimeZone] = useState('GMT+3');

  const handleTimeZoneChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSwitchTimeZone(selectedValue);
  };

  return (
    <SettingsSelectField
      title='Time zone'
      description='Change the time zone of the application'
      settings={[{ value: 'GMT+3', label: 'GMT+3' }]}
      value={switchTimeZone}
      onChange={handleTimeZoneChange}
    />
  );
}
