
// Tests for canvasState functionality
import { 
  initializeCanvasState, 
  STATE,
  updateTerminal, 
  addMessage, 
  simulateFileCreate, 
  simulateFileDelete,
  simulateAgentAction
} from '../lib/canvasState';
import { MessageTypes } from '../lib/utils/messageFormatters';
import { ELEMENTS } from '../lib/utils/domElements';
import '@testing-library/jest-dom';

// Mock DOM elements
beforeEach(() => {
  // Setup DOM elements
  document.body.innerHTML = `
    <div id="chat-container"></div>
    <div id="terminal-output"></div>
    <div id="file-list"></div>
    <div id="typing-indicator" style="display: none;"></div>
  `;
  
  // Initialize ELEMENTS references
  ELEMENTS.chatContainer = document.getElementById('chat-container');
  ELEMENTS.terminalOutput = document.getElementById('terminal-output');
  ELEMENTS.fileList = document.getElementById('file-list');
  ELEMENTS.typingIndicator = document.getElementById('typing-indicator');
});

describe('Canvas State', () => {
  test('should initialize with default settings', () => {
    initializeCanvasState();
    
    expect(STATE.agent.active).toBe(false);
    expect(STATE.agent.processing).toBe(false);
    expect(STATE.agent.name).toBe('CapptureAgent');
    
    expect(STATE.settings.theme).toBe('dark');
    expect(STATE.workspace.files.length).toBe(3);
  });
  
  test('should update terminal with messages', () => {
    updateTerminal('Test message', MessageTypes.INFO);
    
    expect(document.getElementById('terminal-output')?.innerHTML).toContain('INFO');
    expect(document.getElementById('terminal-output')?.innerHTML).toContain('Test message');
  });
  
  test('should add chat messages', () => {
    addMessage('Test message', MessageTypes.USER, 'User');
    
    expect(document.getElementById('chat-container')?.innerHTML).toContain('Test message');
    expect(document.getElementById('chat-container')?.innerHTML).toContain('User');
  });
  
  test('should create new files', () => {
    const initialFileCount = STATE.workspace.files.length;
    simulateFileCreate('test.js', 'js', 'console.log("test");');
    
    expect(STATE.workspace.files.length).toBe(initialFileCount + 1);
    expect(STATE.workspace.files.find(f => f.name === 'test.js')).toBeTruthy();
  });
  
  test('should delete files', () => {
    // First create a file
    simulateFileCreate('to-delete.js', 'js');
    const fileToDelete = STATE.workspace.files.find(f => f.name === 'to-delete.js');
    expect(fileToDelete).toBeTruthy();
    
    if (fileToDelete) {
      simulateFileDelete(fileToDelete.id);
      expect(STATE.workspace.files.find(f => f.name === 'to-delete.js')).toBeFalsy();
    }
  });
});
