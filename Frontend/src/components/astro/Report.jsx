import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, Sparkles, Heart, Briefcase, TrendingUp, Star, Compass, 
  Calendar, MapPin, ChevronDown, MessageSquare, ShieldCheck, Clock,
  CheckCircle2, AlertCircle
} from 'lucide-react';

const PLANET_COLORS = {
  Sun: 'from-amber-400 to-orange-500 text-amber-500 bg-amber-50 border-amber-200',
  Moon: 'from-blue-400 to-indigo-500 text-blue-500 bg-blue-50 border-blue-200',
  Mercury: 'from-emerald-400 to-teal-500 text-emerald-500 bg-emerald-50 border-emerald-200',
  Venus: 'from-pink-400 to-rose-500 text-pink-500 bg-pink-50 border-pink-200',
  Mars: 'from-red-400 to-rose-600 text-red-500 bg-red-50 border-red-200',
  Jupiter: 'from-yellow-400 to-amber-600 text-amber-600 bg-amber-50 border-amber-200',
  Saturn: 'from-indigo-400 to-slate-600 text-indigo-500 bg-indigo-50 border-indigo-200',
  Rahu: 'from-purple-500 to-violet-700 text-purple-500 bg-purple-50 border-purple-200',
  Ketu: 'from-slate-400 to-gray-600 text-slate-500 bg-slate-50 border-slate-200',
};

const PLANET_ICONS = {
  Sun, Moon, Mercury: Sparkles, Venus: Heart, Mars: TrendingUp,
  Jupiter: Star, Saturn: Briefcase, Rahu: Sparkles, Ketu: Compass
};

