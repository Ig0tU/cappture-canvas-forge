
// Chat UI management
import { ELEMENTS } from '../utils/domElements';
import { formatPotentialCode } from '../utils/messageFormatters';

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
  timestamp.textContent = new Date().toLocaleTimeString();
  messageElement.appendChild(timestamp);
  
  ELEMENTS.chatContainer.appendChild(messageElement);
  ELEMENTS.chatContainer.scrollTop = ELEMENTS.chatContainer.scrollHeight;
};

export const clearChat = (): void => {
  if (!ELEMENTS.chatContainer) return;
  
  // Remove all messages except the initial system message
  while (ELEMENTS.chatContainer.children.length > 1) {
    ELEMENTS.chatContainer.removeChild(ELEMENTS.chatContainer.lastChild as Node);
  }
};
