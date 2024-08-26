interface ShortcutDataProps {
  windowsKeys: string[];
  macOSKeys: string[];
  description: string;
}

export const Shortcuts: ShortcutDataProps[] = [
  {
    windowsKeys: ['CTRL', 'C'],
    macOSKeys: ['COMMAND', 'C'],
    description: 'Undo last action',
  },
  {
    windowsKeys: ['CTRL', 'Y'],
    macOSKeys: ['COMMAND', 'Y'],
    description: 'Redo last action',
  },
  {
    windowsKeys: ['CTRL', 'A'],
    macOSKeys: ['COMMAND', 'A'],
    description: 'Select everything',
  },
  {
    windowsKeys: ['CTRL', 'SHIFT', 'ESC'],
    macOSKeys: ['ALT', 'COMMAND', 'ESC'],
    description: 'Task manager',
  },
];
