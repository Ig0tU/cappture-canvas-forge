
// DOM Element references
export const ELEMENTS = {
  chatContainer: null as HTMLElement | null,
  terminalOutput: null as HTMLElement | null,
  fileList: null as HTMLElement | null,
  typingIndicator: null as HTMLElement | null,
  sendButton: null as HTMLButtonElement | null,
  inputField: null as HTMLInputElement | null
};

export const initializeElements = (): void => {
  // Set references to DOM elements
  ELEMENTS.chatContainer = document.getElementById('chat-container');
  ELEMENTS.terminalOutput = document.getElementById('terminal-output');
  ELEMENTS.fileList = document.getElementById('file-list');
  ELEMENTS.typingIndicator = document.getElementById('typing-indicator');
  ELEMENTS.sendButton = document.getElementById('send-message') as HTMLButtonElement | null;
  ELEMENTS.inputField = document.getElementById('message-input') as HTMLInputElement | null;
};
