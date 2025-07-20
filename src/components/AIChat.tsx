
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you with food recommendations, reservations, and any questions about DINE24. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentMessage,
          context: `User is browsing DINE24 restaurant website. Available pages: /menu (food menu), /about (restaurant info), /contact (contact details), /reserve-table (table booking), /todays-special (daily specials), /services (restaurant services), /admin (admin dashboard)`
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm here to help! Could you please rephrase your question?",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle navigation based on user request
      const message = currentMessage.toLowerCase();
      const response = data.response?.toLowerCase() || '';
      
      // Enhanced navigation keywords and their routes
      const navigationPatterns = [
        {
          keywords: ['menu', 'dishes', 'food', 'what can i eat', 'order food', 'cuisine'],
          route: '/menu',
          name: 'Menu',
          trigger: () => {
            setTimeout(() => {
              navigate('/menu');
              setIsOpen(false);
              toast({
                title: "Navigated to Menu",
                description: "Here's our delicious food menu!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['about', 'restaurant', 'story', 'info', 'tell me about'],
          route: '/about',
          name: 'About',
          trigger: () => {
            setTimeout(() => {
              navigate('/about');
              setIsOpen(false);
              toast({
                title: "Navigated to About",
                description: "Learn more about DINE24!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['contact', 'phone', 'address', 'location', 'reach you', 'call'],
          route: '/contact',
          name: 'Contact',
          trigger: () => {
            setTimeout(() => {
              navigate('/contact');
              setIsOpen(false);
              toast({
                title: "Navigated to Contact",
                description: "Here's how to reach us!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['reserve', 'book', 'table', 'reservation', 'booking'],
          route: '/reserve-table',
          name: 'Reservation',
          trigger: () => {
            setTimeout(() => {
              navigate('/reserve-table');
              setIsOpen(false);
              toast({
                title: "Navigated to Reservations",
                description: "Let's book your table!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['special', 'today', 'offer', 'discount', 'todays special'],
          route: '/todays-special',
          name: "Today's Special",
          trigger: () => {
            setTimeout(() => {
              navigate('/todays-special');
              setIsOpen(false);
              toast({
                title: "Navigated to Today's Special",
                description: "Check out today's amazing offers!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['service', 'services', 'delivery', 'catering', 'what do you offer'],
          route: '/services',
          name: 'Services',
          trigger: () => {
            setTimeout(() => {
              navigate('/services');
              setIsOpen(false);
              toast({
                title: "Navigated to Services",
                description: "Discover our premium services!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['admin', 'dashboard', 'management', 'login'],
          route: '/admin',
          name: 'Admin Dashboard',
          trigger: () => {
            setTimeout(() => {
              navigate('/admin');
              setIsOpen(false);
              toast({
                title: "Navigated to Admin",
                description: "Admin panel loaded!",
              });
            }, 1000);
          }
        },
        {
          keywords: ['home', 'homepage', 'main page', 'start'],
          route: '/',
          name: 'Home',
          trigger: () => {
            setTimeout(() => {
              navigate('/');
              setIsOpen(false);
              toast({
                title: "Navigated to Home",
                description: "Welcome back to DINE24!",
              });
            }, 1000);
          }
        }
      ];

      // Check for navigation triggers
      for (const pattern of navigationPatterns) {
        const messageMatch = pattern.keywords.some(keyword => 
          message.includes(keyword) || message.includes(keyword.replace(/\s+/g, ''))
        );
        const responseMatch = pattern.keywords.some(keyword => 
          response.includes(keyword) || response.includes(keyword.replace(/\s+/g, ''))
        );

        if (messageMatch || responseMatch) {
          console.log(`Navigation triggered for: ${pattern.name}`);
          pattern.trigger();
          break;
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 btn-royal shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 h-[500px] card-royal shadow-2xl flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-lg text-royal-gold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              DINE24 Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg break-words ${
                      message.isUser
                        ? 'bg-royal-gold text-black'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="p-4 border-t flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about menu, reservations, or anything..."
                  className="royal-border"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="btn-royal"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChat;
