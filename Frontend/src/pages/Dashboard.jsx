import { Calendar, ChevronRight, Heart, Moon, Sparkles, Sun as SunIcon, TrendingUp, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getBirthDetails } from '../services/birth.service';
import { generateAstroReport } from '../services/astro.service';

const clamp = (value, min = 42, max = 96) => Math.min(max, Math.max(min, value));

const hashText = (text) =>
  Array.from(text || '').reduce((total, char) => total + char.charCodeAt(0), 0);

const getTodayLabel = () =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

const getDailyScore = (birthData, report) => {
  const chart = report?.chart_summary || {};
  const quick = report?.quick_summary || {};
  const seed = [
    birthData?.name,
    birthData?.dob,
    birthData?.tob,
    birthData?.place,
    chart.sun_sign,
    chart.moon_sign,
    chart.moon_nakshatra,
    quick.next_30_days_highlight,
    new Date().toISOString().slice(0, 10),
  ].join('|');

  return clamp(58 + (hashText(seed) % 39));
};

const buildLifeAreas = (report) => {
  const departments = report?.reading_flow?.departments || [];
  const fallback = [
    ['Love', report?.love_and_relationships?.relationship_pattern],
    ['Career', report?.career_and_education?.growth_periods],
    ['Health', report?.health_and_lifestyle?.lifestyle_advice?.join(' ')],
    ['Finances', report?.money_and_wealth?.wealth_growth_timeline],
    ['Creativity', report?.quick_summary?.strength],
    ['Social', report?.quick_summary?.relationship_style],
  ];
  const source = departments.length
    ? departments.map((department) => [
        department.name,
        [department.insight, department.future_signal, department.action].join(' '),
      ])
    : fallback;

  return source.slice(0, 6).map(([label, text], index) => ({
    planet: label,
    score: clamp(52 + ((hashText(`${label}-${text}`) + index * 7) % 43), 48, 95),
  }));
};

const buildEnergyData = (birthData, report) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const seed = hashText(`${birthData?.dob || ''}-${birthData?.tob || ''}-${report?.forecast?.next_7_days || ''}`);

  return days.map((day, index) => ({
    day,
    energy: clamp(50 + ((seed + index * 11) % 42), 45, 94),
  }));
};

const buildTransits = (report) => {
  const current = report?.current_transits || {};
  const forecast = report?.forecast || {};
  const flowTimeline = report?.reading_flow?.future_prediction?.timeline || [];

  return [
    {
      title: current.planetary_influence || 'Current chart focus',
      description:
        current.focus_now || forecast.next_7_days || 'Generate your report to unlock your current transit focus.',
      impact: 'positive',
      date: 'Now',
    },
    {
      title: 'Watch point',
      description: current.avoid_now || flowTimeline[0]?.watch_out || 'Your report will highlight what to avoid right now.',
      impact: 'caution',
      date: 'Today',
    },
    {
      title: flowTimeline[1]?.period || 'Next 30 days',
      description: flowTimeline[1]?.opportunity || forecast.next_30_days || 'Refresh your report for upcoming timing.',
      impact: 'positive',
      date: 'Soon',
    },
  ];
};

