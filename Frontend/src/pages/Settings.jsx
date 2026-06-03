import { Bell, Calendar, Clock, CreditCard, Lock, MapPin, Moon, Sparkles, Sun, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateCurrentUser } from '../services/auth.service';
import { getBirthDetails, saveBirthDetails } from '../services/birth.service';

const defaultNotifications = {
  dailyHoroscope: true,
  transitAlerts: true,
  weeklyForecast: false,
  fullMoon: true,
};

const getStoredJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() =>
    getStoredJson('aistro.notifications', defaultNotifications)
  );
  const [theme, setTheme] = useState(() => localStorage.getItem('aistro.theme') || 'light');
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [birthForm, setBirthForm] = useState({ name: '', dob: '', tob: '', place: '' });
  const [initialProfile, setInitialProfile] = useState(null);
  const [initialBirth, setInitialBirth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBirth, setSavingBirth] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [userRes, birthRes] = await Promise.all([getCurrentUser(), getBirthDetails()]);
        const user = userRes.data.user;
        const birth = birthRes.data.data;

        setInitialProfile(user);
        setProfileForm({ username: user?.username || '', email: user?.email || '' });

        if (birth) {
          const savedBirth = {
            name: birth.name || '',
            dob: birth.dob || '',
            tob: birth.tob || '',
            place: birth.place || '',
          };
          setInitialBirth(savedBirth);
          setBirthForm(savedBirth);
        }
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Could not load your settings.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('aistro.notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('aistro.theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const updateProfileField = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
    setError('');
    setNotice('');
  };

  const updateBirthField = (field, value) => {
    setBirthForm((current) => ({ ...current, [field]: value }));
    setError('');
    setNotice('');
  };

  const validateBirthForm = () => {
    if (birthForm.name.trim().length < 2) return 'Name must be at least 2 characters long.';
    if (!birthForm.dob) return 'Please enter your birth date.';
    if (new Date(birthForm.dob) > new Date()) return 'Birth date cannot be in the future.';
    if (!birthForm.tob) return 'Please enter your birth time.';
    if (birthForm.place.trim().length < 2) return 'Place of birth must be at least 2 characters long.';
    return '';
  };

  const saveProfile = async () => {
    if (profileForm.username.trim().length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }

    try {
      setSavingProfile(true);
      setError('');
      const res = await updateCurrentUser({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
      });
      setInitialProfile(res.data.user);
      setProfileForm({ username: res.data.user.username, email: res.data.user.email });
      setNotice('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveBirth = async () => {
    const validationError = validateBirthForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSavingBirth(true);
      setError('');
      const payload = {
        name: birthForm.name.trim(),
        dob: birthForm.dob,
        tob: birthForm.tob,
        place: birthForm.place.trim(),
      };
      const res = await saveBirthDetails(payload);
      const savedBirth = {
        name: res.data.data.name || '',
        dob: res.data.data.dob || '',
        tob: res.data.data.tob || '',
        place: res.data.data.place || '',
      };
      setInitialBirth(savedBirth);
      setBirthForm(savedBirth);
      setNotice('Birth chart information updated. Refresh your report to recalculate insights.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not update your birth details.');
    } finally {
      setSavingBirth(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <p className="text-foreground/70">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-3xl font-display font-bold text-foreground md:text-4xl">Settings</h1>
          <p className="text-foreground/70">Manage your account, birth profile, and preferences</p>
        </motion.div>

        {(notice || error) && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {error || notice}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Profile Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(event) => updateProfileField('username', event.target.value)}
                  className="w-full rounded-2xl border-2 border-transparent bg-input-background py-3 pl-12 pr-4 transition-all focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(event) => updateProfileField('email', event.target.value)}
                className="w-full rounded-2xl border-2 border-transparent bg-input-background px-4 py-3 transition-all focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={saveProfile} disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setProfileForm({
                    username: initialProfile?.username || '',
                    email: initialProfile?.email || '',
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Birth Chart Information</h2>
          </div>

          <div className="mb-6 rounded-2xl border-l-4 border-primary bg-gradient-to-r from-purple-50 to-violet-50 p-4">
            <p className="text-sm text-foreground/80">
              Changing your birth information updates your saved chart foundation. Refresh the report after saving to recalculate insights.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Birth Profile Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input
                  type="text"
                  value={birthForm.name}
                  onChange={(event) => updateBirthField('name', event.target.value)}
                  className="w-full rounded-2xl border-2 border-transparent bg-input-background py-3 pl-12 pr-4 transition-all focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Birth Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input
                  type="date"
                  value={birthForm.dob}
                  onChange={(event) => updateBirthField('dob', event.target.value)}
                  className="w-full rounded-2xl border-2 border-transparent bg-input-background py-3 pl-12 pr-4 transition-all focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Birth Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input
                  type="time"
                  value={birthForm.tob}
                  onChange={(event) => updateBirthField('tob', event.target.value)}
                  className="w-full rounded-2xl border-2 border-transparent bg-input-background py-3 pl-12 pr-4 transition-all focus:border-primary focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-foreground/60">More accurate time = better insights</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Birth Place</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input
                  type="text"
                  value={birthForm.place}
                  onChange={(event) => updateBirthField('place', event.target.value)}
                  placeholder="City, Country"
                  className="w-full rounded-2xl border-2 border-transparent bg-input-background py-3 pl-12 pr-4 transition-all focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={saveBirth} disabled={savingBirth}>
                {savingBirth ? 'Updating...' : 'Update Birth Chart'}
              </Button>
              <Button variant="ghost" onClick={() => setBirthForm(initialBirth || { name: '', dob: '', tob: '', place: '' })}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6 rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Bell className="h-6 w-6 text-white" />
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
              <div key={key} className="flex items-center justify-between rounded-2xl bg-purple-50/50 p-4 transition-all hover:bg-purple-50">
                <span className="font-medium text-foreground">{label}</span>
                <button
                  type="button"
                  onClick={() => setNotifications((current) => ({ ...current, [key]: !current[key] }))}
                  className={`relative h-8 w-14 rounded-full transition-all ${notifications[key] ? 'bg-primary' : 'bg-gray-300'}`}
                  aria-label={`Toggle ${label}`}
                  aria-pressed={notifications[key]}
                >
                  <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform ${notifications[key] ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6 rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Appearance</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`rounded-2xl border-2 p-6 transition-all ${theme === 'light' ? 'border-primary bg-purple-50' : 'border-purple-100 bg-white hover:border-primary/30'}`}
            >
              <Sun className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="font-medium text-foreground">Light Mode</p>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`rounded-2xl border-2 p-6 transition-all ${theme === 'dark' ? 'border-primary bg-purple-50' : 'border-purple-100 bg-white hover:border-primary/30'}`}
            >
              <Moon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="font-medium text-foreground">Dark Mode</p>
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-6 shadow-2xl shadow-primary/30 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Current Plan</h2>
              <p className="text-white/80">Free chart workspace</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-white/80">Saved report</span>
              <span className="font-medium text-white">Available after generation</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/80">AI guide</span>
              <span className="font-medium text-white">Chart-aware chat</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/report')}>
              Open Report
            </Button>
            <Button variant="outline" className="flex-1 border-white bg-transparent text-white hover:bg-white hover:text-primary" onClick={() => navigate('/chat')}>
              Open Chat
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Privacy & Security</h2>
          </div>

          <div className="space-y-3">
            <button type="button" onClick={() => setNotice('Password changes are handled by the authentication flow and can be added next.')} className="w-full rounded-2xl bg-purple-50/50 px-4 py-3 text-left text-foreground/80 transition-all hover:bg-purple-50 hover:text-foreground">
              Change Password
            </button>
            <button type="button" onClick={() => setNotice('Two-factor authentication is not enabled for this backend yet.')} className="w-full rounded-2xl bg-purple-50/50 px-4 py-3 text-left text-foreground/80 transition-all hover:bg-purple-50 hover:text-foreground">
              Two-Factor Authentication
            </button>
            <button type="button" onClick={() => setNotice('Your account data is loaded from the authenticated user profile and birth profile APIs.')} className="w-full rounded-2xl bg-purple-50/50 px-4 py-3 text-left text-foreground/80 transition-all hover:bg-purple-50 hover:text-foreground">
              Privacy Settings
            </button>
            <button type="button" onClick={() => setNotice('Account deletion needs a dedicated backend endpoint before it can be safely enabled.')} className="w-full rounded-2xl bg-red-50 px-4 py-3 text-left text-red-600 transition-all hover:bg-red-100 hover:text-red-700">
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;
