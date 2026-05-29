import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Moon, Heart, Briefcase, TrendingUp, Star, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { askAstroChat, getChatHistory } from '../services/chat.service';

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! ✨ I'm your AI astrology guide. I've analyzed your birth chart and I'm here to provide personalized cosmic guidance. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState('');
  const messagesEndRef = useRef(null);
  
  const suggestionChips = [
    { icon: Heart, text: "What's my love forecast?", color: 'from-pink-500 to-rose-500' },
    { icon: Briefcase, text: "Career guidance for today", color: 'from-blue-500 to-cyan-500' },
    { icon: Moon, text: "Interpret my moon sign", color: 'from-purple-500 to-indigo-500' },
    { icon: TrendingUp, text: "Current transits affecting me", color: 'from-green-500 to-emerald-500' },
  ];
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getChatHistory();
        const history = res.data.data || [];

        if (history.length) {
          setMessages(
            history.map((message) => ({
              id: message.id,
              role: message.sender === 'user' ? 'user' : 'assistant',
              content: message.text,
              timestamp: new Date(message.createdAt),
            }))
          );
        }
      } catch {
        setChatError('Could not load previous chat history.');
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async (messageText) => {
    const text = messageText || inputValue.trim();
    if (!text) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await askAstroChat(text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setChatError('');
    } catch (error) {
      setChatError(error.response?.data?.message || 'The AI guide could not answer right now.');
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50/30 to-white">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">AI Astrology Guide</h1>
            <p className="text-foreground/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online • Personalized for your chart
            </p>
          </div>
        </div>
        {chatError && (
          <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {chatError}
          </div>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-100 to-violet-100'
                    : 'bg-gradient-to-br from-primary to-accent'
                }`}>
                  {message.role === 'user' ? (
                    <Star className="w-5 h-5 text-primary" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div>
                  <div className={`rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-white'
                      : 'bg-white/80 backdrop-blur-sm border border-purple-100 text-foreground shadow-lg'
                  }`}>
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                  <p className={`text-xs text-foreground/50 mt-1 px-1 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl px-5 py-3 shadow-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Suggestion Chips (shown when no messages yet or few messages) */}
      {messages.length <= 2 && (
        <div className="px-4 md:px-8 pb-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-foreground/60 mb-3">Suggested questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestionChips.map((chip) => (
                <button
                  key={chip.text}
                  onClick={() => handleSend(chip.text)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chip.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                    <chip.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors">{chip.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-purple-100 px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your cosmic guide anything..."
              rows={1}
              className="flex-1 resize-none px-6 py-4 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all max-h-32 min-h-[56px]"
              aria-label="Message input"
              style={{ 
                height: 'auto',
                minHeight: '56px',
              }}
              onInput={(e) => {
                const target = e.target ;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              size="lg"
              className="h-14 w-14 p-0 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-xs text-foreground/50 mt-3 text-center">
            Your AI guide uses your birth chart for personalized insights
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
