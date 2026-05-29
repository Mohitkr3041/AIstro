import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { Sparkles, Brain, Heart, TrendingUp, MessageSquare, Calendar, Star, Check, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: Sparkles,
      title: 'Birth Chart Analysis',
      description: 'Deep insights into your natal chart with AI-powered interpretations',
    },
    {
      icon: Calendar,
      title: 'Daily Cosmic Insights',
      description: 'Personalized daily horoscopes based on your unique astrological profile',
    },
    {
      icon: MessageSquare,
      title: 'AI Astrology Chat Guide',
      description: 'Ask any astrology question and get instant, accurate answers',
    },
    {
      icon: Heart,
      title: 'Compatibility Analysis',
      description: 'Discover relationship dynamics with comprehensive synastry reports',
    },
    {
      icon: TrendingUp,
      title: 'Career & Life Forecasts',
      description: 'Navigate life transitions with cosmic timing and guidance',
    },
    {
      icon: Brain,
      title: 'Transit Predictions',
      description: 'Stay ahead of planetary movements affecting your life',
    },
  ];

  const pricingPlans = [
    {
      name: 'Cosmic Explorer',
      price: 'Free',
      period: '',
      features: [
        'Basic birth chart',
        'Daily horoscope',
        'Limited AI chat',
        'Community access',
      ],
    },
    {
      name: 'Astro Guide',
      price: '$19',
      period: '/month',
      features: [
        'Full birth chart analysis',
        'Unlimited AI chat',
        'Weekly forecasts',
        'Transit alerts',
        'Compatibility reports',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Cosmic Master',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Astro Guide',
        'Advanced transit tracking',
        'Personalized rituals',
        'Monthly 1-on-1 session',
        'Early access to features',
        'Custom reports',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How accurate is AI-powered astrology?',
      answer: 'Our AI combines traditional astrological wisdom with modern data science to provide highly personalized and accurate insights based on your unique birth chart.',
    },
    {
      question: 'What do I need to get started?',
      answer: 'Just your birth date, time, and location. The more accurate your birth time, the more precise your chart and insights will be.',
    },
    {
      question: 'Can I ask the AI any astrology question?',
      answer: 'Yes! Our AI astrology guide is trained on comprehensive astrological knowledge and can answer questions about your chart, transits, compatibility, and more.',
    },
    {
      question: 'How is this different from regular horoscopes?',
      answer: 'Unlike generic sun sign horoscopes, Aistro analyzes your complete birth chart including all planets, houses, and aspects for truly personalized guidance.',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-primary fill-primary" />
              <span className="text-2xl font-display font-bold text-foreground">Aistro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground/70 hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground/70 hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-foreground/70 hover:text-primary transition-colors">Pricing</a>
              <a href="#faq" className="text-foreground/70 hover:text-primary transition-colors">FAQ</a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 leading-tight">
                Discover Your<br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Cosmic Blueprint
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-12 leading-relaxed">
                AI-powered astrology that understands you. Get personalized insights, daily guidance, 
                and deep cosmic wisdom tailored to your unique birth chart.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="min-w-[200px]">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Your Chart
                  </Button>
                </Link>
                <Link to="/report">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    View Sample Report
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Cosmic Circle Graphic */}
            <motion.div
              className="mt-20 relative max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-full border-2 border-primary/30 p-12 shadow-2xl">
                  <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-8 rounded-full border-2 border-primary/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                  
                  <div className="relative flex items-center justify-center h-full">
                    <div className="text-center">
                      <Star className="w-24 h-24 text-primary mx-auto mb-4 fill-primary/20" />
                      <p className="text-lg font-display text-foreground">Your Cosmic Journey Awaits</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gradient-to-b from-transparent to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Cosmic Intelligence at Your Fingertips
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Harness the power of AI and ancient wisdom to navigate your life's journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-primary/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Your Cosmic Journey in 3 Steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Enter Your Birth Info', description: 'Provide your birth date, time, and location for accurate chart calculation' },
              { step: '02', title: 'AI Analyzes Your Chart', description: 'Our advanced AI processes your unique planetary positions and aspects' },
              { step: '03', title: 'Receive Cosmic Guidance', description: 'Get personalized insights, forecasts, and answers to your questions' },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="text-8xl font-display font-bold text-primary/10 mb-4">{step.step}</div>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 bg-gradient-to-b from-purple-50/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Choose Your Cosmic Path
            </h2>
            <p className="text-xl text-foreground/70">
              Start free, upgrade anytime for deeper insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-2xl shadow-primary/40 scale-105'
                    : 'bg-white/80 backdrop-blur-sm border border-purple-100 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-2xl font-display font-bold mb-2 ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  <span className={plan.popular ? 'text-white/80' : 'text-foreground/60'}>{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                      <span className={plan.popular ? 'text-white/90' : 'text-foreground/70'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup">
                  <Button
                    variant={plan.popular ? 'secondary' : 'primary'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-purple-50/50 transition-colors"
                >
                  <span className="font-display font-semibold text-lg text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-purple-100 bg-gradient-to-b from-transparent to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary fill-primary" />
              <span className="text-xl font-display font-bold text-foreground">Aistro</span>
            </div>
            
            <p className="text-foreground/60 text-center">
              © 2026 Aistro. Your cosmic guide powered by AI.
            </p>
            
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-foreground/60 hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="text-foreground/60 hover:text-primary transition-colors">Terms</Link>
              <Link to="/contact" className="text-foreground/60 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
