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

const emptyBirth = { name: '', dob: '', tob: '', place: '' };

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => readJson('aistro.notifications', defaultNotifications));
  const [theme, setTheme] = useState(() => localStorage.getItem('aistro.theme') || 'light');
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [birthForm, setBirthForm] = useState(emptyBirth);
  const [initialProfile, setInitialProfile] = useState(null);
  const [initialBirth, setInitialBirth] = useState(emptyBirth);
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
        const savedBirth = birth
          ? { name: birth.name || '', dob: birth.dob || '', tob: birth.tob || '', place: birth.place || '' }
          : emptyBirth;

        setInitialProfile(user);
        setProfileForm({ username: user?.username || '', email: user?.email || '' });
        setInitialBirth(savedBirth);
        setBirthForm(savedBirth);
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
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const showNotice = (message) => {
    setError('');
    setNotice(message);
  };

  const updateProfile = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
    setError('');
    setNotice('');
  };

  const updateBirth = (field, value) => {
    setBirthForm((current) => ({ ...current, [field]: value }));
    setError('');
    setNotice('');
  };

  const validateBirth = () => {
    if (birthForm.name.trim().length < 2) return 'Birth profile name must be at least 2 characters long.';
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
      const res = await updateCurrentUser({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
      });
      setInitialProfile(res.data.user);
      setProfileForm({ username: res.data.user.username, email: res.data.user.email });
      showNotice('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveBirth = async () => {
    const validation = validateBirth();
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setSavingBirth(true);
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
      showNotice('Birth chart information updated. Refresh your report to recalculate insights.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not update your birth details.');
    } finally {
      setSavingBirth(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="aistro-card w-full max-w-2xl space-y-4">
          <div className="aistro-skeleton h-8 w-1/2" />
          <div className="aistro-skeleton h-32 w-full" />
          <div className="aistro-skeleton h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="aistro-kicker">Workspace</p>
          <h1 className="aistro-title mt-2 text-3xl md:text-4xl">Settings</h1>
          <p className="mt-2 text-foreground/70">Manage your account, birth profile, and preferences.</p>
        </motion.header>

        {(notice || error) && <div className={`mb-6 ${error ? 'aistro-status-error' : 'aistro-status-success'}`}>{error || notice}</div>}

        <section className="aistro-card mb-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Profile Information</h2>
          </div>
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Username</span>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <input className="aistro-input pl-12" value={profileForm.username} onChange={(event) => updateProfile('username', event.target.value)} />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Email Address</span>
              <input type="email" className="aistro-input" value={profileForm.email} onChange={(event) => updateProfile('email', event.target.value)} />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="outline" onClick={() => setProfileForm({ username: initialProfile?.username || '', email: initialProfile?.email || '' })}>Cancel</Button>
            </div>
          </div>
        </section>

        <section className="aistro-card mb-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Birth Chart Information</h2>
          </div>
          <div className="mb-6 rounded-2xl border-l-4 border-primary bg-gradient-to-r from-purple-50 to-violet-50 p-4 text-sm text-foreground/80">
            Changing your birth information updates your saved chart foundation. Refresh the report after saving to recalculate insights.
          </div>
          <div className="space-y-6">
            {[
              { field: 'name', label: 'Birth Profile Name', type: 'text', icon: User },
              { field: 'dob', label: 'Birth Date', type: 'date', icon: Calendar },
              { field: 'tob', label: 'Birth Time', type: 'time', icon: Clock },
              { field: 'place', label: 'Birth Place', type: 'text', icon: MapPin },
            ].map((item) => {
              const FieldIcon = item.icon;

              return (
              <label className="block" key={item.field}>
                <span className="mb-2 block text-sm font-medium text-foreground">{item.label}</span>
                <div className="relative">
                  <FieldIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                  <input
                    type={item.type}
                    value={birthForm[item.field]}
                    onChange={(event) => updateBirth(item.field, event.target.value)}
                    placeholder={item.field === 'place' ? 'City, Country' : undefined}
                    className="aistro-input pl-12"
                  />
                </div>
              </label>
              );
            })}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={saveBirth} disabled={savingBirth}>{savingBirth ? 'Updating...' : 'Update Birth Chart'}</Button>
              <Button variant="ghost" onClick={() => setBirthForm(initialBirth)}>Cancel</Button>
            </div>
          </div>
        </section>

        <section className="aistro-card mb-6">
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
              <div key={key} className="flex items-center justify-between rounded-2xl bg-purple-50/50 p-4">
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
        </section>

        <section className="aistro-card mb-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Appearance</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'light', icon: Sun, label: 'Light Mode' },
              { value: 'dark', icon: Moon, label: 'Dark Mode' },
            ].map((item) => {
              const ThemeIcon = item.icon;

              return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`rounded-2xl border-2 p-6 transition-all ${theme === item.value ? 'border-primary bg-purple-50' : 'border-purple-100 bg-white hover:border-primary/30'}`}
              >
                <ThemeIcon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="font-medium text-foreground">{item.label}</p>
              </button>
              );
            })}
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-6 shadow-2xl shadow-primary/30 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Current Plan</h2>
              <p className="text-white/80">Free chart workspace</p>
            </div>
          </div>
          <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm">
            <div className="mb-2 flex justify-between gap-4"><span className="text-white/80">Saved report</span><span className="font-medium">Available after generation</span></div>
            <div className="flex justify-between gap-4"><span className="text-white/80">AI guide</span><span className="font-medium">Chart-aware chat</span></div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/report')}>Open Report</Button>
            <Button variant="outline" className="flex-1 border-white bg-transparent text-white hover:bg-white hover:text-primary" onClick={() => navigate('/chat')}>Open Chat</Button>
          </div>
        </section>

        <section className="aistro-card">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Privacy & Security</h2>
          </div>
          <div className="space-y-3">
            <button type="button" onClick={() => showNotice('Password reset is available from the forgot password screen.')} className="w-full rounded-2xl bg-purple-50/50 px-4 py-3 text-left text-foreground/80 hover:bg-purple-50">Change Password</button>
            <button type="button" onClick={() => showNotice('Two-factor authentication is not configured for this backend yet.')} className="w-full rounded-2xl bg-purple-50/50 px-4 py-3 text-left text-foreground/80 hover:bg-purple-50">Two-Factor Authentication</button>
            <button type="button" onClick={() => showNotice('Your profile and birth data are loaded through authenticated app APIs.')} className="w-full rounded-2xl bg-purple-50/50 px-4 py-3 text-left text-foreground/80 hover:bg-purple-50">Privacy Settings</button>
            <button type="button" onClick={() => showNotice('Account deletion requires a dedicated backend endpoint before it can be safely enabled.')} className="w-full rounded-2xl bg-red-50 px-4 py-3 text-left text-red-600 hover:bg-red-100">Delete Account</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
