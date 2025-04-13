
// Canvas state management - Main export file
import { STATE, loadSettings, saveSettings } from './state/appState';
import { ELEMENTS, initializeElements } from './utils/domElements';
import { updateTerminal } from './ui/terminalManager';
import { addMessage } from './ui/chatManager';
import { updateFileList } from './fileSystem/fileManager';
import { MessageTypes } from './utils/messageFormatters';

// Re-export everything for backward compatibility
export { STATE, ELEMENTS, MessageTypes };
export { updateTerminal, showTypingIndicator, hideTypingIndicator, clearTerminal } from './ui/terminalManager';
export { addMessage, clearChat } from './ui/chatManager';
export { simulateFileCreate, simulateFileDelete, simulateFileClick, updateFileList } from './fileSystem/fileManager';
export { toggleAgentState, setProcessingState, simulateAgentAction } from './agent/agentManager';
export { getCurrentTimestamp, formatPotentialCode } from './utils/messageFormatters';
export { generateId, sanitizeHTML, sleep, randomDelay } from './utils/sanitization';
export { loadSettings, saveSettings };

// Initialization
export const initializeCanvasState = (): void => {
  // Initialize DOM elements
  initializeElements();
  
  // Load settings
  loadSettings();
  
  // Initialize UI
  updateFileList();
  
  // Add initial system message
  if (ELEMENTS.chatContainer && ELEMENTS.chatContainer.children.length === 0) {
    addMessage(
      'Welcome to CapptureCanvas! I can help you build, modify, and evolve your applications. What would you like to create today?',
      MessageTypes.SYSTEM
    );
  }
  
  updateTerminal('CapptureCanvas initialized', MessageTypes.INFO);
};
