
// Component for canvas toolbar
import React from 'react';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, Eye, Code, Settings, Terminal, Save } from 'lucide-react';

interface CanvasToolbarProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleTerminal: () => void;
  showTerminal: boolean;
  onSaveCanvas: () => void;
  hasUnsavedChanges: boolean;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onToggleTerminal,
  showTerminal,
  onSaveCanvas,
  hasUnsavedChanges
}) => {
  return (
    <div className="bg-secondary/30 mb-4 p-2 rounded-md flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="p-1 rounded hover:bg-secondary"
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm">{zoomLevel}%</span>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="p-1 rounded hover:bg-secondary"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="p-1 rounded hover:bg-secondary">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="p-1 rounded hover:bg-secondary">
          <Code className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onToggleTerminal}
          className={`p-1 rounded hover:bg-secondary ${showTerminal ? 'text-accent' : ''}`}
        >
          <Terminal className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onSaveCanvas}
          className={`p-1 rounded hover:bg-secondary ${hasUnsavedChanges ? 'text-yellow-500 animate-pulse' : ''}`}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="p-1 rounded hover:bg-secondary">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
