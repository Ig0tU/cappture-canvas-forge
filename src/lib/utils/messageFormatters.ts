
// Utility functions for formatting messages
import { sanitizeHTML } from './sanitization';

export const MessageTypes = {
  USER: 'user',
  AGENT: 'agent',
  SYSTEM: 'system',
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning'
};

export const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
