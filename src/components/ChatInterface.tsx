
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Command, Zap, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { simulateAgentAction, setProcessingState } from '@/lib/agent/agentManager';

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
  const [selectedProvider, setSelectedProvider] = useState<string>('Anthropic');
  const [temperature, setTemperature] = useState<string>('0.7');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    // Listen for the Enter key in the input field
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement === inputRef.current) {
        e.preventDefault();
        handleSubmit(new Event('submit') as unknown as React.FormEvent);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [input, isAgentActive, isLoading]);

  useEffect(() => {
    // Set focus on input field when component mounts
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processUserInput = async (userInput: string): Promise<string> => {
    try {
      // Show typing indicator
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.style.display = 'flex';
      }
      
      setProcessingState(true);
      
      // Use the agent system to process the request
      let agentResponse: string;
      
      // In a real implementation, this would use Anthropic's Claude API
      // For now, we'll use our existing simulateAgentAction function
      if (selectedProvider === 'Anthropic') {
        agentResponse = await simulateAgentAction(`[Using Claude] ${userInput}`);
      } else {
        agentResponse = await simulateAgentAction(userInput);
      }
      
      // Hide typing indicator
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }
      
      setProcessingState(false);
      
      return agentResponse;
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
      const response = await processUserInput(userMessage.content);
      
      // Add agent response
      const agentMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error handling submission:", error);
    }
  };
  
  const toggleAgent = () => {
    setIsAgentActive(prev => !prev);
    toast({
      title: isAgentActive ? "Agent Deactivated" : "Agent Activated",
      description: isAgentActive ? "The agent is now deactivated" : "The agent is ready to assist you",
    });
  };

  const insertSampleCommand = () => {
    const commands = ["Create new component", "Generate API", "Modify layout", "Optimize code"];
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    setInput(`/${randomCommand.toLowerCase()}`);
    
    toast({
      title: "Command Inserted",
      description: `Command inserted: ${randomCommand}`,
    });
    
    // Focus the input after inserting command
    inputRef.current?.focus();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Canvas Assistant</h3>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 px-2">
                  <SettingsIcon className="h-4 w-4 mr-1" /> Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-4">
                  <h4 className="font-medium">Assistant Settings</h4>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Provider</label>
                    <select 
                      className="w-full p-2 border rounded-md bg-background"
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                    >
                      <option>Anthropic</option>
                      <option>OpenAI</option>
                      <option>Default</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Temperature</label>
                    <Input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                    />
                    <div className="text-xs text-right">{temperature}</div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
            onClick={insertSampleCommand}
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
            ref={inputRef}
            autoFocus
            aria-label="Chat input"
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
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="absolute bottom-4 right-4 rounded-full h-10 w-10 p-0">
            <span className="sr-only">Open AI Prompt Editor</span>
            <Command className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Advanced Prompt Editor</h2>
            <Textarea 
              placeholder="Write your advanced prompt here..." 
              className="min-h-[200px]"
            />
            <div className="flex justify-between">
              <Button variant="outline">Clear</Button>
              <Button onClick={() => toast({ title: "Prompt saved", description: "Your prompt template has been saved" })}>
                Save Template
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatInterface;
