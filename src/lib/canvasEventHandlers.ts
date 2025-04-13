
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
  saveSettings,
  simulateFileDelete,
  updateFileList,
  formatPotentialCode,
  addMessage
} from './canvasState';

const API_ENDPOINT = 'https://api.cappturecanvas.io/v1';

// Simulated API calls
const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    updateTerminal(`API ${method} request to ${endpoint}`, MessageTypes.INFO);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Simulate response based on endpoint
    let response;
    
    switch (endpoint) {
      case '/agent/status':
        response = { active: STATE.agent.active, name: STATE.agent.name };
        break;
      case '/agent/start':
        response = { success: true, message: 'Agent activated successfully' };
        break;
      case '/agent/stop':
        response = { success: true, message: 'Agent deactivated successfully' };
        break;
      case '/files':
        response = { files: STATE.workspace.files };
        break;
      default:
        if (endpoint.startsWith('/files/') && method === 'DELETE') {
          const fileId = endpoint.split('/').pop();
          response = { success: true, message: `File ${fileId} deleted successfully` };
        } else if (endpoint === '/files' && method === 'POST') {
          response = { 
            success: true, 
            file: { 
              id: `file-${Date.now()}`,
              name: data.name,
              type: data.type,
              content: data.content
            } 
          };
        } else if (endpoint === '/agent/process' && method === 'POST') {
          response = { 
            success: true,
            result: `Processed: ${data.message}`,
            actions: [
              { type: 'create_file', fileName: 'example.js', content: '// Auto-generated file' }
            ]
          };
        } else {
          response = { error: 'Unknown endpoint' };
        }
    }
    
    updateTerminal(`API response: ${JSON.stringify(response).substring(0, 100)}...`, MessageTypes.INFO);
    return response;
  } catch (error) {
    updateTerminal(`API Error: ${error}`, MessageTypes.ERROR);
    throw error;
  }
};

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
    provider.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLElement;
      const providerId = target.dataset.providerId;
      if (providerId) {
        STATE.agent.selectedProvider = providerId;
        
        // Update UI
        llmProviders.forEach(p => p.classList.remove('active'));
        target.classList.add('active');
        
        updateTerminal(`LLM provider set to ${providerId}`, MessageTypes.INFO);
        
        // Update provider via API
        try {
          await apiCall('/provider/select', 'POST', { provider: providerId });
        } catch (error) {
          console.error('Failed to update provider:', error);
        }
      }
    });
  });
  
  // Agent selection
  const agentSelector = document.getElementById('agent-selector') as HTMLSelectElement;
  if (agentSelector) {
    agentSelector.addEventListener('change', async () => {
      STATE.agent.name = agentSelector.value;
      updateTerminal(`Agent set to ${STATE.agent.name}`, MessageTypes.INFO);
      
      // Update agent via API
      try {
        await apiCall('/agent/configure', 'POST', { name: STATE.agent.name });
      } catch (error) {
        console.error('Failed to configure agent:', error);
      }
    });
  }
  
  // Start agent
  const startAgentButton = document.getElementById('start-agent');
  if (startAgentButton) {
    startAgentButton.addEventListener('click', async () => {
      try {
        const response = await apiCall('/agent/start', 'POST');
        if (response.success) {
          toggleAgentState(true);
        }
      } catch (error) {
        console.error('Failed to start agent:', error);
        updateTerminal('Failed to start agent', MessageTypes.ERROR);
      }
    });
  }
  
  // Stop agent
  const stopAgentButton = document.getElementById('stop-agent');
  if (stopAgentButton) {
    stopAgentButton.addEventListener('click', async () => {
      try {
        const response = await apiCall('/agent/stop', 'POST');
        if (response.success) {
          toggleAgentState(false);
        }
      } catch (error) {
        console.error('Failed to stop agent:', error);
        updateTerminal('Failed to stop agent', MessageTypes.ERROR);
      }
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
        
        try {
          setProcessingState(true);
          
          // Add user message to chat
          if (ELEMENTS.chatContainer) {
            addMessage(userMessage, MessageTypes.USER, 'You');
          }
          
          updateTerminal(`Processing message: ${userMessage}`, MessageTypes.USER);
          
          // Process message via API simulation
          const response = await apiCall('/agent/process', 'POST', { message: userMessage });
          
          // Handle any actions from the response
          if (response.actions) {
            for (const action of response.actions) {
              if (action.type === 'create_file') {
                simulateFileCreate(action.fileName, 'js', action.content || '');
              }
            }
          }
          
          // Add agent response to chat
          if (ELEMENTS.chatContainer) {
            addMessage(response.result || 'Processing complete', MessageTypes.AGENT, STATE.agent.name);
          }
          
          await simulateAgentAction(userMessage);
        } catch (error) {
          console.error('Error processing message:', error);
          updateTerminal('Failed to process message', MessageTypes.ERROR);
        } finally {
          setProcessingState(false);
        }
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
    
    fileInput.addEventListener('change', async () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Process file upload
        try {
          updateTerminal(`Uploading file: ${file.name}`, MessageTypes.INFO);
          
          // Read file contents
          const reader = new FileReader();
          reader.onload = async (event) => {
            const content = event.target?.result as string;
            
            // Create file in workspace
            const fileExtension = file.name.split('.').pop() || 'txt';
            const fileType = {
              'js': 'js',
              'html': 'html',
              'css': 'css',
              'json': 'json',
              'md': 'markdown',
              'txt': 'text'
            }[fileExtension.toLowerCase()] || 'text';
            
            // Simulate file upload via API
            try {
              const response = await apiCall('/files', 'POST', {
                name: file.name,
                type: fileType,
                content: content
              });
              
              if (response.success && response.file) {
                simulateFileCreate(file.name, fileType, content);
                updateTerminal(`File ${file.name} uploaded successfully`, MessageTypes.SUCCESS);
              }
            } catch (error) {
              console.error('Failed to upload file:', error);
              updateTerminal(`Failed to upload file: ${file.name}`, MessageTypes.ERROR);
            }
          };
          
          reader.readAsText(file);
          
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
        } catch (error) {
          console.error('Error handling file:', error);
          updateTerminal(`Error handling file: ${error}`, MessageTypes.ERROR);
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
    saveSettingsButton.addEventListener('click', async () => {
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
      
      // Save to API and local storage
      try {
        await apiCall('/settings', 'POST', STATE.settings);
        saveSettings();
        updateTerminal('Settings saved successfully', MessageTypes.SUCCESS);
      } catch (error) {
        console.error('Failed to save settings:', error);
        updateTerminal('Failed to save settings to API', MessageTypes.ERROR);
      }
      
      // Close modal
      settingsModal.style.display = 'none';
    });
  }
  
  // New file button
  const newFileButton = document.getElementById('new-file');
  if (newFileButton) {
    newFileButton.addEventListener('click', async () => {
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
        
        try {
          // Create file via API
          const response = await apiCall('/files', 'POST', {
            name: fileName,
            type: fileType,
            content: `// New ${fileType} file created at ${new Date().toISOString()}`
          });
          
          if (response.success && response.file) {
            simulateFileCreate(fileName, fileType);
            updateTerminal(`File ${fileName} created successfully`, MessageTypes.SUCCESS);
          }
        } catch (error) {
          console.error('Failed to create file:', error);
          updateTerminal(`Failed to create file: ${fileName}`, MessageTypes.ERROR);
        }
      }
    });
  }
  
  // Handle file list interactions
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    
    // File deletion
    if (target.classList.contains('file-delete')) {
      const fileId = target.getAttribute('data-file-id');
      if (fileId) {
        try {
          const response = await apiCall(`/files/${fileId}`, 'DELETE');
          if (response.success) {
            simulateFileDelete(fileId);
          }
        } catch (error) {
          console.error('Failed to delete file:', error);
          updateTerminal(`Failed to delete file ${fileId}`, MessageTypes.ERROR);
        }
      }
    }
  });
  
  // Initialize workspace
  initializeWorkspace();
};

// Initialize workspace with files from API
const initializeWorkspace = async (): Promise<void> => {
  try {
    updateTerminal('Initializing workspace...', MessageTypes.INFO);
    
    // Fetch files from API
    const response = await apiCall('/files');
    
    if (response.files) {
      // Update state with files
      STATE.workspace.files = response.files;
      
      // Update file list UI
      updateFileList();
      
      updateTerminal('Workspace initialized successfully', MessageTypes.SUCCESS);
    }
  } catch (error) {
    console.error('Failed to initialize workspace:', error);
    updateTerminal('Failed to initialize workspace', MessageTypes.ERROR);
  }
};
