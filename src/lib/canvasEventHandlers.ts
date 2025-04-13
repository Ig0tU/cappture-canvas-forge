
import { STATE, updateTerminal, MessageTypes, simulateFileCreate, simulateFileDelete, simulateAgentAction } from './canvasState';

export const setupEventListeners = (): void => {
  // Listen for new file creation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Handle new file button
    if (target.id === 'new-file' || target.closest('#new-file')) {
      e.preventDefault();
      const fileName = prompt('Enter file name:', 'new-file.js');
      if (fileName) {
        const fileType = fileName.split('.').pop() || 'js';
        simulateFileCreate(fileName, fileType);
      }
    }
  });

  // Listen for canvas actions like element selection and manipulation
  document.addEventListener('dragend', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.canvas-editor')) {
      updateTerminal('Element position updated', MessageTypes.INFO);
    }
  });

  // Listen for agent activation toggle
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    if (target.id === 'start-agent' || target.closest('#start-agent')) {
      e.preventDefault();
      STATE.agent.active = true;
      updateTerminal('Agent activated', MessageTypes.SUCCESS);
    }
    
    if (target.id === 'stop-agent' || target.closest('#stop-agent')) {
      e.preventDefault();
      STATE.agent.active = false;
      updateTerminal('Agent deactivated', MessageTypes.INFO);
    }
  });

  // Listen for form submissions
  document.addEventListener('submit', (e) => {
    const target = e.target as HTMLElement;
    
    if (target.id === 'chat-form') {
      e.preventDefault();
      const inputElement = document.getElementById('message-input') as HTMLInputElement;
      
      if (inputElement && inputElement.value.trim()) {
        const userInput = inputElement.value.trim();
        inputElement.value = '';
        
        if (STATE.agent.active) {
          simulateAgentAction(userInput);
        } else {
          updateTerminal('Please activate the agent first', MessageTypes.WARNING);
        }
      }
    }
  });

  // Initialize with settings
  window.addEventListener('load', () => {
    updateTerminal('Event handlers initialized', MessageTypes.INFO);
  });
};
