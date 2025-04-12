
import React from 'react';
import { Card } from '@/components/ui/card';

const CodeEditor: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 flex-1 code-editor">
        <pre className="text-xs">
          <code>{`import React from 'react';
import { Button } from './ui/button';

const MyApp = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">My App</h1>
      <p className="text-muted-foreground">Count: {count}</p>
      <Button onClick={() => setCount(prev => prev + 1)}>
        Increment
      </Button>
    </div>
  );
};

export default MyApp;`}</code>
        </pre>
      </div>
    </Card>
  );
};

export default CodeEditor;
