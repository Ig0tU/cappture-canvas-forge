
// Agent management
import { STATE } from '../state/appState';
import { updateTerminal } from '../ui/terminalManager';
import { MessageTypes } from '../utils/messageFormatters';
import { addMessage } from '../ui/chatManager';
import { simulateFileCreate, simulateFileDelete } from '../fileSystem/fileManager';
import { randomDelay } from '../utils/sanitization';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

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
    document.body.classList.add('agent-processing');
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.style.display = 'flex';
  } else {
    document.body.classList.remove('agent-processing');
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.style.display = 'none';
  }
  
  // Disable send button when processing
  const sendButton = document.getElementById('send-message');
  if (sendButton) (sendButton as HTMLButtonElement).disabled = processing;
};

export const simulateAgentAction = async (prompt: string): Promise<string> => {
  if (!STATE.agent.active) {
    addMessage('Please activate the agent first', MessageTypes.SYSTEM);
    return "Agent not active";
  }
  
  setProcessingState(true);
  
  // Add user message to chat
  addMessage(prompt, MessageTypes.USER, 'You');
  updateTerminal(`User message: ${prompt}`, MessageTypes.USER);
  
  try {
    // Try to use the real API if available, fall back to simulation
    let response: string;
    try {
      // Attempt to call the API
      const { data, error } = await supabase.functions.invoke('agent-process', {
        body: { message: prompt }
      });
      
      if (error) throw error;
      response = data.response || "I've processed your request.";
      
      // Execute any actions returned from the API
      if (data.actions) {
        for (const action of data.actions) {
          if (action.type === 'createFile') {
            simulateFileCreate(action.filename, action.filetype || 'js', action.content || '');
          }
        }
      }
    } catch (apiError) {
      console.warn("API call failed, using simulated response", apiError);
      
      // Simulate agent thinking...
      await randomDelay(1000, 3000);
      
      // Simple response logic based on keywords
      if (prompt.toLowerCase().includes('create file') || prompt.toLowerCase().includes('new file')) {
        const fileName = `new_file_${STATE.workspace.files.length + 1}.js`;
        simulateFileCreate(fileName, 'js', '// New file created by agent\n\nconsole.log("Hello from new file");');
        response = `I've created a new file named "${fileName}" for you.`;
      } 
      else if (prompt.toLowerCase().includes('delete file')) {
        if (STATE.workspace.files.length > 0) {
          const fileToDelete = STATE.workspace.files[0].name;
          simulateFileDelete(STATE.workspace.files[0].id);
          response = `I've deleted the file "${fileToDelete}" as requested.`;
        } else {
          response = "There are no files to delete.";
        }
      }
      else if (prompt.toLowerCase().includes('help')) {
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
    }

    // Add agent response to chat
    await randomDelay(500, 2000);
    addMessage(response, MessageTypes.AGENT, STATE.agent.name);
    updateTerminal(`Agent response: ${response}`, MessageTypes.AGENT);
    
    setProcessingState(false);
    return response;
  } catch (error) {
    console.error("Error in agent action:", error);
    setProcessingState(false);
    return `Error: ${error.message}`;
  }
};
