import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import mollyAvatar from '@/assets/molly-avatar.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageData?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Molly, your AI healthcare companion. I'm here to listen, support, and help guide you with your health concerns. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string, imageData?: string) => {
    if (!messageText.trim() && !imageData) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText || 'Please analyze this image.',
      imageData,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setPendingImage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/healthcare-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage),
            imageData,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  // Update the last message
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Speak the response if supported
      if ('speechSynthesis' in window && assistantMessage) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Connection error",
        description: error instanceof Error ? error.message : "Could not connect to Molly. Please try again.",
        variant: "destructive",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input, pendingImage || undefined);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    sendMessage(transcript, pendingImage || undefined);
  };

  const handleImageSelect = (imageData: string) => {
    setPendingImage(imageData);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 animate-slide-up ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <img
                src={mollyAvatar}
                alt="Molly"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
            
            <Card
              className={`p-4 max-w-[80%] ${
                message.role === 'assistant'
                  ? 'bg-card shadow-soft'
                  : 'bg-primary text-primary-foreground shadow-medium'
              }`}
            >
              {message.imageData && (
                <img
                  src={message.imageData}
                  alt="Uploaded"
                  className="rounded-lg mb-2 max-w-full h-auto"
                />
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start animate-slide-up">
            <img
              src={mollyAvatar}
              alt="Molly"
              className="w-8 h-8 rounded-full"
            />
            <Card className="p-4 bg-card">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image preview */}
      {pendingImage && (
        <div className="mb-4 relative inline-block">
          <img
            src={pendingImage}
            alt="Selected"
            className="max-h-32 rounded-lg"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={() => setPendingImage(null)}
          >
            ×
          </Button>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <VoiceInput
          onTranscript={handleVoiceTranscript}
          isListening={isListening}
          setIsListening={setIsListening}
        />
        <ImageUpload onImageSelect={handleImageSelect} />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about your symptoms..."
          disabled={isLoading || isListening}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={(!input.trim() && !pendingImage) || isLoading}
          className="rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-3">
        I'm here to help, but I'm not a replacement for professional medical care.
        Always consult a doctor for medical advice.
      </p>
    </div>
  );
};
