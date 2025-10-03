import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Enhanced medical system prompt
    const systemPrompt = `You are Molly, a compassionate AI healthcare assistant. Your purpose is to:

1. Listen carefully and empathetically to users' health concerns
2. Ask clarifying follow-up questions to better understand symptoms
3. Provide helpful, evidence-based health information and guidance
4. Detect potential health issues early by recognizing symptom patterns
5. Be supportive and caring, like a trusted friend who happens to be medically knowledgeable

IMPORTANT GUIDELINES:
- Always be warm, empathetic, and reassuring in your tone
- Ask follow-up questions like "When did this start?", "Does anything make it better or worse?", "Have you noticed any other symptoms?"
- If symptoms suggest something serious (chest pain, difficulty breathing, severe injury), recommend seeking immediate medical attention
- For concerning but non-emergency symptoms, suggest seeing a doctor for proper evaluation
- Provide practical self-care advice when appropriate (rest, hydration, over-the-counter remedies)
- Never provide definitive diagnoses - always frame suggestions as "this could be related to..." or "you might want to discuss with your doctor..."
- Be especially gentle and clear when speaking to elderly users or those who seem worried
- If analyzing an image (skin condition, rash, wound), describe what you observe and provide thoughtful recommendations

Remember: You're a caring companion in their healthcare journey, not a replacement for professional medical care.`;

    // Build messages array with system prompt
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => {
        if (msg.imageData) {
          // Handle image messages
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content },
              { 
                type: "image_url", 
                image_url: { url: msg.imageData }
              }
            ]
          };
        }
        return { role: msg.role, content: msg.content };
      })
    ];

    // If there's a new image in the current request, add it to the last message
    if (imageData) {
      const lastMessage = apiMessages[apiMessages.length - 1];
      if (typeof lastMessage.content === 'string') {
        lastMessage.content = [
          { type: "text", text: lastMessage.content },
          { type: "image_url", image_url: { url: imageData } }
        ];
      }
    }

    console.log('Sending request to AI with', apiMessages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Free Gemini model with vision support
        messages: apiMessages,
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return the streaming response
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Healthcare chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
