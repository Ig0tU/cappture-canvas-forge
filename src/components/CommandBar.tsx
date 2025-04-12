
import React, { useState } from 'react';
import { Command, Wand2, Code2, GitPullRequestDraft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommandBar: React.FC = () => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCommand = (command: string) => {
    toast({
      title: `${command} Initiated`,
      description: `Running ${command.toLowerCase()} operation...`,
    });
  };

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        transition-all duration-300 ease-in-out rounded-lg
        ${isExpanded ? 'bg-card border border-border shadow-lg' : 'bg-secondary/30 command-bar-gradient border-none'}`}
    >
      <div className="flex items-center">
        <button
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Command className="h-5 w-5" />
        </button>
        
        {isExpanded && (
          <div className="flex items-center divide-x divide-border/40">
            <button 
              className="p-2 px-3 flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleCommand('Generate')}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Generate
            </button>
            <button 
              className="p-2 px-3 flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleCommand('Modify')}
            >
              <Code2 className="h-3.5 w-3.5" />
              Modify
            </button>
            <button 
              className="p-2 px-3 flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleCommand('Create Variation')}
            >
              <GitPullRequestDraft className="h-3.5 w-3.5" />
              Create Variation
            </button>
            <button 
              className="p-2 px-3 flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleCommand('Optimize')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Optimize
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandBar;