function DashboardPage() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const birthRes = await getBirthDetails();
        const savedBirth = birthRes.data.data;

        if (!savedBirth) {
          navigate('/birth');
          return;
        }

        setBirthData(savedBirth);
        const reportRes = await generateAstroReport();
        setReport(reportRes.data.data);
      } catch (error) {
        setDashboardError(error.response?.data?.message || 'Failed to load your dashboard.');
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const cosmicScore = getDailyScore(birthData, report);
  const yesterdayScore = clamp(cosmicScore - 5 + (hashText(`${birthData?.place}-${birthData?.dob}`) % 11));
  const scoreDelta = cosmicScore - yesterdayScore;
  const energyData = buildEnergyData(birthData, report);
  const planetaryData = buildLifeAreas(report);
  const transits = buildTransits(report);
  const quickSummary = report?.quick_summary || {};
  const forecast = report?.forecast || {};
  const dailyText =
    forecast.next_7_days ||
    quickSummary.next_30_days_highlight ||
    report?.reading_flow?.future_prediction?.timeline?.[0]?.prediction ||
    'Generate your report to unlock a personalized daily reading from your birth chart.';
  const quickStats = [
    { icon: Heart, label: 'Love', value: `${planetaryData.find((item) => item.planet === 'Love')?.score || 70}%`, color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, label: 'Career', value: `${planetaryData.find((item) => item.planet === 'Career')?.score || 70}%`, color: 'from-blue-500 to-cyan-500' },
    { icon: Zap, label: 'Energy', value: `${energyData[new Date().getDay() || 0]?.energy || cosmicScore}%`, color: 'from-yellow-500 to-orange-500' },
    { icon: Moon, label: 'Intuition', value: `${clamp(hashText(report?.chart_summary?.moon_nakshatra || birthData?.name) % 100, 55, 95)}%`, color: 'from-purple-500 to-indigo-500' },
  ];
  const chatPrompts = [
    "What's my love forecast this week?",
    'Career advice for today',
    'Interpret my moon sign',
  ];

  const askPrompt = (prompt) => {
    navigate('/chat', { state: { prompt } });
  };

  if (loadingDashboard) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <p className="text-foreground/70">Opening your cosmic dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-display font-bold text-foreground md:text-4xl">
            Welcome back, {birthData?.name || 'Cosmic Soul'}
          </h1>
          <p className="text-foreground/70">Here is your personalized overview for today</p>
        </motion.div>
      </div>

      {dashboardError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {dashboardError}
        </div>
      )}

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-8 shadow-2xl shadow-primary/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc3RhcnMpIi8+PC9zdmc+')] opacity-30" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-2 text-2xl font-display font-bold">Today's Cosmic Score</h2>
              <p className="mb-6 text-white/80">Calculated from your saved chart, report themes, and today's date</p>
              <div className="mb-4 flex items-baseline gap-4">
                <span className="text-6xl font-display font-bold">{cosmicScore}</span>
                <span className="text-2xl text-white/80">/ 100</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <TrendingUp className="h-5 w-5" />
                <span>{scoreDelta >= 0 ? '+' : ''}{scoreDelta} from yesterday</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto aspect-square max-w-[250px]">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
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
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <SunIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Daily Horoscope</h3>
              <p className="text-sm text-foreground/60">{getTodayLabel()}</p>
            </div>
          </div>
          <p className="mb-4 leading-relaxed text-foreground/80">{dailyText}</p>
          <Link to="/report">
            <Button variant="ghost" className="w-full justify-between">
              Read Full Report
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Ask Your AI Guide</h3>
              <p className="text-sm text-foreground/60">Send a chart-aware question instantly</p>
            </div>
          </div>
          <div className="mb-4 space-y-2">
            {chatPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => askPrompt(prompt)}
                className="w-full rounded-xl bg-purple-50 px-4 py-2 text-left text-sm text-foreground/70 transition-all hover:bg-purple-100 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
          <Link to="/chat">
            <Button className="w-full">Start Chat</Button>
          </Link>
        </motion.div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <h3 className="mb-6 font-display font-semibold text-foreground">Life Areas Overview</h3>
          <div className="space-y-4">
            {planetaryData.map((item) => (
              <div key={item.planet}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.planet}</span>
                  <span className="text-foreground/60">{item.score}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <h3 className="mb-6 font-display font-semibold text-foreground">Weekly Cosmic Energy</h3>
          <div className="flex h-[300px] items-end gap-3 rounded-2xl bg-purple-50/50 p-5">
            {energyData.map((item) => (
              <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-3">
                <div className="min-h-8 rounded-t-2xl bg-gradient-to-t from-primary to-accent shadow-lg shadow-primary/20" style={{ height: `${item.energy}%` }} title={`${item.day}: ${item.energy}%`} />
                <span className="text-center text-xs font-semibold text-foreground/60">{item.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8 rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground">Upcoming Cosmic Events</h3>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-4">
          {transits.map((transit) => (
            <div key={`${transit.title}-${transit.date}`} className="flex items-start gap-4 rounded-2xl bg-purple-50/50 p-4 transition-all hover:bg-purple-50">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${transit.impact === 'positive' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {transit.impact === 'positive' ? <Sparkles className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-start justify-between gap-4">
                  <h4 className="font-display font-semibold text-foreground">{transit.title}</h4>
                  <span className="text-xs font-medium text-foreground/60">{transit.date}</span>
                </div>
                <p className="text-sm text-foreground/70">{transit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="rounded-2xl border border-purple-100 bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm"
          >
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="mb-1 text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-foreground/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
