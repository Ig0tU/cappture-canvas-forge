
import { 
  STATE, 
  ELEMENTS, 
  toggleAgentState, 
  setProcessingState,
  simulateAgentAction,
  clearChat,
  clearTerminal,
  updateTerminal,
  simulateFileCreate,
  MessageTypes,
  saveSettings
} from './canvasState';

// Event handler setup
export const setupEventListeners = (): void => {
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      STATE.settings.sidebarExpanded = !STATE.settings.sidebarExpanded;
      document.body.classList.toggle('sidebar-collapsed', !STATE.settings.sidebarExpanded);
      saveSettings();
    });
  }
  
  // LLM provider selection
  const llmProviders = document.querySelectorAll('.llm-provider');
  llmProviders.forEach(provider => {
    provider.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const providerId = target.dataset.providerId;
      if (providerId) {
        STATE.agent.selectedProvider = providerId;
        
        // Update UI
        llmProviders.forEach(p => p.classList.remove('active'));
        target.classList.add('active');
        
        updateTerminal(`LLM provider set to ${providerId}`, MessageTypes.INFO);
      }
    });
  });
  
  // Agent selection
  const agentSelector = document.getElementById('agent-selector') as HTMLSelectElement;
  if (agentSelector) {
    agentSelector.addEventListener('change', () => {
      STATE.agent.name = agentSelector.value;
      updateTerminal(`Agent set to ${STATE.agent.name}`, MessageTypes.INFO);
    });
  }
  
  // Start agent
  const startAgentButton = document.getElementById('start-agent');
  if (startAgentButton) {
    startAgentButton.addEventListener('click', () => {
      toggleAgentState(true);
    });
  }
  
  // Stop agent
  const stopAgentButton = document.getElementById('stop-agent');
  if (stopAgentButton) {
    stopAgentButton.addEventListener('click', () => {
      toggleAgentState(false);
    });
  }
  
  // Send message
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input') as HTMLInputElement;
  
  if (chatForm && messageInput) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userMessage = messageInput.value.trim();
      if (userMessage && !STATE.agent.processing) {
        messageInput.value = '';
        await simulateAgentAction(userMessage);
      }
    });
  }
  
  // Clear chat
  const clearChatButton = document.getElementById('clear-chat');
  if (clearChatButton) {
    clearChatButton.addEventListener('click', clearChat);
  }
  
  // Clear terminal
  const clearTerminalButton = document.getElementById('clear-terminal');
  if (clearTerminalButton) {
    clearTerminalButton.addEventListener('click', clearTerminal);
  }
  
  // File attachment
  const fileAttachButton = document.getElementById('file-attach');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  
  if (fileAttachButton && fileInput) {
    fileAttachButton.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Show attached file
        const attachmentPreview = document.getElementById('attachment-preview');
        if (attachmentPreview) {
          attachmentPreview.innerHTML = `
            <div class="attachment-item">
              <span>${file.name}</span>
              <button id="remove-attachment">&times;</button>
            </div>
          `;
          attachmentPreview.style.display = 'block';
          
          // Setup remove attachment
          const removeButton = document.getElementById('remove-attachment');
          if (removeButton) {
            removeButton.addEventListener('click', () => {
              fileInput.value = '';
              attachmentPreview.innerHTML = '';
              attachmentPreview.style.display = 'none';
            });
          }
        }
      }
    });
  }
  
  // Settings modal
  const settingsButton = document.getElementById('settings-button');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsButton = document.getElementById('close-settings');
  const saveSettingsButton = document.getElementById('save-settings');
  
  if (settingsButton && settingsModal && closeSettingsButton && saveSettingsButton) {
    // Open settings modal
    settingsButton.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
    });
    
    // Close settings modal
    closeSettingsButton.addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });
    
    // Save settings
    saveSettingsButton.addEventListener('click', () => {
      // Get values from form
      const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
      const fontSizeInput = document.getElementById('font-size-input') as HTMLInputElement;
      const tabSizeInput = document.getElementById('tab-size-input') as HTMLInputElement;
      const autoSaveCheckbox = document.getElementById('auto-save-checkbox') as HTMLInputElement;
      const terminalVisibleCheckbox = document.getElementById('terminal-visible-checkbox') as HTMLInputElement;
      
      // Update state
      STATE.settings.theme = themeSelect.value;
      STATE.settings.fontSize = parseInt(fontSizeInput.value, 10) || 14;
      STATE.settings.tabSize = parseInt(tabSizeInput.value, 10) || 2;
      STATE.settings.autoSave = autoSaveCheckbox.checked;
      STATE.settings.terminalVisible = terminalVisibleCheckbox.checked;
      
      // Apply settings
      document.body.setAttribute('data-theme', STATE.settings.theme);
      document.documentElement.style.setProperty('--font-size', `${STATE.settings.fontSize}px`);
      document.documentElement.style.setProperty('--tab-size', STATE.settings.tabSize.toString());
      
      const terminalContainer = document.getElementById('terminal-container');
      if (terminalContainer) {
        terminalContainer.style.display = STATE.settings.terminalVisible ? 'block' : 'none';
      }
      
      // Save to local storage
      saveSettings();
      
      // Close modal
      settingsModal.style.display = 'none';
    });
  }
  
  // New file button
  const newFileButton = document.getElementById('new-file');
  if (newFileButton) {
    newFileButton.addEventListener('click', () => {
      const fileName = prompt('Enter file name:');
      if (fileName) {
        const fileExtension = fileName.split('.').pop() || 'js';
        const fileType = {
          'js': 'js',
          'html': 'html',
          'css': 'css',
          'json': 'json',
          'md': 'markdown'
        }[fileExtension] || 'text';
        
        simulateFileCreate(fileName, fileType);
      }
    });
  }
};
