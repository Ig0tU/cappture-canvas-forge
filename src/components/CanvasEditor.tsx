
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Image } from 'lucide-react';
import { initializeCanvasState, updateFileList, STATE } from '@/lib/canvasState';
import { setupEventListeners, setupRealtimeSubscription } from '@/lib/canvasEventHandlers';
import CanvasToolbar from './CanvasToolbar';
import ComponentPalette from './ComponentPalette';
import CanvasElementEditor from './CanvasElementEditor';

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
    
    // Setup realtime subscription
    const unsubscribe = setupRealtimeSubscription();
    
    return () => {
      clearInterval(autoSaveInterval);
      if (unsubscribe) unsubscribe();
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
  
  const handleUpdateElement = (elementId: string, changes: Partial<CanvasElement>) => {
    setCanvasElements(prev => prev.map(el => {
      if (el.id === elementId) {
        return {
          ...el,
          ...changes,
        };
      }
      return el;
    }));
    
    setHasUnsavedChanges(true);
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
  const selectedElementData = canvasElements.find(el => el.id === selectedElement) || null;

  return (
    <div className="h-full flex flex-col">
      <CanvasToolbar 
        zoomLevel={zoomLevel}
        onZoomIn={increaseZoom}
        onZoomOut={decreaseZoom}
        onToggleTerminal={toggleTerminal}
        showTerminal={showTerminal}
        onSaveCanvas={saveCanvas}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="flex flex-1 gap-4">
        <ComponentPalette onDragStart={handleDragStart} />
        
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
                  data-element-id={element.id}
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
        <CanvasElementEditor 
          element={selectedElementData}
          onUpdate={(changes) => handleUpdateElement(selectedElementData.id, changes)}
        />
      )}
    </div>
  );
};

export default CanvasEditor;
