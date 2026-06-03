import { Link } from 'react-router-dom';
import { Mail, Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { CosmicBackground } from '../components/ui/CosmicBackground';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice('Password reset email delivery is not configured yet. Please contact support or sign in with your existing password.');
  };

  return (
    <main className="relative grid min-h-screen place-items-center p-4">
      <CosmicBackground />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-purple-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-10"
      >
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <Star className="h-8 w-8 fill-primary text-primary" />
          <span className="text-2xl font-display font-bold text-foreground">Aistro</span>
        </Link>
        <p className="aistro-kicker">Account Recovery</p>
        <h1 className="aistro-title mt-2 text-3xl">Reset your password</h1>
        <p className="mt-3 text-foreground/70">
          Enter your account email. The UI is ready; email delivery needs to be connected on the backend before reset links can be sent.
        </p>

        {notice && <div className="aistro-status-success mt-6">{notice}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Email Address</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="aistro-input pl-12"
              />
            </div>
          </label>
          <Button type="submit" className="w-full" size="lg">Check Recovery Options</Button>
          <Link to="/login" className="block text-center text-sm font-semibold text-primary hover:text-accent">
            Back to sign in
          </Link>
        </form>
      </motion.section>
    </main>
  );
}

export default ForgotPassword;
