
import React from 'react';
import { Plus, Bot, Code, Sparkles, PencilRuler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const agents = [
  {
    id: 'dev',
    name: 'DevAgent',
    description: 'Specialized in code generation and application development',
    icon: <Code className="h-5 w-5" />,
    active: true
  },
  {
    id: 'ui',
    name: 'DesignAgent',
    description: 'Expert in UI/UX design and component creation',
    icon: <PencilRuler className="h-5 w-5" />,
    active: false
  },
  {
    id: 'optimizer',
    name: 'OptimizerAgent',
    description: 'Analyzes and optimizes code for performance',
    icon: <Sparkles className="h-5 w-5" />,
    active: false
  }
];

const AgentsList: React.FC = () => {
  const { toast } = useToast();

  const handleActivateAgent = (id: string) => {
    toast({
      title: "Agent Activated",
      description: `${agents.find(a => a.id === id)?.name} is now ready to assist you.`,
    });
  };

  const handleCreateAgent = () => {
    toast({
      title: "Create New Agent",
      description: "Agent creation capability coming soon!",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Agents</h2>
        <Button variant="outline" size="sm" onClick={handleCreateAgent}>
          <Plus className="h-4 w-4 mr-1" />
          New Agent
        </Button>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Card key={agent.id} className={`${agent.active ? 'border-accent/50 bg-secondary/30' : ''}`}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-secondary/80 text-primary">
                    {agent.icon}
                  </div>
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                </div>
                <div className={`h-2 w-2 rounded-full ${agent.active ? 'bg-accent' : 'bg-muted'}`} />
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              <CardDescription>{agent.description}</CardDescription>
            </CardContent>
            
            <CardFooter className="p-4 pt-2">
              <Button
                variant={agent.active ? "secondary" : "outline"} 
                size="sm" 
                className="w-full"
                onClick={() => handleActivateAgent(agent.id)}
              >
                {agent.active ? 'Active' : 'Activate'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentsList;
