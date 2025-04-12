
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Copy, Star, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const capptureItems = [
  {
    id: '1',
    title: 'Task Manager App',
    description: 'Simple task management application with CRUD operations',
    timestamp: '2 hours ago',
    starred: true,
  },
  {
    id: '2',
    title: 'Blog Template',
    description: 'Responsive blog layout with article preview cards',
    timestamp: 'Yesterday',
    starred: false,
  },
  {
    id: '3',
    title: 'Authentication Flow',
    description: 'Complete login/registration flow with validation',
    timestamp: 'Last week',
    starred: true,
  }
];

const CappLibrary: React.FC = () => {
  const { toast } = useToast();

  const handleLoadCappture = (id: string) => {
    const item = capptureItems.find(item => item.id === id);
    toast({
      title: "Loading Cappture",
      description: `Loading "${item?.title}" into your workspace.`,
    });
  };

  const handleStarCappture = (id: string) => {
    toast({
      title: "Cappture Starred",
      description: "This Cappture has been added to your favorites.",
    });
  };

  const handleShareCappture = (id: string) => {
    toast({
      title: "Share Cappture",
      description: "Share functionality will be available soon.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Capptured States</h2>
        <Button variant="outline" size="sm" onClick={() => toast({ title: "Library Options", description: "Filter and sort options coming soon." })}>
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {capptureItems.map((item) => (
          <Card key={item.id} className="cappture-card">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStarCappture(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Star className={`h-4 w-4 ${item.starred ? 'fill-accent text-accent' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {item.timestamp}
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            
            <CardFooter className="p-4 pt-2 flex justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLoadCappture(item.id)}
                className="flex-1 mr-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Load
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShareCappture(item.id)}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CappLibrary;
