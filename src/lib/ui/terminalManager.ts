
// Terminal UI management
import { ELEMENTS } from '../utils/domElements';
import { MessageTypes, getCurrentTimestamp } from '../utils/messageFormatters';
import { sanitizeHTML } from '../utils/sanitization';

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

export const clearTerminal = (): void => {
  if (!ELEMENTS.terminalOutput) return;
  
  ELEMENTS.terminalOutput.innerHTML = '';
  updateTerminal('Terminal cleared', MessageTypes.INFO);
};
