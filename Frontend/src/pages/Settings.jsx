import { User, Calendar, MapPin, Clock, Bell, Lock, CreditCard, Sparkles, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useState } from 'react';

function SettingsPage() {
  const [notifications, setNotifications] = useState({
    dailyHoroscope: true,
    transitAlerts: true,
    weeklyForecast: false,
    fullMoon: true,
  });
  
  const [theme, setTheme] = useState('light');
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-foreground/70">Manage your account and preferences</p>
        </motion.div>
        
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 md:p-8 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Profile Information</h2>
          </div>
          
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="text"
                  defaultValue="Sarah Johnson"
                  className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="sarah@example.com"
                className="w-full px-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </motion.div>
        
        {/* Birth Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 md:p-8 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Birth Chart Information</h2>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 mb-6 border-l-4 border-primary">
            <p className="text-sm text-foreground/80">
              ⚠️ Changing your birth information will recalculate your entire chart and may affect all your reports and insights.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Birth Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="date"
                  defaultValue="1995-06-15"
                  className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            
            {/* Birth Time */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Birth Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="time"
                  defaultValue="14:30"
                  className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <p className="text-xs text-foreground/60 mt-1">More accurate time = better insights</p>
            </div>
            
            {/* Birth Place */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Birth Place</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="text"
                  defaultValue="New York, USA"
                  placeholder="City, Country"
                  className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">Update Birth Chart</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </div>
        </motion.div>
        
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 md:p-8 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries({
              dailyHoroscope: 'Daily Horoscope',
              transitAlerts: 'Important Transit Alerts',
              weeklyForecast: 'Weekly Cosmic Forecast',
              fullMoon: 'Full & New Moon Notifications',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-all">
                <span className="font-medium text-foreground">{label}</span>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    notifications[key] ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                    notifications[key] ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Theme Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 md:p-8 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Appearance</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                theme === 'light'
                  ? 'border-primary bg-purple-50'
                  : 'border-purple-100 bg-white hover:border-primary/30'
              }`}
            >
              <Sun className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="font-medium text-foreground">Light Mode</p>
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary bg-purple-50'
                  : 'border-purple-100 bg-white hover:border-primary/30'
              }`}
            >
              <Moon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="font-medium text-foreground">Dark Mode</p>
            </button>
          </div>
        </motion.div>
        
        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-primary via-accent to-primary rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/30 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Current Plan</h2>
              <p className="text-white/80">Astro Guide - $19/month</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Next billing date</span>
              <span className="text-white font-medium">June 25, 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Payment method</span>
              <span className="text-white font-medium">•••• 4242</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1">
              Upgrade Plan
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Manage Billing
            </Button>
          </div>
        </motion.div>
        
        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-6 md:p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Privacy & Security</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-all text-foreground/80 hover:text-foreground">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-all text-foreground/80 hover:text-foreground">
              Two-Factor Authentication
            </button>
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-all text-foreground/80 hover:text-foreground">
              Privacy Settings
            </button>
            <button className="w-full text-left px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 transition-all text-red-600 hover:text-red-700">
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;
