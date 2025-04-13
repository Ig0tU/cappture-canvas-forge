
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Plus, Command, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { simulateAgentAction, MessageTypes, setProcessingState } from '@/lib/canvasState';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to CapptureCanvas! I can help you build, modify, and evolve your applications. What would you like to create today?',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Setup the chat container reference for the global state
    if (chatContainerRef.current) {
      window.document.getElementById('chat-container')?.remove();
      chatContainerRef.current.id = 'chat-container';
    }
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processUserInput = async (userInput: string) => {
    try {
      // Show typing indicator
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.style.display = 'flex';
      }
      
      setProcessingState(true);
      
      // Use our API simulation for responses
      await simulateAgentAction(userInput);
      
      // After the agent responds, generate a contextual response based on the input
      let assistantResponse = '';
      
      if (userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('new')) {
        assistantResponse = "I'll help you create that! Let's start by outlining the structure of what you want to build.";
      } else if (userInput.toLowerCase().includes('modify') || userInput.toLowerCase().includes('change')) {
        assistantResponse = "I can modify that for you. Let me show you how we can implement those changes effectively.";
      } else if (userInput.toLowerCase().includes('optimize') || userInput.toLowerCase().includes('improve')) {
        assistantResponse = "I'll analyze the current implementation and suggest optimizations that will improve performance.";
      } else if (userInput.toLowerCase().includes('explain') || userInput.toLowerCase().includes('how')) {
        assistantResponse = "Let me explain that in detail and provide you with a clear understanding of how it works.";
      } else {
        // Generate a more dynamic response for other queries
        const responses = [
          "I understand what you're looking for. Here's my approach to addressing your requirements.",
          "That's an interesting challenge. I've analyzed several solutions and here's what I recommend.",
          "Based on best practices, here's how we can implement this functionality in your application.",
          "I've considered your needs and here's a solution that balances performance and usability.",
        ];
        assistantResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Hide typing indicator
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }
      
      setProcessingState(false);
      
      return assistantResponse;
    } catch (error) {
      console.error("Error processing user input:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
      
      // Hide typing indicator on error
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }
      
      setProcessingState(false);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      await processUserInput(userMessage.content);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  
  const toggleAgent = () => {
    setIsAgentActive(prev => !prev);
    toast({
      title: isAgentActive ? "Agent Deactivated" : "Agent Activated",
      description: isAgentActive ? "The agent is now deactivated" : "The agent is ready to assist you",
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Canvas Assistant</h3>
          <Button 
            size="sm" 
            variant={isAgentActive ? "default" : "outline"}
            onClick={toggleAgent}
            className={isAgentActive ? "bg-accent text-accent-foreground" : ""}
          >
            {isAgentActive ? "Active" : "Activate"} <Zap className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-accent text-accent-foreground' 
                    : message.role === 'system'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.content}
                <div className="text-xs opacity-70 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2" id="chat-form">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={() => {
              const commands = ["Create new component", "Generate API", "Modify layout", "Optimize code"];
              const randomCommand = commands[Math.floor(Math.random() * commands.length)];
              setInput(`/${randomCommand.toLowerCase()}`);
              
              toast({
                title: "Command Inserted",
                description: `Command inserted: ${randomCommand}`,
              });
            }}
          >
            <Command className="h-5 w-5" />
          </Button>
          <Input
            id="message-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading || !isAgentActive}
            className="flex-1"
          />
          <Button
            id="send-message"
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !isAgentActive}
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        
        <div id="typing-indicator" className="mt-2 hidden items-center text-xs text-muted-foreground">
          <div className="flex space-x-1 mr-2">
            <span className="animate-bounce delay-100">●</span>
            <span className="animate-bounce delay-200">●</span>
            <span className="animate-bounce delay-300">●</span>
          </div>
          <span>Canvas Assistant is thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
