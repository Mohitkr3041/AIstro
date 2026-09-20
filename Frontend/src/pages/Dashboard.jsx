import { Calendar, ChevronRight, Heart, Moon, Sparkles, Sun as SunIcon, TrendingUp, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getBirthDetails } from '../services/birth.service';
import { generateAstroReport } from '../services/astro.service';

const todayLabel = () =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

function DashboardPage() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const birthRes = await getBirthDetails();
        const savedBirth = birthRes.data.data;

        if (!savedBirth) {
          navigate('/birth', { replace: true });
          return;
        }

        setBirthData(savedBirth);
        const reportRes = await generateAstroReport();
        setReport(reportRes.data.data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Failed to load your personalized dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const chartSummary = report?.chart_summary || {};
  const quickSummary = report?.quick_summary || {};
  const forecast = report?.forecast || {};
  const departments = report?.reading_flow?.departments || [];

  const dailyText =
    forecast.next_7_days ||
    quickSummary.next_30_days_highlight ||
    report?.reading_flow?.future_prediction?.timeline?.[0]?.prediction ||
    'Generate your report to unlock a personalized reading from your birth chart.';

  const quickPrompts = ["What's my love forecast this week?", 'Career advice for today', 'Interpret my moon sign'];

  if (loading) {
    return (
      <div className="aistro-container grid min-h-screen place-items-center py-8">
        <div className="aistro-card w-full max-w-xl space-y-4">
          <div className="aistro-skeleton h-8 w-2/3" />
          <div className="aistro-skeleton h-4 w-full" />
          <div className="aistro-skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="aistro-kicker">Dashboard</p>
        <h1 className="aistro-title mt-2 text-3xl md:text-4xl">Welcome back, {birthData?.name || 'Cosmic Soul'}</h1>
        <p className="mt-2 text-foreground/70">Here is your personalized chart overview.</p>
      </motion.header>

      {error && <div className="aistro-status-error mb-6">{error}</div>}

      <motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-8 shadow-2xl shadow-primary/30">
          <div className="relative grid items-center gap-8 md:grid-cols-2 text-white">
            <div>
              <h2 className="mb-2 text-2xl font-display font-bold">Natal Signatures</h2>
              <p className="mb-4 text-white/80">Calculated deterministically via Swiss Ephemeris</p>
              <div className="space-y-2 text-white/90 font-medium">
                <p>Ascendant: <span className="font-bold text-white">{chartSummary.ascendant?.sign || 'Unknown'}</span></p>
                <p>Sun Sign: <span className="font-bold text-white">{chartSummary.sun_sign || 'Unknown'}</span></p>
                <p>Moon Sign: <span className="font-bold text-white">{chartSummary.moon_sign || 'Unknown'}</span></p>
                <p>Nakshatra: <span className="font-bold text-white">{chartSummary.moon_nakshatra || 'Unknown'}</span></p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="font-display font-semibold text-lg text-white mb-2">Current Insight</h3>
              <p className="text-white/90 leading-relaxed text-sm">
                {quickSummary.personality || 'Unlock your full grounded astrology report to view detailed domain evidence.'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <section className="aistro-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <SunIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Astrology Insights</h3>
              <p className="text-sm text-foreground/60">{todayLabel()}</p>
            </div>
          </div>
          <p className="mb-4 leading-relaxed text-foreground/80">{dailyText}</p>
          <Link to="/report">
            <Button variant="ghost" className="w-full justify-between">
              Read Full Report
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="aistro-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Ask Your AI Guide</h3>
              <p className="text-sm text-foreground/60">Send a chart-aware question instantly.</p>
            </div>
          </div>
          <div className="mb-4 space-y-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => navigate('/chat', { state: { prompt } })}
                className="w-full rounded-xl bg-purple-50 px-4 py-2 text-left text-sm text-foreground/70 transition-all hover:bg-purple-100 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
          <Link to="/chat">
            <Button className="w-full">Start Chat</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
