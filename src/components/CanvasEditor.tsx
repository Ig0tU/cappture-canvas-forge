
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MinusIcon, PlusIcon, Eye, Code, Settings, LayoutGrid, Text, Image, Boxes, Terminal, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { STATE, initializeCanvasState, updateFileList } from '@/lib/canvasState';
import { setupEventListeners } from '@/lib/canvasEventHandlers';

const CanvasEditor: React.FC = () => {
  const { toast } = useToast();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showTerminal, setShowTerminal] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize canvas state when component mounts
    initializeCanvasState();
    setupEventListeners();
    
    // Set up the workspace area
    updateFileList();
  }, []);
  
  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('text/plain', elementType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    
    toast({
      title: "Element Added",
      description: `Added ${elementType} to the canvas.`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  const increaseZoom = () => {
    if (zoomLevel < 200) {
      setZoomLevel(prev => prev + 10);
    }
  };
  
  const decreaseZoom = () => {
    if (zoomLevel > 50) {
      setZoomLevel(prev => prev - 10);
    }
  };
  
  const toggleTerminal = () => {
    setShowTerminal(prev => !prev);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-secondary/30 mb-4 p-2 rounded-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 rounded hover:bg-secondary"
            onClick={decreaseZoom}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-sm">{zoomLevel}%</span>
          <button 
            className="p-1 rounded hover:bg-secondary"
            onClick={increaseZoom}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded hover:bg-secondary">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 rounded hover:bg-secondary">
            <Code className="h-4 w-4" />
          </button>
          <button 
            className={`p-1 rounded hover:bg-secondary ${showTerminal ? 'text-accent' : ''}`}
            onClick={toggleTerminal}
          >
            <Terminal className="h-4 w-4" />
          </button>
          <button className="p-1 rounded hover:bg-secondary">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4">
        <Card className="w-48 shrink-0">
          <Tabs defaultValue="components">
            <TabsList className="w-full">
              <TabsTrigger value="components" className="flex-1">
                <Boxes className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Components</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex-1">
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Layout</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1">
                <FileText className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Files</span>
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[calc(100vh-240px)]">
              <TabsContent value="components" className="m-0 py-2">
                <CardContent className="p-2 space-y-2">
                  {[
                    { id: 'button', label: 'Button', icon: 'rounded-md bg-blue-500 w-full py-1' },
                    { id: 'input', label: 'Input', icon: 'rounded-md border w-full py-1' },
                    { id: 'card', label: 'Card', icon: 'rounded-md border w-full py-2' },
                    { id: 'text', label: 'Text', icon: <Text className="h-4 w-4 mr-1" /> },
                    { id: 'image', label: 'Image', icon: <Image className="h-4 w-4 mr-1" /> },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.label)}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-grab"
                      onClick={() => handleElementClick(item.id)}
                    >
                      {typeof item.icon === 'string' ? (
                        <div className={item.icon}></div>
                      ) : (
                        item.icon
                      )}
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="layout" className="m-0 py-2">
                <CardContent className="p-2 space-y-2">
                  {[
                    { id: 'container', label: 'Container', icon: 'rounded-md border w-full py-2' },
                    { id: 'grid', label: 'Grid', icon: 'rounded-md border w-full grid grid-cols-2 gap-1 p-1' },
                    { id: 'column', label: 'Column', icon: 'rounded-md border w-full flex flex-col gap-1 p-1' },
                    { id: 'row', label: 'Row', icon: 'rounded-md border w-full flex gap-1 p-1' },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.label)}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-grab"
                      onClick={() => handleElementClick(item.id)}
                    >
                      <div className={item.icon}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="files" className="m-0 py-2">
                <CardContent className="p-2 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    id="new-file"
                  >
                    + New File
                  </Button>
                  
                  <div className="mt-4" id="file-list">
                    {STATE.workspace.files.map(file => (
                      <div 
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-secondary/50 cursor-pointer"
                        data-file-id={file.id}
                      >
                        <span className="text-sm">{file.name}</span>
                        <button className="text-xs opacity-70 hover:opacity-100">&times;</button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>
        
        <div className="flex-1 flex flex-col">
          <div 
            className="flex-1 canvas-editor border border-border/40 rounded-md"
            style={{ transform: `scale(${zoomLevel/100})`, transformOrigin: 'top left' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">Drag and drop components here</p>
            </div>
          </div>
          
          {showTerminal && (
            <div 
              ref={terminalRef}
              className="h-32 mt-4 bg-black/80 rounded-md p-2 font-mono text-xs overflow-auto"
              id="terminal-output"
            >
              <div className="text-green-400">[INFO] CapptureCanvas terminal initialized</div>
              <div className="text-yellow-400">[SYSTEM] Ready for commands</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
