
import React from 'react';
import { Card } from '@/components/ui/card';

const SandboxPreview: React.FC = () => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="p-2 border-b border-border flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-muted-foreground">App Preview</span>
        <span className="text-xs opacity-50">localhost:3000</span>
      </div>
      
      <div className="flex-1">
        <iframe
          title="Sandbox Preview"
          className="sandbox-preview"
          srcDoc={`
            <html>
              <head>
                <style>
                  body {
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                  }
                  button {
                    background-color: #3b82f6;
                    color: white;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    font-weight: 500;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <h1>My App</h1>
                <p id="count">Count: 0</p>
                <button id="increment">Increment</button>
                
                <script>
                  let count = 0;
                  const countEl = document.getElementById('count');
                  const button = document.getElementById('increment');
                  
                  button.addEventListener('click', () => {
                    count += 1;
                    countEl.textContent = 'Count: ' + count;
                  });
                </script>
              </body>
            </html>
          `}
        ></iframe>
      </div>
    </Card>
  );
};

export default SandboxPreview;
