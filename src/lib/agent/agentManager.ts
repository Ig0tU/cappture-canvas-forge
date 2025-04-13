
// Agent management
import { STATE } from '../state/appState';
import { updateTerminal } from '../ui/terminalManager';
import { addMessage } from '../ui/chatManager';
import { simulateFileCreate, simulateFileDelete } from '../fileSystem/fileManager';
import { MessageTypes, formatPotentialCode } from '../utils/messageFormatters';
import { sleep, randomDelay } from '../utils/sanitization';

// Toggle agent state
export const toggleAgentState = (): boolean => {
  STATE.agent.active = !STATE.agent.active;
  
  const status = STATE.agent.active ? 'activated' : 'deactivated';
  updateTerminal(`Agent ${status}`, MessageTypes.SYSTEM);
  
  // If activating, send welcome message
  if (STATE.agent.active) {
    addMessage(
      `Hello! I'm ${STATE.agent.name}. How can I assist you today?`,
      MessageTypes.AGENT,
      STATE.agent.name
    );
  }
  
  return STATE.agent.active;
};

// Set processing state
export const setProcessingState = (processing: boolean): void => {
  STATE.agent.processing = processing;
  
  // Update UI elements based on processing state
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.style.display = processing ? 'flex' : 'none';
  }
  
  // Disable/enable send button
  const sendButton = document.getElementById('send-message');
  if (sendButton) (sendButton as HTMLButtonElement).disabled = processing;
};

// Simulate agent response to user input
export const simulateAgentAction = async (prompt: string): Promise<string> => {
  if (!STATE.agent.active) {
    addMessage('Please activate the agent first', MessageTypes.SYSTEM);
    return "Agent not active";
  }
  
  setProcessingState(true);
  
  try {
    // Add delay to simulate processing
    await sleep(randomDelay(500, 1500));
    
    // Process the prompt based on keywords
    const lowerPrompt = prompt.toLowerCase();
    let response = "";
    
    // Handle file creation
    if (lowerPrompt.includes('create') || lowerPrompt.includes('new file')) {
      // Determine file type based on prompt
      let fileType = 'js';
      let fileName = 'newFile';
      let content = '// New file created by agent';
      
      if (lowerPrompt.includes('typescript') || lowerPrompt.includes('ts')) {
        fileType = 'ts';
        content = '// TypeScript file created by agent';
      } else if (lowerPrompt.includes('html')) {
        fileType = 'html';
        content = '<!-- HTML file created by agent -->\n<html>\n<body>\n  <h1>New File</h1>\n</body>\n</html>';
      } else if (lowerPrompt.includes('css')) {
        fileType = 'css';
        content = '/* CSS file created by agent */\nbody {\n  margin: 0;\n  padding: 0;\n}';
      } else if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
        fileType = 'tsx';
        content = 'import React from "react";\n\nexport const NewComponent: React.FC = () => {\n  return <div>New Component</div>;\n};\n\nexport default NewComponent;';
        fileName = 'NewComponent';
      }
      
      // Extract file name from prompt if present
      const fileNameMatch = prompt.match(/file\s+named\s+(\w+)/i);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
      
      simulateFileCreate(`${fileName}.${fileType}`, fileType, content);
      
      response = `I've created a new ${fileType.toUpperCase()} file named "${fileName}.${fileType}" for you.`;
    } 
    // Handle file deletion
    else if (lowerPrompt.includes('delete') || lowerPrompt.includes('remove file')) {
      // Find a file to delete (this is just a simulation)
      const fileMatch = prompt.match(/delete\s+(\w+\.\w+)/i);
      const fileName = fileMatch ? fileMatch[1] : STATE.workspace.files[0]?.name;
      
      if (fileName) {
        const file = STATE.workspace.files.find(f => f.name === fileName);
        if (file) {
          simulateFileDelete(file.id);
          response = `I've deleted the file "${fileName}" for you.`;
        } else {
          response = `I couldn't find a file named "${fileName}" to delete.`;
        }
      } else {
        response = "I couldn't find any files to delete.";
      }
    } 
    // Handle code explanations
    else if (lowerPrompt.includes('explain') || lowerPrompt.includes('how does')) {
      response = `Here's an explanation of how this works:\n\n\`\`\`javascript\n// This is a simplified example\nfunction explainCode() {\n  console.log("Code explanation");\n  return "Understanding achieved";\n}\n\`\`\`\n\nThe code above demonstrates a basic function that logs a message and returns a string value.`;
    } 
    // Default response for other queries
    else {
      response = "I understand your request. How would you like me to help you with your project today?";
    }
    
    // Add agent message
    addMessage(
      formatPotentialCode(response),
      MessageTypes.AGENT,
      STATE.agent.name
    );
    
    // Log to terminal
    updateTerminal(`Agent response: ${response}`, MessageTypes.AGENT);
    
    setProcessingState(false);
    return response;
  } catch (error) {
    console.error("Error in agent action:", error);
    setProcessingState(false);
    return `Error: ${error.message}`;
  }
};

// Export functions
export { toggleAgentState, setProcessingState, simulateAgentAction };
