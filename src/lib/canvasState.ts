// Message types for app communication
export const MessageTypes = {
  USER: 'user',
  AGENT: 'agent',
  SYSTEM: 'system',
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning'
};

// Element references - will be populated on initialization
export const ELEMENTS = {
  chatContainer: null as HTMLElement | null,
  terminalOutput: null as HTMLElement | null,
  fileList: null as HTMLElement | null,
  typingIndicator: null as HTMLElement | null
};

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

// Utility functions
export const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const sanitizeHTML = (html: string): string => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const randomDelay = (min: number, max: number): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(delay);
};

// Local storage management
export const loadSettings = (): void => {
  const savedSettings = localStorage.getItem('canvasSettings');
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      STATE.settings = { ...STATE.settings, ...parsedSettings };
      updateTerminal('Settings loaded from local storage', MessageTypes.INFO);
    } catch (error) {
      updateTerminal('Failed to load settings', MessageTypes.ERROR);
    }
  }
};

export const saveSettings = (): void => {
  try {
    localStorage.setItem('canvasSettings', JSON.stringify(STATE.settings));
    updateTerminal('Settings saved to local storage', MessageTypes.SUCCESS);
  } catch (error) {
    updateTerminal('Failed to save settings', MessageTypes.ERROR);
  }
};

// UI Update Functions
export const updateFileList = (): void => {
  if (!ELEMENTS.fileList) return;
  
  ELEMENTS.fileList.innerHTML = '';
  STATE.workspace.files.forEach(file => {
    const fileElement = document.createElement('div');
    fileElement.className = 'file-item';
    fileElement.dataset.fileId = file.id;
    fileElement.innerHTML = `
      <span class="file-name">${file.name}</span>
      <button class="file-delete" data-file-id="${file.id}">&times;</button>
    `;
    ELEMENTS.fileList.appendChild(fileElement);
    
    fileElement.addEventListener('click', () => simulateFileClick(file.id));
    fileElement.querySelector('.file-delete')?.addEventListener('click', (e) => {
      e.stopPropagation();
      simulateFileDelete(file.id);
    });
  });
};

export const addMessage = (content: string, type: string, sender?: string): void => {
  if (!ELEMENTS.chatContainer) return;
  
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  
  if (sender) {
    messageElement.innerHTML = `<div class="message-sender">${sender}</div>`;
  }
  
  const formattedContent = formatPotentialCode(content);
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = formattedContent;
  
  messageElement.appendChild(messageContent);
  
  const timestamp = document.createElement('div');
  timestamp.className = 'message-timestamp';
  timestamp.textContent = getCurrentTimestamp();
  messageElement.appendChild(timestamp);
  
  ELEMENTS.chatContainer.appendChild(messageElement);
  ELEMENTS.chatContainer.scrollTop = ELEMENTS.chatContainer.scrollHeight;
};

export const formatPotentialCode = (content: string): string => {
  // Simple code block detection and formatting
  let formatted = content;
  
  // Format code blocks with ```
  formatted = formatted.replace(/```(\w*)([\s\S]*?)```/g, function(match, language, code) {
    return `<pre class="code-block ${language}"><code>${sanitizeHTML(code.trim())}</code></pre>`;
  });
  
  // Format inline code with `
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  return formatted;
};

// Terminal management
export const updateTerminal = (message: string, type: string): void => {
  if (!ELEMENTS.terminalOutput) return;
  
  const terminalLine = document.createElement('div');
  terminalLine.className = `terminal-line terminal-${type}`;
  
  const prefix = {
    [MessageTypes.ERROR]: '❌ ERROR: ',
    [MessageTypes.SUCCESS]: '✅ SUCCESS: ',
    [MessageTypes.INFO]: 'ℹ️ INFO: ',
    [MessageTypes.WARNING]: '⚠️ WARNING: ',
    [MessageTypes.SYSTEM]: '🔄 SYSTEM: ',
    [MessageTypes.AGENT]: '🤖 AGENT: ',
    [MessageTypes.USER]: '👤 USER: '
  }[type] || '';
  
  terminalLine.innerHTML = `<span class="terminal-time">[${getCurrentTimestamp()}]</span> ${prefix}${sanitizeHTML(message)}`;
  
  ELEMENTS.terminalOutput.appendChild(terminalLine);
  ELEMENTS.terminalOutput.scrollTop = ELEMENTS.terminalOutput.scrollHeight;
};

export const showTypingIndicator = (): void => {
  if (!ELEMENTS.typingIndicator) return;
  ELEMENTS.typingIndicator.style.display = 'flex';
};

export const hideTypingIndicator = (): void => {
  if (!ELEMENTS.typingIndicator) return;
  ELEMENTS.typingIndicator.style.display = 'none';
};

// Agent control functions
export const toggleAgentState = (active: boolean): void => {
  STATE.agent.active = active;
  updateTerminal(
    active ? `Agent ${STATE.agent.name} activated` : `Agent ${STATE.agent.name} deactivated`, 
    active ? MessageTypes.SUCCESS : MessageTypes.INFO
  );
  
  // Update UI controls based on agent state
  const startButton = document.getElementById('start-agent');
  const stopButton = document.getElementById('stop-agent');
  
  if (startButton) (startButton as HTMLButtonElement).disabled = active;
  if (stopButton) (stopButton as HTMLButtonElement).disabled = !active;
};

