import { Sparkles, TrendingUp, Heart, Zap, Moon, Sun as SunIcon, Calendar, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getBirthDetails } from '../services/birth.service';

function DashboardPage() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [loadingBirth, setLoadingBirth] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const cosmicScore = 87;
  const energyData = [
    { day: 'Mon', energy: 65 },
    { day: 'Tue', energy: 72 },
    { day: 'Wed', energy: 68 },
    { day: 'Thu', energy: 85 },
    { day: 'Fri', energy: 92 },
    { day: 'Sat', energy: 78 },
    { day: 'Sun', energy: 87 },
  ];
  
  const planetaryData = [
    { planet: 'Love', score: 85 },
    { planet: 'Career', score: 72 },
    { planet: 'Health', score: 90 },
    { planet: 'Finances', score: 68 },
    { planet: 'Creativity', score: 95 },
    { planet: 'Social', score: 78 },
  ];
  
  const transits = [
    {
      title: 'Venus in Pisces',
      description: 'Enhanced creativity and romantic energy',
      impact: 'positive',
      date: 'Today',
    },
    {
      title: 'Mercury Retrograde',
      description: 'Communication challenges ahead',
      impact: 'caution',
      date: 'May 28',
    },
    {
      title: 'Full Moon in Sagittarius',
      description: 'Perfect time for big decisions',
      impact: 'positive',
      date: 'May 30',
    },
  ];

  useEffect(() => {
    const loadBirth = async () => {
      try {
        const res = await getBirthDetails();

        if (!res.data.data) {
          navigate('/birth');
          return;
        }

        setBirthData(res.data.data);
      } catch (error) {
        setDashboardError(error.response?.data?.message || 'Failed to load your birth profile.');
      } finally {
        setLoadingBirth(false);
      }
    };

    loadBirth();
  }, [navigate]);

  if (loadingBirth) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <p className="text-foreground/70">Opening your cosmic dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Welcome back, {birthData?.name || 'Cosmic Soul'}
          </h1>
          <p className="text-foreground/70">Here's your cosmic overview for today</p>
        </motion.div>
      </div>

      {dashboardError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {dashboardError}
        </div>
      )}
      
      {/* Cosmic Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative bg-gradient-to-br from-primary via-accent to-primary p-8 rounded-3xl shadow-2xl shadow-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc3RhcnMpIi8+PC9zdmc+')] opacity-30" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-2xl font-display font-bold mb-2">Today's Cosmic Score</h2>
              <p className="text-white/80 mb-6">Your overall energy alignment with the universe</p>
              
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-6xl font-display font-bold">{cosmicScore}</span>
                <span className="text-2xl text-white/80">/ 100</span>
              </div>
              
              <div className="flex items-center gap-2 text-white/90">
                <TrendingUp className="w-5 h-5" />
                <span>+12 from yesterday</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square max-w-[250px] mx-auto relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="white"
                    strokeWidth="12"
                    strokeDasharray={`${(cosmicScore / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Daily Insights & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Daily Horoscope */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <SunIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Daily Horoscope</h3>
              <p className="text-sm text-foreground/60">Monday, May 25, 2026</p>
            </div>
          </div>
          
          <p className="text-foreground/80 mb-4 leading-relaxed">
            The stars align beautifully for you today. Venus in your sign brings charm and magnetism, 
            making it an excellent day for social connections and creative pursuits. Trust your intuition.
          </p>
          
          <Link to="/report">
            <Button variant="ghost" className="w-full justify-between">
              Read Full Report
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
        
        {/* AI Chat Quick Access */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Ask Your AI Guide</h3>
              <p className="text-sm text-foreground/60">Get instant cosmic wisdom</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={() => navigate('/chat')}
              className="w-full text-left px-4 py-2 rounded-xl bg-purple-50 text-foreground/70 hover:bg-purple-100 hover:text-foreground transition-all text-sm"
            >
              💜 What's my love forecast this week?
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="w-full text-left px-4 py-2 rounded-xl bg-purple-50 text-foreground/70 hover:bg-purple-100 hover:text-foreground transition-all text-sm"
            >
              💼 Career advice for today
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="w-full text-left px-4 py-2 rounded-xl bg-purple-50 text-foreground/70 hover:bg-purple-100 hover:text-foreground transition-all text-sm"
            >
              🌙 Interpret my moon sign
            </button>
          </div>
          
          <Link to="/chat">
            <Button className="w-full">
              Start Chat
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Planetary Overview & Energy Chart */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          key="radar-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 shadow-lg"
        >
          <h3 className="font-display font-semibold text-foreground mb-6">Life Areas Overview</h3>

          <div className="space-y-4">
            {planetaryData.map((item) => (
              <div key={item.planet}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.planet}</span>
                  <span className="text-foreground/60">{item.score}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          key="line-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 shadow-lg"
        >
          <h3 className="font-display font-semibold text-foreground mb-6">Weekly Cosmic Energy</h3>

          <div className="flex h-[300px] items-end gap-3 rounded-2xl bg-purple-50/50 p-5">
            {energyData.map((item) => (
              <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-3">
                <div
                  className="min-h-8 rounded-t-2xl bg-gradient-to-t from-primary to-accent shadow-lg shadow-primary/20"
                  style={{ height: `${item.energy}%` }}
                  title={`${item.day}: ${item.energy}%`}
                />
                <span className="text-center text-xs font-semibold text-foreground/60">{item.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Upcoming Transits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 shadow-lg mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-foreground">Upcoming Cosmic Events</h3>
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        
        <div className="space-y-4">
          {transits.map((transit) => (
            <div key={transit.title} className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                transit.impact === 'positive'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {transit.impact === 'positive' ? <Sparkles className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-display font-semibold text-foreground">{transit.title}</h4>
                  <span className="text-xs text-foreground/60 font-medium">{transit.date}</span>
                </div>
                <p className="text-sm text-foreground/70">{transit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Heart, label: 'Love', value: '85%', color: 'from-pink-500 to-rose-500' },
          { icon: TrendingUp, label: 'Career', value: '72%', color: 'from-blue-500 to-cyan-500' },
          { icon: Zap, label: 'Energy', value: '90%', color: 'from-yellow-500 to-orange-500' },
          { icon: Moon, label: 'Intuition', value: '95%', color: 'from-purple-500 to-indigo-500' },
        ].map((stat, index) => (
          <motion.div
            key={`stat-${stat.label}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-4 shadow-lg text-center"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-foreground/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
