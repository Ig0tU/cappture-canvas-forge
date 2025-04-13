
// Supabase Edge Function for AI Agent Processing
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log the received message
    console.log("Processing agent message:", message);
    
    // In a real implementation, this would connect to an AI service
    // For now, we'll simulate the response
    let response = "";
    let actions = [];
    
    // Simple response logic based on keywords
    if (message.toLowerCase().includes('create file') || message.toLowerCase().includes('new file')) {
      const fileName = `ai_generated_${Date.now()}.js`;
      actions.push({
        type: 'createFile',
        filename: fileName,
        filetype: 'js',
        content: '// AI generated file\n\nconsole.log("Hello from AI generated file!");'
      });
      response = `I've created a new file named "${fileName}" for you.`;
    } 
    else if (message.toLowerCase().includes('help')) {
      response = "I can help you with:\n- Creating new files\n- Managing your workspace\n- Answering questions about development\n- Providing code examples\n\nJust let me know what you need!";
    }
    else {
      const responses = [
        "I'm analyzing your request. Here's what I've found...",
        "That's an interesting question. After analyzing it, I believe the best approach is...",
        "I understand what you're looking for. Based on best practices, I suggest...",
        "After considering your requirements, here's my recommended solution..."
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return new Response(
      JSON.stringify({ 
        response,
        actions
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in agent-process function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
