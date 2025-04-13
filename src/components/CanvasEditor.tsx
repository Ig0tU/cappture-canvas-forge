
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MinusIcon, PlusIcon, Eye, Code, Settings, LayoutGrid, Text, Image, Boxes, Terminal, FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { STATE, initializeCanvasState, updateFileList } from '@/lib/canvasState';
import { setupEventListeners } from '@/lib/canvasEventHandlers';

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, string>;
  props?: Record<string, any>;
}

const CanvasEditor: React.FC = () => {
  const { toast } = useToast();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showTerminal, setShowTerminal] = useState(true);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [autoSave, setAutoSave] = useState(true);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Track if canvas design has unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  useEffect(() => {
    // Initialize canvas state when component mounts
    initializeCanvasState();
    setupEventListeners();
    
    // Set up the workspace area
    updateFileList();
    
    // Load saved canvas elements from local storage
    const savedCanvas = localStorage.getItem('canvasElements');
    if (savedCanvas) {
      try {
        setCanvasElements(JSON.parse(savedCanvas));
      } catch (e) {
        console.error('Failed to load saved canvas:', e);
      }
    }
    
    // Set up auto-save
    const autoSaveInterval = setInterval(() => {
      if (autoSave && hasUnsavedChanges) {
        saveCanvas();
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [autoSave, hasUnsavedChanges]);
  
  const saveCanvas = () => {
    try {
      localStorage.setItem('canvasElements', JSON.stringify(canvasElements));
      setHasUnsavedChanges(false);
      toast({
        title: "Canvas Saved",
        description: "Your canvas has been saved successfully.",
      });
    } catch (e) {
      console.error('Failed to save canvas:', e);
      toast({
        title: "Save Failed",
        description: "Failed to save your canvas. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('text/plain', elementType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    
    // Get canvas position
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoomLevel / 100);
      const y = (e.clientY - rect.top) / (zoomLevel / 100);
      
      // Create new element
      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        type: elementType,
        x,
        y,
        width: elementType === 'Button' ? 100 : elementType === 'Input' ? 200 : 150,
        height: elementType === 'Button' ? 40 : elementType === 'Input' ? 40 : 100,
        content: elementType === 'Text' ? 'Text Element' : '',
        style: getDefaultStylesForElement(elementType),
      };
      
      setCanvasElements(prev => [...prev, newElement]);
      setSelectedElement(newElement.id);
      setHasUnsavedChanges(true);
      
      toast({
        title: "Element Added",
        description: `Added ${elementType} to the canvas.`,
      });
    }
  };
  
  const getDefaultStylesForElement = (elementType: string): Record<string, string> => {
    switch (elementType) {
      case 'Button':
        return {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
        };
      case 'Input':
        return {
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          padding: '8px 12px',
        };
      case 'Card':
        return {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#ffffff',
        };
      case 'Text':
        return {
          fontFamily: 'sans-serif',
          fontSize: '14px',
          color: '#374151',
        };
      case 'Image':
        return {
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          objectFit: 'cover',
        };
      default:
        return {};
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  const handleCanvasClick = () => {
    setSelectedElement(null);
  };
  
  const handleElementDrag = (elementId: string, deltaX: number, deltaY: number) => {
    setCanvasElements(prev => prev.map(el => {
      if (el.id === elementId) {
        return {
          ...el,
          x: el.x + deltaX / (zoomLevel / 100),
          y: el.y + deltaY / (zoomLevel / 100),
        };
      }
      return el;
    }));
    
    setHasUnsavedChanges(true);
  };
  
  const handleCanvasDragStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle button or Alt+Left click
      setIsDraggingCanvas(true);
    }
  };
  
  const handleCanvasDrag = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setCanvasPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };
  
  const handleCanvasDragEnd = () => {
    setIsDraggingCanvas(false);
  };
  
  const handleDeleteElement = (elementId: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
    setHasUnsavedChanges(true);
    
    toast({
      title: "Element Deleted",
      description: "Element has been removed from the canvas.",
    });
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
  
  // Get the selected element data
  const selectedElementData = useMemo(() => {
    return canvasElements.find(el => el.id === selectedElement);
  }, [canvasElements, selectedElement]);

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
          <button 
            className={`p-1 rounded hover:bg-secondary ${hasUnsavedChanges ? 'text-yellow-500 animate-pulse' : ''}`}
            onClick={saveCanvas}
          >
            <Save className="h-4 w-4" />
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
                    { id: 'Button', label: 'Button', icon: 'rounded-md bg-blue-500 w-full py-1 text-white text-center' },
                    { id: 'Input', label: 'Input', icon: 'rounded-md border w-full py-1' },
                    { id: 'Card', label: 'Card', icon: 'rounded-md border w-full py-2' },
                    { id: 'Text', label: 'Text', icon: <Text className="h-4 w-4 mr-1" /> },
                    { id: 'Image', label: 'Image', icon: <Image className="h-4 w-4 mr-1" /> },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.label)}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-grab"
                      onClick={() => handleElementClick(item.id, { stopPropagation: () => {} } as any)}
                    >
                      {typeof item.icon === 'string' ? (
                        <div className={item.icon}>
                          {item.id === 'Button' && 'Button'}
                        </div>
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
                    { id: 'Container', label: 'Container', icon: 'rounded-md border w-full py-2' },
                    { id: 'Grid', label: 'Grid', icon: 'rounded-md border w-full grid grid-cols-2 gap-1 p-1' },
                    { id: 'Column', label: 'Column', icon: 'rounded-md border w-full flex flex-col gap-1 p-1' },
                    { id: 'Row', label: 'Row', icon: 'rounded-md border w-full flex gap-1 p-1' },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.label)}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-grab"
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
            className="flex-1 canvas-editor border border-border/40 rounded-md overflow-hidden relative bg-white/5"
            ref={canvasRef}
            style={{ 
              cursor: isDraggingCanvas ? 'grabbing' : 'default',
            }}
            onClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseDown={handleCanvasDragStart}
            onMouseMove={handleCanvasDrag}
            onMouseUp={handleCanvasDragEnd}
            onMouseLeave={handleCanvasDragEnd}
          >
            <div 
              className="w-full h-full relative"
              style={{ 
                transform: `scale(${zoomLevel/100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
                transformOrigin: 'top left',
              }}
            >
              {canvasElements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Drag and drop components here</p>
                </div>
              )}
              
              {canvasElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${selectedElement === element.id ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    ...element.style,
                  }}
                  onClick={(e) => handleElementClick(element.id, e)}
                  draggable
                  onDragStart={(e) => {
                    // Mark that we're dragging an existing element
                    e.dataTransfer.setData('application/element-id', element.id);
                  }}
                >
                  {element.type === 'Button' && (
                    <button className="w-full h-full" style={element.style}>
                      {element.content || 'Button'}
                    </button>
                  )}
                  {element.type === 'Input' && (
                    <input className="w-full h-full" style={element.style} placeholder="Input" />
                  )}
                  {element.type === 'Card' && (
                    <div className="w-full h-full" style={element.style}>
                      {element.content || 'Card Content'}
                    </div>
                  )}
                  {element.type === 'Text' && (
                    <div className="w-full h-full" style={element.style}>
                      {element.content || 'Text Content'}
                    </div>
                  )}
                  {element.type === 'Image' && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100" style={element.style}>
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  
                  {selectedElement === element.id && (
                    <div className="absolute -top-6 right-0 flex space-x-1 bg-background p-1 rounded shadow">
                      <button 
                        className="p-1 rounded hover:bg-secondary text-red-500 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(element.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
      
      {selectedElementData && (
        <div className="absolute right-4 top-20 w-64 bg-card border border-border rounded-md shadow-lg p-4">
          <h3 className="font-medium mb-2">{selectedElementData.type} Properties</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Content</label>
              <input 
                type="text" 
                className="w-full p-1 border rounded text-sm" 
                value={selectedElementData.content || ''}
                onChange={(e) => {
                  setCanvasElements(prev => prev.map(el => {
                    if (el.id === selectedElementData.id) {
                      return { ...el, content: e.target.value };
                    }
                    return el;
                  }));
                  setHasUnsavedChanges(true);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Width</label>
                <input 
                  type="number" 
                  className="w-full p-1 border rounded text-sm" 
                  value={selectedElementData.width}
                  onChange={(e) => {
                    setCanvasElements(prev => prev.map(el => {
                      if (el.id === selectedElementData.id) {
                        return { ...el, width: parseInt(e.target.value) };
                      }
                      return el;
                    }));
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Height</label>
                <input 
                  type="number" 
                  className="w-full p-1 border rounded text-sm" 
                  value={selectedElementData.height}
                  onChange={(e) => {
                    setCanvasElements(prev => prev.map(el => {
                      if (el.id === selectedElementData.id) {
                        return { ...el, height: parseInt(e.target.value) };
                      }
                      return el;
                    }));
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>
            
            {selectedElementData.type === 'Button' && (
              <div>
                <label className="text-xs text-muted-foreground">Background Color</label>
                <input 
                  type="color" 
                  className="w-full p-1 border rounded text-sm h-8" 
                  value={selectedElementData.style?.backgroundColor || '#3b82f6'}
                  onChange={(e) => {
                    setCanvasElements(prev => prev.map(el => {
                      if (el.id === selectedElementData.id) {
                        return { 
                          ...el, 
                          style: { ...el.style, backgroundColor: e.target.value } 
                        };
                      }
                      return el;
                    }));
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
