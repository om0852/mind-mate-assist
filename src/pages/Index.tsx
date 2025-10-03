import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Image, Mic, Shield, Clock } from 'lucide-react';
import { ChatInterface } from '@/components/ChatInterface';
import heroImage from '@/assets/hero-healthcare.jpg';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto p-4 h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Molly Healthcare
                </h1>
                <p className="text-xs text-muted-foreground">Your AI Health Companion</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setShowChat(false)}>
              Back to Home
            </Button>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-pulse-glow" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  AI-Powered Healthcare Companion
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Meet Molly, your compassionate AI healthcare assistant. Get personalized 
                health guidance, symptom analysis, and caring support—anytime, anywhere. 
                Talk, type, or show—Molly understands it all.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowChat(true)}
                  className="rounded-full text-lg px-8 shadow-strong hover:shadow-glow transition-all"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Conversation
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full text-lg px-8"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Safe & Private
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    24/7 Available
                  </span>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                alt="Healthcare Professional"
                className="relative rounded-3xl shadow-strong w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">
            How Molly{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Helps You
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI technology combined with empathetic care
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-medium transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Conversation</h3>
            <p className="text-muted-foreground">
              Chat naturally with Molly using text or voice. She asks thoughtful 
              follow-up questions to understand your concerns better.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-medium transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Image className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Analysis</h3>
            <p className="text-muted-foreground">
              Upload images of rashes, wounds, or medical reports. Molly provides 
              intelligent analysis and recommendations.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-medium transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Interaction</h3>
            <p className="text-muted-foreground">
              Hands-free communication perfect for when you're not feeling well. 
              Molly speaks back with a warm, caring voice.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
          <div className="relative p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Experience Compassionate Care?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Start your conversation with Molly today. She's here to listen, 
              support, and guide you on your health journey.
            </p>
            <Button
              size="lg"
              onClick={() => setShowChat(true)}
              className="bg-white text-primary hover:bg-white/90 rounded-full text-lg px-8 shadow-strong"
            >
              <Heart className="mr-2 h-5 w-5" />
              Talk to Molly Now
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Disclaimer:</strong> Molly is an AI assistant designed to provide 
            health information and guidance. She is not a replacement for professional 
            medical advice, diagnosis, or treatment.
          </p>
          <p>Always seek the advice of your physician or other qualified health provider.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
