import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { Star, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { loginUser } from '../services/auth.service';

function LoginPage({ setIsAuthenticated = () => {} }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNotice('');

    try {
      await loginUser({ email, password });
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'Could not sign in. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <CosmicBackground />
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <Star className="w-10 h-10 text-primary fill-primary" />
                <span className="text-3xl font-display font-bold text-foreground">Aistro</span>
              </Link>
              
              <h1 className="text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                Welcome Back to Your
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Cosmic Journey
                </span>
              </h1>
              
              <p className="text-xl text-foreground/70 mb-8">
                Sign in to access your personalized astrology insights, AI guide, and cosmic forecasts.
              </p>
              
              {/* Decorative Cosmic Circle */}
              <div className="relative w-64 h-64 mx-auto mt-12">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-8 bg-white/30 backdrop-blur-sm rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-20 h-20 text-primary fill-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-purple-100 p-8 md:p-12 shadow-2xl">
            {/* Mobile Logo */}
            <Link to="/" className="md:hidden inline-flex items-center gap-2 mb-8">
              <Star className="w-8 h-8 text-primary fill-primary" />
              <span className="text-2xl font-display font-bold text-foreground">Aistro</span>
            </Link>
            
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">Sign In</h2>
            <p className="text-foreground/70 mb-8">Continue your cosmic exploration</p>

            {error && <div className="aistro-status-error mb-6">{error}</div>}
            {notice && <div className="aistro-status-success mb-6">{notice}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground/70">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-accent transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-foreground/60">Or continue with</span>
                </div>
              </div>
              
              {/* Google Sign In */}
              <button
                type="button"
                onClick={() => setNotice('Google sign-in is not configured for this backend yet. Please use email and password.')}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-purple-200 rounded-2xl hover:bg-purple-50/50 hover:border-primary/30 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-foreground">Sign in with Google</span>
              </button>
              
              {/* Sign Up Link */}
              <p className="text-center text-foreground/70">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:text-accent font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
