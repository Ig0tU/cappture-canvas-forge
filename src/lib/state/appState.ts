
// Application state management
import { getCurrentTimestamp } from '../utils/messageFormatters';

// Application state
export const STATE = {
  agent: {
    active: false,
    processing: false,
    name: 'CapptureAgent',
    selectedProvider: 'gpt-4'
  },
  settings: {
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    autoSave: true,
    terminalVisible: true,
    sidebarExpanded: true
  },
  workspace: {
    files: [
      { id: 'index.html', name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
      { id: 'style.css', name: 'style.css', type: 'css', content: 'body {\n  font-family: sans-serif;\n}' },
      { id: 'script.js', name: 'script.js', type: 'js', content: 'console.log("Hello World");' }
    ],
    activeFile: 'index.html'
  }
};

// Local storage management
export const loadSettings = (): void => {
  const savedSettings = localStorage.getItem('canvasSettings');
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      STATE.settings = { ...STATE.settings, ...parsedSettings };
      console.info('Settings loaded from local storage');
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  }
};

export const saveSettings = (): void => {
  try {
    localStorage.setItem('canvasSettings', JSON.stringify(STATE.settings));
    console.info('Settings saved to local storage');
  } catch (error) {
    console.error('Failed to save settings', error);
  }
};