export default function Report({ report }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPlanet, setExpandedPlanet] = useState(null);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);

  // Normalize report data contract safely
  const reportData = report?.report || report || {};

  const snapshot = reportData.chartSnapshot || {};
  const planetaryHighlights = reportData.planetaryHighlights || [];
  const personality = reportData.personality || {};
  const career = reportData.career || {};
  const relationships = reportData.relationships || {};
  const predictions = reportData.predictions || [];
  const timeline = reportData.timeline || [];
  const currentDasha = reportData.currentDasha || {};
  const relevantTransits = reportData.relevantTransits || [];
  const cosmicGuidance = reportData.cosmicGuidance || {};
  const evidenceSummary = reportData.evidenceSummary || {};

  const handleAskOracle = (contextText) => {
    navigate('/chat', { state: { initialPrompt: `Can you explain more about this from my report: "${contextText}"?` } });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sun },
    { id: 'planets', label: 'Planets', icon: Sparkles },
    { id: 'personality', label: 'Personality', icon: Compass },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'love', label: 'Love', icon: Heart },
    { id: 'timing', label: 'Timing & Predictions', icon: Clock },
    { id: 'evidence', label: 'Why This Prediction?', icon: ShieldCheck },
  ];

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Mobile-first Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-purple-100 shadow-sm py-2 px-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-purple-50/70 text-slate-700 hover:bg-purple-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Chart Snapshot */}
      <section id="overview" className="scroll-mt-16">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">Section 1 • Cosmic Blueprint</span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold mt-1">Natal Chart Overview</h1>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-purple-200 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur w-fit">
              <MapPin className="w-4 h-4 text-purple-300" />
              <span>{snapshot.resolvedPlace || 'Birth Place'}</span>
              <span className="opacity-40">•</span>
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>{snapshot.timezone || 'Asia/Kolkata'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-xs text-purple-300 font-medium">Ascendant (Lagna)</p>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{snapshot.ascendant?.sign || 'Ascendant'}</p>
              <p className="text-[11px] text-purple-200 mt-0.5">{snapshot.ascendant?.degree || ''}</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-xs text-amber-300 font-medium">Sun Sign</p>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{snapshot.sunSign || 'Sun'}</p>
              <p className="text-[11px] text-amber-200 mt-0.5">Core Identity</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-xs text-blue-300 font-medium">Moon Sign</p>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{snapshot.moonSign || 'Moon'}</p>
              <p className="text-[11px] text-blue-200 mt-0.5">Emotional Nature</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-xs text-emerald-300 font-medium">Nakshatra</p>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{snapshot.nakshatra?.name || 'Nakshatra'}</p>
              <p className="text-[11px] text-emerald-200 mt-0.5">Pada {snapshot.nakshatra?.pada || 1} • Lord: {snapshot.nakshatra?.lord || ''}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-purple-300 flex-wrap gap-2">
            <span>Ayanamsha: {snapshot.ayanamsha || 'Lahiri (Chitrapaksha)'}</span>
            <span>Deterministic Swiss Ephemeris Precision</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Planetary Highlights */}
      <section id="planets" className="scroll-mt-16 space-y-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Section 2 • Planetary Highlights</h2>
          <p className="text-sm text-slate-600">Calculated position, dignity, aspects, and rule evidence for each planet</p>
        </div>

        <div className="grid gap-4">
          {planetaryHighlights.map((ph) => {
            const Icon = PLANET_ICONS[ph.planet] || Sparkles;
            const colorClass = PLANET_COLORS[ph.planet] || 'from-purple-500 to-indigo-600 text-purple-600 bg-purple-50 border-purple-200';
            const isExpanded = expandedPlanet === ph.planet;

            return (
              <div key={ph.planet} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:border-purple-300">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]} flex items-center justify-center text-white font-bold shadow-md shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{ph.planet}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {ph.sign} • {ph.house}th House
                        </span>
                        {ph.retrograde && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Retrograde (Rx)
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          {ph.dignity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{ph.interpretation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleAskOracle(`My ${ph.planet} in ${ph.sign} (${ph.house}th house)`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask Oracle</span>
                    </button>

                    <button
                      onClick={() => setExpandedPlanet(isExpanded ? null : ph.planet)}
                      className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-slate-50/80 px-5 py-4 border-t border-slate-100 text-xs space-y-3">
                    {ph.aspects?.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-700">Aspects Cast & Received:</span>
                        <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                          {ph.aspects.map((asp, idx) => (
                            <li key={idx}>{asp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {ph.evidence?.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-700">Rule Engine Evidence:</span>
                        <div className="grid gap-1.5 mt-1.5">
                          {ph.evidence.map((ev, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 text-slate-600">
                              <span>{ev.factor}</span>
                              <span className="font-bold text-purple-700">Strength: {ev.strength > 0 ? `+${ev.strength}` : ev.strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Personality & Mindset */}
      <section id="personality" className="scroll-mt-16 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100 pb-4">
          <div>
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Section 3</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">Personality & Mindset</h2>
          </div>
          <button
            onClick={() => handleAskOracle('My personality and mindset patterns')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition shadow-md shadow-indigo-200 w-fit"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Oracle About Mindset</span>
          </button>
        </div>

        <p className="text-slate-700 leading-relaxed text-sm sm:text-base bg-white/80 p-4 rounded-2xl border border-indigo-100">
          {personality.summary}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Core Astrological Strengths
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {personality.strengths?.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-3">
            <h3 className="font-bold text-amber-800 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Growth Areas & Balance Focus
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {personality.growthAreas?.map((ga, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-100/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>{ga}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: Career & Purpose */}
      <section id="career" className="scroll-mt-16 bg-gradient-to-br from-blue-50/70 to-slate-50/70 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
          <div>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Section 4</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">Career & Purpose</h2>
          </div>
          <button
            onClick={() => handleAskOracle('My career trajectory and modern paths')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition shadow-md shadow-blue-200 w-fit"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Oracle About Career</span>
          </button>
        </div>

        <p className="text-slate-700 leading-relaxed text-sm sm:text-base bg-white/80 p-4 rounded-2xl border border-blue-100">
          {career.summary}
        </p>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Favorable Career Themes</h3>
          <div className="flex flex-wrap gap-2">
            {career.themes?.map((th) => (
              <span key={th} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm">
                {th}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Recommended Modern Career Paths</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {career.careerPaths?.map((path) => (
              <div key={path} className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs font-semibold text-blue-900">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{path}</span>
              </div>
            ))}
          </div>
        </div>

        {career.timing?.length > 0 && (
          <div className="bg-blue-900 text-white rounded-2xl p-5 space-y-2 text-xs sm:text-sm">
            <span className="text-blue-300 font-bold uppercase tracking-wider text-[11px]">Dasha Context for Career</span>
            {career.timing.map((t, idx) => (
              <p key={idx} className="text-blue-100 leading-relaxed">{t}</p>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5: Love & Relationships */}
      <section id="love" className="scroll-mt-16 bg-gradient-to-br from-pink-50/70 to-rose-50/70 rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-4">
          <div>
            <span className="text-pink-600 text-xs font-bold uppercase tracking-widest">Section 5</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">Love & Relationships</h2>
          </div>
          <button
            onClick={() => handleAskOracle('My love, partnership, and relationship dynamics')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-pink-600 text-white hover:bg-pink-700 text-xs font-bold transition shadow-md shadow-pink-200 w-fit"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Oracle About Love</span>
          </button>
        </div>

        <p className="text-slate-700 leading-relaxed text-sm sm:text-base bg-white/80 p-4 rounded-2xl border border-pink-100">
          {relationships.pattern}
        </p>

        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-3">
          <h3 className="font-bold text-pink-900 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            Ideal Partner Qualities
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {relationships.partnerQualities?.map((pq, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-pink-50/50 p-2.5 rounded-xl border border-pink-100">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                <span>{pq}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 6 & 7 & 8: Timing, Predictions, Dasha & Transits */}
      <section id="timing" className="scroll-mt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-purple-600 text-xs font-bold uppercase tracking-widest">Section 6, 7 & 8</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">Timing, Dasha & Predictions</h2>
            <p className="text-sm text-slate-600">Active Vimshottari Dasha period, planet transits, and upcoming prediction timeline</p>
          </div>
          <button
            onClick={() => handleAskOracle('My current Dasha period and upcoming predictions')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold transition shadow-md shadow-purple-200 w-fit"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Oracle About Timing</span>
          </button>
        </div>

        {/* Current Dasha Card */}
        {currentDasha.mahadasha && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-purple-300 text-xs font-bold uppercase">Section 7 • Active Dasha</span>
                <h3 className="text-2xl font-bold mt-0.5">
                  {currentDasha.mahadasha} Mahadasha — {currentDasha.antardasha} Antardasha
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/30">
                Active Now
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <span className="text-purple-300 block text-[11px]">Mahadasha Period</span>
                <span className="font-bold text-white mt-1 block">
                  {currentDasha.mahadashaStart?.slice(0, 10)} to {currentDasha.mahadashaEnd?.slice(0, 10)}
                </span>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <span className="text-purple-300 block text-[11px]">Antardasha Active Window</span>
                <span className="font-bold text-white mt-1 block">
                  {currentDasha.antardashaStart?.slice(0, 10)} to {currentDasha.antardashaEnd?.slice(0, 10)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Active Transits */}
        {relevantTransits.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Key Active Transits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relevantTransits.map((tr, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-purple-900">
                    <span>{tr.planet} in {tr.sign}</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold">{tr.house}th House</span>
                  </div>
                  <p className="text-slate-600">{tr.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictions Cards */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Grounded Prediction Cards</h3>
          <div className="grid gap-4">
            {predictions.map((pred) => (
              <div key={pred.id} className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                      {pred.type}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-2">{pred.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Level: {pred.evidenceStrength || 'high'}
                    </span>
                    <button
                      onClick={() => handleAskOracle(`Prediction: ${pred.title}`)}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{pred.summary}</p>

                {pred.period && (
                  <div className="text-xs text-slate-500 font-medium">
                    Active Period: {pred.period.start} to {pred.period.end}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Timeline */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Section 8 • Prediction Timeline</h3>
            <div className="relative border-l-2 border-purple-200 ml-4 space-y-6 pl-6 py-2">
              {timeline.map((item) => (
                <div key={item.id} className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-600 border-4 border-white shadow-sm" />
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                    <span>{item.domain?.toUpperCase()}</span>
                    <span>•</span>
                    <span>{item.period?.start} to {item.period?.end}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 9: AI Cosmic Guidance */}
      <section id="guidance" className="bg-gradient-to-br from-amber-500 via-orange-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <span className="text-amber-200 text-xs font-bold uppercase tracking-widest">Section 9</span>
            <h2 className="text-2xl font-display font-bold text-white mt-0.5">AI Cosmic Guidance</h2>
          </div>
          <button
            onClick={() => handleAskOracle('Cosmic guidance and action steps')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 text-xs font-bold transition shadow-md w-fit"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Oracle</span>
          </button>
        </div>

        <p className="text-amber-50 leading-relaxed text-sm sm:text-base font-medium italic bg-black/10 p-4 rounded-2xl border border-white/10">
          "{cosmicGuidance.guidanceSummary}"
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 space-y-2">
            <h3 className="font-bold text-amber-200 text-xs uppercase tracking-wider">Priority Focus Areas</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-white">
              {cosmicGuidance.focusAreas?.map((fa, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{fa}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 space-y-2">
            <h3 className="font-bold text-amber-200 text-xs uppercase tracking-wider">Key Takeaways</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-white">
              {cosmicGuidance.keyTakeaways?.map((kt, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{kt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 10: Why This Prediction? (Evidence Breakdown) */}
      <section id="evidence" className="scroll-mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-purple-600 text-xs font-bold uppercase tracking-widest">Section 10</span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">Why This Prediction? (Evidence Audit)</h2>
            <p className="text-sm text-slate-600">Deterministic Vedic Rule Engine evaluation breakdown and confidence metrics</p>
          </div>
          <button
            onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition w-fit"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{showEvidenceDrawer ? 'Hide Technical Audit' : 'Show Technical Audit'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-semibold">Rules Evaluated</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{evidenceSummary.totalRulesEvaluated || 0}</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <p className="text-xs text-emerald-700 font-semibold">Supporting Factors</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">+{evidenceSummary.supportingCount || 0}</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
            <p className="text-xs text-amber-700 font-semibold">Contradicting Factors</p>
            <p className="text-2xl font-bold text-amber-800 mt-1">-{evidenceSummary.contradictingCount || 0}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-center">
            <p className="text-xs text-purple-700 font-semibold">Verification</p>
            <p className="text-sm font-bold text-purple-900 mt-2">100% Deterministic</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-1">
          <span className="font-bold block">Scoring & Normalization Methodology:</span>
          <p className="text-slate-700 leading-relaxed">{evidenceSummary.scoringMethodology}</p>
        </div>

        {showEvidenceDrawer && (
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
              <span>Rule ID Traceability</span>
              <span>Swiss Ephemeris + Parashari Engine</span>
            </div>
            <p className="text-slate-300 font-sans">
              All predictions in AIstro 2.0 are directly grounded in deterministic Vedic evidence compiled before any AI generation.
              Rule strengths use additive weights with per-source diminishing returns to prevent overcounting duplicated planetary facts.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
