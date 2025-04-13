
// Component for editing canvas elements
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CanvasElementData {
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

interface CanvasElementEditorProps {
  element: CanvasElementData | null;
  onUpdate: (changes: Partial<CanvasElementData>) => void;
}

const CanvasElementEditor: React.FC<CanvasElementEditorProps> = ({ element, onUpdate }) => {
  const [content, setContent] = useState(element?.content || '');
  const [width, setWidth] = useState(element?.width || 0);
  const [height, setHeight] = useState(element?.height || 0);
  const [backgroundColor, setBackgroundColor] = useState(element?.style?.backgroundColor || '#ffffff');
  
  if (!element) {
    return null;
  }
  
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate({ content: newContent });
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    setWidth(newWidth);
    onUpdate({ width: newWidth });
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    setHeight(newHeight);
    onUpdate({ height: newHeight });
  };
  
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    onUpdate({ style: { ...element.style, backgroundColor: newColor } });
  };

  return (
    <Card className="p-4 absolute right-4 top-20 w-64 shadow-lg">
      <h3 className="font-medium mb-2">{element.type} Properties</h3>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-muted-foreground">Content</label>
          <Input 
            type="text" 
            className="w-full text-sm" 
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Width</label>
            <Input 
              type="number" 
              className="w-full text-sm" 
              value={width}
              onChange={handleWidthChange}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Height</label>
            <Input 
              type="number" 
              className="w-full text-sm" 
              value={height}
              onChange={handleHeightChange}
            />
          </div>
        </div>
        
        {element.type === 'Button' && (
          <div>
            <label className="text-xs text-muted-foreground">Background Color</label>
            <Input 
              type="color" 
              className="w-full h-8 text-sm" 
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default CanvasElementEditor;
