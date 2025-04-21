
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Text, Image, Boxes, LayoutGrid, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STATE } from '@/lib/canvasState';

interface ComponentPaletteProps {
  onDragStart: (e: React.DragEvent, elementType: string) => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart }) => {
  return (
    <Card className="w-48 shrink-0 h-[calc(100vh-240px)] overflow-hidden">
      <Tabs defaultValue="components">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="components" className="text-xs">
            <Boxes className="h-4 w-4 mr-1" />
            <span>Components</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            <LayoutGrid className="h-4 w-4 mr-1" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="text-xs">
            <FileText className="h-4 w-4 mr-1" />
            <span>Files</span>
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-290px)]">
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
                  onDragStart={(e) => onDragStart(e, item.label)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-grab"
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
                  onDragStart={(e) => onDragStart(e, item.label)}
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
  );
};

export default ComponentPalette;
