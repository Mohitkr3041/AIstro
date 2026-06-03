import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { Star, Mail, Lock, Eye, EyeOff, User, Calendar, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { registerUser, loginUser } from '../services/auth.service';
import { saveBirthDetails } from '../services/birth.service';

function SignupPage({ setIsAuthenticated = () => {} }) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (step === 1) {
      if (formData.name.trim().length < 2) {
        setError('Enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      setStep(2);
    } else {
      setIsLoading(true);

      try {
        await registerUser({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
        await loginUser({ email: formData.email, password: formData.password });
        await saveBirthDetails({
          name: formData.name,
          dob: formData.birthDate,
          tob: formData.birthTime,
          place: formData.birthPlace,
        });
        setIsAuthenticated(true);
        navigate('/dashboard');
      } catch (signupError) {
        setError(signupError.response?.data?.message || 'Could not create your account.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                Begin Your
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Cosmic Adventure
                </span>
              </h1>
              
              <p className="text-xl text-foreground/70 mb-8">
                Create your account and unlock personalized astrology insights powered by AI.
              </p>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-4 mb-12">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= 1 ? 'bg-primary text-white' : 'bg-purple-100 text-foreground/40'
                  }`}>
                    1
                  </div>
                  <span className="text-sm text-foreground/70">Account</span>
                </div>
                <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-primary' : 'bg-purple-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= 2 ? 'bg-primary text-white' : 'bg-purple-100 text-foreground/40'
                  }`}>
                    2
                  </div>
                  <span className="text-sm text-foreground/70">Birth Info</span>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-8 bg-white/30 backdrop-blur-sm rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-20 h-20 text-primary fill-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
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
            
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              {step === 1 ? 'Create Account' : 'Your Birth Chart'}
            </h2>
            <p className="text-foreground/70 mb-8">
              {step === 1 ? 'Join thousands exploring their cosmic blueprint' : 'Tell us about your cosmic origins'}
            </p>

            {error && <div className="aistro-status-error mb-6">{error}</div>}
            {notice && <div className="aistro-status-success mb-6">{notice}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                  
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
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
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
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        placeholder="Create a password"
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
                    {/* Password Strength Indicator */}
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            formData.password.length >= i * 3
                              ? formData.password.length >= 12
                                ? 'bg-green-500'
                                : formData.password.length >= 8
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-purple-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Birth Date */}
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-foreground mb-2">
                      Birth Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => updateFormData('birthDate', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Birth Time */}
                  <div>
                    <label htmlFor="birthTime" className="block text-sm font-medium text-foreground mb-2">
                      Birth Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input
                        id="birthTime"
                        type="time"
                        value={formData.birthTime}
                        onChange={(e) => updateFormData('birthTime', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-foreground/60">The more accurate, the better your insights</p>
                  </div>
                  
                  {/* Birth Place */}
                  <div>
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-foreground mb-2">
                      Birth Place
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input
                        id="birthPlace"
                        type="text"
                        value={formData.birthPlace}
                        onChange={(e) => updateFormData('birthPlace', e.target.value)}
                        placeholder="City, Country"
                        className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Submit Button */}
              <div className="flex gap-3">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    size="lg"
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : step === 1 ? 'Continue' : 'Create Account'}
                </Button>
              </div>
              
              {step === 1 && (
                <>
                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-foreground/60">Or continue with</span>
                    </div>
                  </div>
                  
                  {/* Google Sign Up */}
                  <button
                    type="button"
                    onClick={() => setNotice('Google sign-up is not configured for this backend yet. Please use email and password.')}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-purple-200 rounded-2xl hover:bg-purple-50/50 hover:border-primary/30 transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-foreground">Sign up with Google</span>
                  </button>
                </>
              )}
              
              {/* Sign In Link */}
              <p className="text-center text-foreground/70">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-accent font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;
