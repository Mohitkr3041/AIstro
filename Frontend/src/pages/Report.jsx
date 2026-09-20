import { Sun as SunIcon, Moon, TrendingUp, Heart, Briefcase, Star, Sparkles, ChevronDown, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { generateAstroReport } from '../services/astro.service';
import { getBirthDetails } from '../services/birth.service';

function ReportPage() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [report, setReport] = useState(null);
  const [birthData, setBirthData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportError, setReportError] = useState('');

  const loadReport = async (options = {}) => {
    setIsGenerating(true);
    setReportError('');

    try {
      const [birthRes, reportRes] = await Promise.all([
        getBirthDetails(),
        generateAstroReport(options),
      ]);
      setBirthData(birthRes.data.data);
      setReport(reportRes.data.data);
    } catch (error) {
      setReportError(error.response?.data?.message || 'Could not generate your astrology report.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const chartSummary = report?.chart_summary || {};
  const quickSummary = report?.quick_summary || {};
  const readingFlow = report?.reading_flow || {};
  const personalityData = report?.personality_and_mindset || {};
  const strengthsData = report?.strengths_and_weaknesses || {};
  const loveData = report?.love_and_relationships || {};
  const careerData = report?.career_and_education || {};

  // Build planet list dynamically from calculated chart backend data
  const planetIcons = {
    sun: SunIcon,
    moon: Moon,
    mercury: Sparkles,
    venus: Heart,
    mars: TrendingUp,
    jupiter: Star,
    saturn: Briefcase,
    rahu: Sparkles,
    ketu: Sparkles,
  };

  const planetColors = {
    sun: 'from-yellow-400 to-orange-500',
    moon: 'from-blue-400 to-purple-500',
    mercury: 'from-green-400 to-teal-500',
    venus: 'from-pink-400 to-rose-500',
    mars: 'from-red-400 to-orange-500',
    jupiter: 'from-amber-400 to-yellow-600',
    saturn: 'from-indigo-400 to-blue-600',
    rahu: 'from-purple-500 to-indigo-700',
    ketu: 'from-gray-400 to-slate-600',
  };

  const planets = Object.entries(chartSummary.planets || {}).map(([key, p]) => {
    const name = p.name || key.charAt(0).toUpperCase() + key.slice(1);
    const sign = p.sign || 'Unknown';
    const house = p.house ? `${p.house}th House` : 'House unspecified';
    const degreeStr = typeof p.degree === 'number' ? `${p.degree}°` : (p.degree || '');
    const icon = planetIcons[key] || Sparkles;
    const color = planetColors[key] || 'from-primary to-accent';

    return { name, sign, house, degree: degreeStr, icon, color, key };
  });

  const strengths = strengthsData.strengths?.length
    ? strengthsData.strengths
    : ['Analytical thinking and deep observation', 'Intuitive decision making', 'Strong adaptable intellect'];

  const challenges = strengthsData.weaknesses?.length
    ? strengthsData.weaknesses
    : ['Overthinking decision options', 'Patience with slow outcomes'];

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary via-accent to-primary py-16 px-4 md:px-8">
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Your Cosmic Blueprint
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              A Complete Grounded Astrology Report
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Born: {birthData?.dob || 'Saved birth date'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{birthData?.place || 'Saved birth place'}</span>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => loadReport({ forceRefresh: true })}
                disabled={isGenerating}
              >
                {isGenerating ? 'Reading the chart...' : 'Refresh Report'}
              </Button>
            </div>
            {reportError && (
              <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold text-white">
                {reportError}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Natal Chart Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 p-8 shadow-lg">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Natal Chart Overview</h2>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <SunIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Sun Sign</h3>
                <p className="text-2xl font-display text-primary">{chartSummary.sun_sign || 'Loading'}</p>
                <p className="text-sm text-foreground/60">Your Core Identity</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Moon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Moon Sign</h3>
                <p className="text-2xl font-display text-primary">{chartSummary.moon_sign || 'Loading'}</p>
                <p className="text-sm text-foreground/60">Your Emotional Nature</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Nakshatra</h3>
                <p className="text-2xl font-display text-primary">{chartSummary.moon_nakshatra || 'Loading'}</p>
                <p className="text-sm text-foreground/60">Your Lunar Pattern</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border-l-4 border-primary">
              <p className="text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">Your essence:</span> {quickSummary.personality || 'Generate your report to reveal the strongest themes in your chart.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Planet Placements */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
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
                      {planet.sign} • {planet.house} {planet.degree ? `• ${planet.degree}` : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedSection(expandedSection === planet.name.toLowerCase() ? null : planet.name.toLowerCase())}
                    className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-colors"
                    aria-label={`Toggle ${planet.name} details`}
                  >
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedSection === planet.name.toLowerCase() ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {expandedSection === planet.name.toLowerCase() && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <p className="text-foreground/80 leading-relaxed">
                        {planet.name} in {planet.sign} ({planet.house}) — Influences core energies, focus areas, and natural tendencies in your birth chart.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Love & Relationships */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Love & Relationships</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Relationship Dynamic</h3>
                <p className="text-foreground/80 leading-relaxed">
                  {loveData.relationship_pattern || quickSummary.relationship_style || 'Astrological indicators suggest seeking balance, open communication, and mutual appreciation in partnerships.'}
                </p>
              </div>

              {loveData.partner_type && (
                <div className="bg-white/60 rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">Partner Dynamics</h3>
                  <p className="text-foreground/80 leading-relaxed">{loveData.partner_type}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Career & Life Path */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground">Career & Purpose</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-2">Professional Direction</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {quickSummary.career_direction || 'Your chart indicates potential in roles that align with your natural strengths and values.'}
                </p>
              </div>

              {careerData.best_fields?.length > 0 && (
                <div className="bg-white/60 rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3">Suitable Fields</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {careerData.best_fields.map((field) => (
                      <div key={field} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-blue-200">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-foreground/80">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Personality Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Personality Insights</h2>

          <div className="grid md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}

export default ReportPage;