export const setProcessingState = (processing: boolean): void => {
  STATE.agent.processing = processing;
  
  // Update UI to reflect processing state
  if (processing) {
    showTypingIndicator();
    document.body.classList.add('agent-processing');
  } else {
    hideTypingIndicator();
    document.body.classList.remove('agent-processing');
  }
  
  // Disable send button when processing
  const sendButton = document.getElementById('send-message');
  if (sendButton) (sendButton as HTMLButtonElement).disabled = processing;
};

// Chat management
export const clearChat = (): void => {
  if (!ELEMENTS.chatContainer) return;
  
  // Remove all messages except the initial system message
  while (ELEMENTS.chatContainer.children.length > 1) {
    ELEMENTS.chatContainer.removeChild(ELEMENTS.chatContainer.lastChild as Node);
  }
  
  updateTerminal('Chat cleared', MessageTypes.INFO);
};

export const clearTerminal = (): void => {
  if (!ELEMENTS.terminalOutput) return;
  
  ELEMENTS.terminalOutput.innerHTML = '';
  updateTerminal('Terminal cleared', MessageTypes.INFO);
};

// File management
export const simulateFileClick = (fileId: string): void => {
  STATE.workspace.activeFile = fileId;
  
  // Update UI to show the selected file
  document.querySelectorAll('.file-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeFileElement = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (activeFileElement) activeFileElement.classList.add('active');
  
  updateTerminal(`File ${fileId} selected`, MessageTypes.INFO);
};

export const simulateFileDelete = (fileId: string): void => {
  STATE.workspace.files = STATE.workspace.files.filter(file => file.id !== fileId);
  
  // If the deleted file is active, select another one
  if (STATE.workspace.activeFile === fileId && STATE.workspace.files.length > 0) {
    STATE.workspace.activeFile = STATE.workspace.files[0].id;
  }
  
  updateFileList();
  updateTerminal(`File ${fileId} deleted`, MessageTypes.WARNING);
};

export const simulateFileCreate = (name: string, type: string, content: string = ''): void => {
  const newFile = {
    id: generateId(),
    name,
    type,
    content
  };
  
  STATE.workspace.files.push(newFile);
  STATE.workspace.activeFile = newFile.id;
  
  updateFileList();
  updateTerminal(`File ${name} created`, MessageTypes.SUCCESS);
};

// Agent simulation
export const simulateAgentAction = async (userMessage: string): Promise<void> => {
  if (!STATE.agent.active) {
    addMessage('Please activate the agent first', MessageTypes.SYSTEM);
    return;
  }
  
  setProcessingState(true);
  
  // Add user message to chat
  addMessage(userMessage, MessageTypes.USER, 'You');
  updateTerminal(`User message: ${userMessage}`, MessageTypes.USER);
  
  // Simulate agent thinking...
  await randomDelay(1000, 3000);
  
  // Simple response logic based on keywords
  let response = '';
  
  if (userMessage.toLowerCase().includes('create file') || userMessage.toLowerCase().includes('new file')) {
    const fileName = `new_file_${STATE.workspace.files.length + 1}.js`;
    simulateFileCreate(fileName, 'js', '// New file created by agent\n\nconsole.log("Hello from new file");');
    response = `I've created a new file named "${fileName}" for you.`;
  } 
  else if (userMessage.toLowerCase().includes('delete file')) {
    if (STATE.workspace.files.length > 0) {
      const fileToDelete = STATE.workspace.files[0].name;
      simulateFileDelete(STATE.workspace.files[0].id);
      response = `I've deleted the file "${fileToDelete}" as requested.`;
    } else {
      response = "There are no files to delete.";
    }
  }
  else if (userMessage.toLowerCase().includes('help')) {
    response = "I can help you with:\n- Creating new files\n- Managing your workspace\n- Answering questions about development\n- Providing code examples\n\nJust let me know what you need!";
  }
  else {
    const responses = [
      "I'm analyzing your request. This might take a moment...",
      "That's an interesting question. Let me think about the best approach.",
      "I understand what you're looking for. Here's what I suggest...",
      "Based on your requirements, I recommend the following solution."
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Add agent response to chat
  await randomDelay(500, 2000);
  addMessage(response, MessageTypes.AGENT, STATE.agent.name);
  updateTerminal(`Agent response: ${response}`, MessageTypes.AGENT);
  
  setProcessingState(false);
};

// Initialization
export const initializeCanvasState = (): void => {
  // Set references to DOM elements
  ELEMENTS.chatContainer = document.getElementById('chat-container');
  ELEMENTS.terminalOutput = document.getElementById('terminal-output');
  ELEMENTS.fileList = document.getElementById('file-list');
  ELEMENTS.typingIndicator = document.getElementById('typing-indicator');
  
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
