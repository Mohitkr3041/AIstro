import { Sun as SunIcon, Moon, TrendingUp, Heart, Briefcase, Star, Sparkles, ChevronDown, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

function Report({ report }) {
  const [expandedSection, setExpandedSection] = useState('sun');
  
  // Use dynamic data if available, otherwise fallback to static placeholder
  const summary = report?.chart_summary || {};
  
  const planets = [
    { name: 'Sun', sign: summary.sun_sign || 'Gemini', house: '10th House', degree: '15°', icon: SunIcon, color: 'from-yellow-400 to-orange-500' },
    { name: 'Moon', sign: summary.moon_sign || 'Pisces', house: '7th House', degree: '22°', icon: Moon, color: 'from-blue-400 to-purple-500' },
    { name: 'Mercury', sign: 'Gemini', house: '10th House', degree: '18°', icon: Sparkles, color: 'from-green-400 to-teal-500' },
    { name: 'Venus', sign: 'Taurus', house: '9th House', degree: '8°', icon: Heart, color: 'from-pink-400 to-rose-500' },
    { name: 'Mars', sign: 'Leo', house: '12th House', degree: '25°', icon: TrendingUp, color: 'from-red-400 to-orange-500' },
  ];
  
  const strengths = [
    'Natural communicator with gift for words',
    'Highly adaptable and quick learner',
    'Creative problem solver',
    'Empathetic and intuitive',
    'Strong leadership potential',
  ];
  
  const challenges = [
    'Tendency to overthink decisions',
    'Can be emotionally sensitive',
    'Sometimes scattered focus',
    'Difficulty saying no to others',
  ];
  
  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary via-accent to-primary py-16 px-4 md:px-8 rounded-3xl overflow-hidden mb-12 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc3RhcnMpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Your Cosmic Blueprint
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              A Complete Astrology Report
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Generated Today</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="w-full">
        {/* Natal Chart Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-8 shadow-lg">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Natal Chart Overview</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <SunIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Sun Sign</h3>
                <p className="text-2xl font-display text-primary">{summary.sun_sign || 'Gemini'}</p>
                <p className="text-sm text-foreground/60">Your Core Identity</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Moon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Moon Sign</h3>
                <p className="text-2xl font-display text-primary">{summary.moon_sign || 'Pisces'}</p>
                <p className="text-sm text-foreground/60">Your Emotional Nature</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Rising Sign</h3>
                <p className="text-2xl font-display text-primary">Leo</p>
                <p className="text-sm text-foreground/60">Your Outer Persona</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border-l-4 border-primary">
              <p className="text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">Your essence:</span> You are a naturally curious and communicative soul ({summary.sun_sign || 'Gemini'} Sun) 
                with deep emotional wisdom and intuition ({summary.moon_sign || 'Pisces'} Moon), presenting yourself to the world with confidence and warmth (Leo Rising). 
                This unique combination makes you both intellectually brilliant and emotionally profound.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Planet Placements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Planetary Placements</h2>
          
          <div className="space-y-4">
            {planets.map((planet) => (
              <div key={planet.name} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 overflow-hidden shadow-lg">
                <div className="flex items-center gap-4 p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${planet.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <planet.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg text-foreground">{planet.name}</h3>
                    <p className="text-foreground/70">
                      {planet.sign} • {planet.house} • {planet.degree}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setExpandedSection(expandedSection === planet.name.toLowerCase() ? null : planet.name.toLowerCase())}
                    className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-colors"
                    aria-label={expandedSection === planet.name.toLowerCase() ? `Collapse ${planet.name} details` : `Expand ${planet.name} details`}
                    aria-expanded={expandedSection === planet.name.toLowerCase()}
                  >
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform ${
                      expandedSection === planet.name.toLowerCase() ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
                
                {expandedSection === planet.name.toLowerCase() && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <p className="text-foreground/80 leading-relaxed">
                        {planet.name === 'Sun' && `Your ${planet.sign} Sun makes you naturally curious, adaptable, and intellectually driven. You thrive on communication and learning, constantly seeking new information and experiences. Your mind is quick and versatile, making you excellent at multitasking and seeing multiple perspectives.`}
                        {planet.name === 'Moon' && `With your Moon in ${planet.sign}, you possess deep emotional sensitivity and powerful intuition. You're naturally empathetic and can easily tune into others' feelings. Your imagination is vivid, and you may find solace in creative or spiritual pursuits.`}
                        {planet.name === 'Mercury' && `Mercury in ${planet.sign} gives you exceptional communication skills and mental agility. You're a natural wordsmith who can articulate ideas clearly and persuasively. Your mind works quickly, and you excel at connecting different concepts and ideas.`}
                        {planet.name === 'Venus' && `Venus in ${planet.sign} brings a deep appreciation for beauty, comfort, and stability in relationships. You value loyalty and prefer quality over quantity in love. Material security and sensory pleasures are important to you.`}
                        {planet.name === 'Mars' && `Mars in ${planet.sign} gives you bold, creative energy and natural leadership abilities. You pursue your goals with confidence and passion. You're motivated by recognition and enjoy being in the spotlight for your achievements.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Love & Relationships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Love & Relationships</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Romantic Nature</h3>
                <p className="text-foreground/80 leading-relaxed">
                  In love, you seek deep emotional and intellectual connection. Your {summary.sun_sign || 'Gemini'} Sun craves stimulating conversation 
                  and variety, while your {summary.moon_sign || 'Pisces'} Moon desires profound emotional intimacy and spiritual bonding. You're romantic, 
                  imaginative, and value partners who can engage both your mind and heart.
                </p>
              </div>
              
              <div className="bg-white/60 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Best Matches</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {['Libra', 'Aquarius', 'Cancer'].map((sign) => (
                    <div key={sign} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-pink-200">
                      <Star className="w-5 h-5 text-pink-500 fill-pink-500" />
                      <span className="font-medium text-foreground">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Relationship Advice</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Balance your need for independence with emotional intimacy. Communicate your feelings clearly, even when they're 
                  complex. Your ideal partner appreciates your depth, values honest dialogue, and gives you space to explore your interests.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Career & Life Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Career & Purpose</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Professional Strengths</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  With your Sun in the 10th House, career and public recognition are central to your life purpose. You're destined 
                  for roles that involve communication, creativity, and helping others. Your versatile {summary.sun_sign || 'Gemini'} energy combined with 
                  compassion makes you excellent in fields where you can use both intellect and empathy.
                </p>
              </div>
              
              <div className="bg-white/60 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Ideal Career Paths</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Writer/Author',
                    'Counselor/Therapist',
                    'Teacher/Educator',
                    'Marketing/PR',
                    'Creative Director',
                    'Psychology/Research',
                  ].map((career) => (
                    <div key={career} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-blue-200">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-foreground/80">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Strengths & Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Personality Insights</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-200 p-6 shadow-lg">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Your Strengths
              </h3>
              <ul className="space-y-3">
                {strengths.map((strength) => (
                  <li key={strength} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-foreground/80">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Challenges */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl border border-amber-200 p-6 shadow-lg">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-600" />
                Growth Areas
              </h3>
              <ul className="space-y-3">
                {challenges.map((challenge) => (
                  <li key={challenge} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-foreground/80">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        
        {/* AI-Generated Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border-2 border-primary/20 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">AI Cosmic Guidance</h2>
                <p className="text-foreground/70">Personalized insights from your AI astrology guide</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <blockquote className="border-l-4 border-primary pl-6 py-2">
                <p className="text-foreground/90 leading-relaxed italic mb-2">
                  "Your chart reveals a beautiful balance between mental brilliance and emotional depth. This is your superpower—
                  you can think with your heart and feel with your mind. Embrace this duality rather than seeing it as contradiction."
                </p>
              </blockquote>
              
              <blockquote className="border-l-4 border-accent pl-6 py-2">
                <p className="text-foreground/90 leading-relaxed italic mb-2">
                  "The coming months bring powerful transits to your career sector. Jupiter's influence suggests expansion 
                  and recognition. Trust your intuition when opportunities arise—your {summary.moon_sign || 'Pisces'} Moon knows the way."
                </p>
              </blockquote>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Report;
