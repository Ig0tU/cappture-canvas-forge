import { 
  updateTerminal, 
  MessageTypes, 
  simulateFileCreate, 
  simulateFileDelete, 
  simulateAgentAction, 
  STATE 
} from './canvasState';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const setupEventListeners = (): void => {
  // Listen for new file creation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Handle new file button
    if (target.id === 'new-file' || target.closest('#new-file')) {
      e.preventDefault();
      const fileName = prompt('Enter file name:', 'new-file.js');
      if (fileName) {
        const fileType = fileName.split('.').pop() || 'js';
        simulateFileCreate(fileName, fileType);
      }
    }
  });

  // Listen for canvas actions like element selection and manipulation
  document.addEventListener('dragend', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.canvas-editor')) {
      updateTerminal('Element position updated', MessageTypes.INFO);
      
      // Attempt to save element positions to backend
      if (supabase) {
        try {
          // In a real implementation, we would send the element's new position to the backend
          const element = target.closest('[data-element-id]');
          const elementId = element?.getAttribute('data-element-id');
          
          if (elementId) {
            const rect = element?.getBoundingClientRect();
            if (rect) {
              const position = { x: rect.left, y: rect.top };
              
              // Log position update to console for now
              console.log("Element position updated:", elementId, position);
              
              // In a real implementation, we would save this to the backend
              // supabase.from('canvas_elements').update({ position }).eq('id', elementId);
            }
          }
        } catch (error) {
          console.error("Failed to update element position:", error);
        }
      }
    }
  });

  // Listen for agent activation toggle
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    if (target.id === 'start-agent' || target.closest('#start-agent')) {
      e.preventDefault();
      STATE.agent.active = true;
      updateTerminal('Agent activated', MessageTypes.SUCCESS);
      toast({
        title: "Agent Activated",
        description: "The AI assistant is now ready to help you."
      });
    }
    
    if (target.id === 'stop-agent' || target.closest('#stop-agent')) {
      e.preventDefault();
      STATE.agent.active = false;
      updateTerminal('Agent deactivated', MessageTypes.INFO);
      toast({
        title: "Agent Deactivated",
        description: "The AI assistant has been turned off.",
        variant: "destructive"
      });
    }
  });

  // Listen for form submissions
  document.addEventListener('submit', (e) => {
    const target = e.target as HTMLElement;
    
    if (target.id === 'chat-form') {
      e.preventDefault();
      const inputElement = document.getElementById('message-input') as HTMLInputElement;
      
      if (inputElement && inputElement.value.trim()) {
        const userInput = inputElement.value.trim();
        inputElement.value = '';
        
        if (STATE.agent.active) {
          simulateAgentAction(userInput).catch(error => {
            console.error("Error processing message:", error);
            toast({
              title: "Error",
              description: "Failed to process your message. Please try again.",
              variant: "destructive"
            });
          });
        } else {
          updateTerminal('Please activate the agent first', MessageTypes.WARNING);
          toast({
            title: "Agent Inactive",
            description: "Please activate the agent before sending messages.",
            variant: "destructive"
          });
        }
      }
    }
  });

  // Initialize with settings
  window.addEventListener('load', () => {
    updateTerminal('Event handlers initialized', MessageTypes.INFO);
  });
  
  // Setup autosave for canvas elements
  let autoSaveTimeout: number | null = null;
  const AUTOSAVE_DELAY = 5000; // 5 seconds
  
  const triggerAutoSave = () => {
    if (autoSaveTimeout) {
      window.clearTimeout(autoSaveTimeout);
    }
    
    autoSaveTimeout = window.setTimeout(() => {
      try {
        // This would be integrated with a real backend
        const canvasData = document.querySelector('.canvas-editor')?.innerHTML;
        if (canvasData) {
          localStorage.setItem('canvas_autosave', canvasData);
          console.log("Canvas auto-saved at", new Date().toLocaleTimeString());
          updateTerminal('Canvas auto-saved', MessageTypes.INFO);
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, AUTOSAVE_DELAY);
  };
  
  // Listen for canvas changes that should trigger auto-save
  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.canvas-editor')) {
      triggerAutoSave();
    }
  });
  
  document.addEventListener('dragend', () => {
    triggerAutoSave();
  });
};

// Setup Supabase realtime subscription for collaborative editing
export const setupRealtimeSubscription = () => {
  // This would be implemented in a real backend integration
  try {
    if (supabase) {
      const channel = supabase
        .channel('canvas-changes')
        .on('broadcast', { event: 'canvas_update' }, (payload) => {
          console.log("Received canvas update:", payload);
          updateTerminal('Received update from collaborator', MessageTypes.INFO);
          
          // In a real implementation, we would update the canvas with the received data
          // updateCanvasElement(payload.elementId, payload.changes);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  } catch (error) {
    console.error("Failed to setup realtime subscription:", error);
  }
};
