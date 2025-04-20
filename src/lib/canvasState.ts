
// Canvas state management - Main export file
import { STATE, loadSettings, saveSettings } from './state/appState';
import { ELEMENTS, initializeElements } from './utils/domElements';
import { updateTerminal, showTypingIndicator, hideTypingIndicator, clearTerminal } from './ui/terminalManager';
import { addMessage, clearChat } from './ui/chatManager';
import { simulateFileCreate, simulateFileDelete, simulateFileClick, updateFileList } from './fileSystem/fileManager';
import { MessageTypes, formatPotentialCode, getCurrentTimestamp } from './utils/messageFormatters';
import { toggleAgentState, setProcessingState, simulateAgentAction } from './agent/agentManager';
import { generateId, sanitizeHTML, sleep, randomDelay } from './utils/sanitization';

// Re-export everything for backward compatibility
export { STATE, ELEMENTS, MessageTypes };
export { updateTerminal, showTypingIndicator, hideTypingIndicator, clearTerminal };
export { addMessage, clearChat };
export { simulateFileCreate, simulateFileDelete, simulateFileClick, updateFileList };
export { toggleAgentState, setProcessingState, simulateAgentAction };
export { getCurrentTimestamp, formatPotentialCode };
export { generateId, sanitizeHTML, sleep, randomDelay };
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
