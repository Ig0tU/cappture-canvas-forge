
// Simulated AI agent management
import { STATE } from '../state/appState';
import { ELEMENTS } from '../utils/domElements';
import { addMessage } from '../ui/chatManager';
import { MessageTypes } from '../utils/messageFormatters';
import { randomDelay } from '../utils/sanitization';

// Flag to track if the agent is processing a request
let isProcessing = false;

/**
 * Toggle the agent active state
 */
export const toggleAgentState = (): boolean => {
  STATE.agent.active = !STATE.agent.active;
  return STATE.agent.active;
};

/**
 * Set the processing state for the agent
 */
export const setProcessingState = (state: boolean): void => {
  isProcessing = state;
  
  // Update UI elements based on processing state
  if (ELEMENTS.sendButton) {
    ELEMENTS.sendButton.disabled = state;
  }
  
  if (ELEMENTS.inputField) {
    ELEMENTS.inputField.disabled = state;
  }
  
  // Show/hide typing indicator
  if (ELEMENTS.typingIndicator) {
    ELEMENTS.typingIndicator.style.display = state ? 'flex' : 'none';
  }
};

/**
 * Simulate an agent action
 */
export const simulateAgentAction = async (input: string): Promise<string> => {
  // Basic agent output handler
  const processResponse = async (): Promise<string> => {
    // Add a random delay to simulate thinking
    await randomDelay(500, 2000);
    
    // Define some basic responses
    const responses = [
      `I've processed your request: "${input}"`,
      `Working on: "${input}"`,
      `I understand you want to ${input.toLowerCase()}`,
      `Let me handle that for you: ${input}`,
    ];
    
    // Select a random response
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add the agent's response to the chat
    addMessage(response, MessageTypes.AGENT, STATE.agent.name);
    
    return response;
  };
  
  // Add the user's message to the chat
  addMessage(input, MessageTypes.USER, 'You');
  
  try {
    // Process the response and return it
    return await processResponse();
  } catch (error) {
    console.error('Error processing agent action:', error);
    const errorMessage = 'Sorry, I encountered an error processing your request.';
    addMessage(errorMessage, MessageTypes.SYSTEM);
    return errorMessage;
  }
};
