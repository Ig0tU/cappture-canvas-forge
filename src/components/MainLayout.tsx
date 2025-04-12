
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ChatInterface from './ChatInterface';
import CanvasEditor from './CanvasEditor';
import CodeEditor from './CodeEditor';
import SandboxPreview from './SandboxPreview';
import CommandBar from './CommandBar';
import AgentsList from './AgentsList';
import CappLibrary from './CappLibrary';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center animate-glow">
            <span className="text-accent font-bold">C</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">CapptureCanvas</h1>
            <p className="text-xs text-muted-foreground">AI-Powered App Development Platform</p>
          </div>
        </div>
        <CommandBar />
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast({
              title: "Coming Soon",
              description: "This feature is in development.",
            })}
            className="px-3 py-1 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Share
          </button>
          <button 
            onClick={() => toast({
              title: "Cappture Saved!",
              description: "Current state has been saved to your library.",
            })}
            className="px-3 py-1 text-sm rounded-md bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
          >
            Cappture
          </button>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="flex flex-1 divide-x divide-border/40">
          <div className="w-2/5 min-w-[300px] max-w-md border-r border-border/40">
            <div className="h-full flex flex-col">
              <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
                <div className="px-4 pt-4 border-b border-border/40">
                  <TabsList className="w-full">
                    <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                    <TabsTrigger value="agents" className="flex-1">Agents</TabsTrigger>
                    <TabsTrigger value="library" className="flex-1">Library</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="chat" className="flex-1 p-0 overflow-hidden data-[state=active]:flex flex-col">
                  <ChatInterface />
                </TabsContent>
                <TabsContent value="agents" className="flex-1 p-4 overflow-y-auto">
                  <AgentsList />
                </TabsContent>
                <TabsContent value="library" className="flex-1 p-4 overflow-y-auto">
                  <CappLibrary />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="flex-1">
            <div className="h-full flex flex-col">
              <Tabs defaultValue="canvas" className="w-full h-full flex flex-col">
                <div className="px-4 pt-4 border-b border-border/40">
                  <TabsList className="w-full">
                    <TabsTrigger value="canvas" className="flex-1">Canvas</TabsTrigger>
                    <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="canvas" className="flex-1 p-4 data-[state=active]:flex flex-col">
                  <CanvasEditor />
                </TabsContent>
                <TabsContent value="code" className="flex-1 p-4 overflow-hidden">
                  <CodeEditor />
                </TabsContent>
                <TabsContent value="preview" className="flex-1 p-4">
                  <SandboxPreview />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
