import { useMemo, useState } from "react";
import Card from "./Card";

const list = (items = []) => (
  <ul className="space-y-2">
    {items.filter(Boolean).map((item, index) => (
      <li key={index} className="rounded-md border border-white/10 bg-black/15 px-3 py-2">
        {item}
      </li>
    ))}
  </ul>
);

const field = (label, value) => (
  <p>
    <span className="font-semibold text-white">{label}:</span> {value || "Not available"}
  </p>
);

const buildFallbackJourney = (report) => [
  {
    title: "The part of you people rarely understand",
    category: "Hidden self",
    hook: report.personality_and_mindset?.emotional_pattern || report.quick_summary?.personality,
    insights: [
      report.personality_and_mindset?.nature,
      report.personality_and_mindset?.communication_style,
      report.personality_and_mindset?.stress_handling,
    ],
    action: report.quick_summary?.strength,
  },
  {
    title: "Past patterns your chart remembers",
    category: "Past validation",
    hook: "These patterns may explain why some life areas felt delayed, intense, or confusing earlier.",
    insights: [
      report.career_and_education?.growth_periods,
      report.love_and_relationships?.relationship_pattern,
      report.money_and_wealth?.spending_pattern,
      report.strengths_and_weaknesses?.weaknesses?.[0],
    ],
    action: "Notice the repeating pattern before making the next big decision.",
  },
  {
    title: "Where your life is asking for clarity now",
    category: "Current phase",
    hook: report.current_transits?.focus_now || report.quick_summary?.next_30_days_highlight,
    insights: [
      report.current_transits?.planetary_influence,
      report.current_transits?.focus_now,
      report.current_transits?.avoid_now,
    ],
    action: report.remedies?.mindset_remedy,
  },
  {
    title: "What is opening next",
    category: "Future timeline",
    hook: report.forecast?.next_30_days || report.quick_summary?.next_30_days_highlight,
    insights: [
      report.forecast?.next_7_days,
      report.forecast?.next_30_days,
      report.forecast?.next_6_months,
      report.money_and_wealth?.wealth_growth_timeline,
    ],
    action: report.final_guidance?.[0],
  },
  {
    title: "Your personal guidance",
    category: "Action plan",
    hook: "This is the practical direction your chart points toward.",
    insights: report.final_guidance || [],
    action: report.remedies?.mindset_remedy,
  },
];

const buildFallbackChecks = (report) => [
  {
    label: "Past pattern",
    statement: report.career_and_education?.growth_periods || "Your chart suggests earlier confusion around direction may have shaped your confidence.",
    why_it_matters: "This creates trust before the future reading begins.",
  },
  {
    label: "Inner pattern",
    statement: report.personality_and_mindset?.emotional_pattern || "You may process more privately than people around you realize.",
    why_it_matters: "This shows the reading is not only describing surface personality.",
  },
  {
    label: "Current phase",
    statement: report.current_transits?.focus_now || report.quick_summary?.next_30_days_highlight,
    why_it_matters: "This connects the report to what the user is living through right now.",
  },
];

const getTheme = (index) => {
  const themes = [
    "border-teal-200/45 bg-teal-300/10 text-teal-50",
    "border-amber-200/45 bg-amber-300/10 text-amber-50",
    "border-rose-200/45 bg-rose-300/10 text-rose-50",
    "border-sky-200/45 bg-sky-300/10 text-sky-50",
    "border-lime-200/45 bg-lime-300/10 text-lime-50",
  ];

  return themes[index % themes.length];
};

function ReadingSession({ report }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [futureUnlocked, setFutureUnlocked] = useState(false);
  const [resonance, setResonance] = useState("");

  const journey = report.engagement_journey || {};
  const quick = report.quick_summary || {};
  const sections = journey.reveal_sections?.length
    ? journey.reveal_sections
    : buildFallbackJourney(report);
  const checks = journey.accuracy_checks?.length
    ? journey.accuracy_checks
    : buildFallbackChecks(report);
  const activeSection = sections[selectedIndex] || sections[0] || {};
  const isFutureSection = /future|opening|next/i.test(activeSection.category || activeSection.title || "");
  const progress = sections.length ? ((selectedIndex + 1) / sections.length) * 100 : 0;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-white/12 bg-[#0b1618]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">Start here</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Test this reading against your real life.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              {journey.opening_hook || quick.personality || "Your chart begins with recognition, then moves into hidden patterns and future timing."}
            </p>

            <div className="mt-5 rounded-lg border border-amber-200/35 bg-amber-300/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-100">Spotlight insight</p>
              <p className="mt-2 text-xl font-semibold leading-8 text-white">
                {journey.spotlight_insight || journey.trust_statement || quick.strength || "Your chart suggests your real growth begins when pressure turns into direction."}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {["Feels accurate", "Partly true", "Show me more"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setResonance(label)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    resonance === label
                      ? "border-teal-300 bg-teal-300 text-black"
                      : "border-white/15 bg-white/[0.06] text-white/75 hover:border-white/35 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {resonance && (
              <p className="mt-3 text-sm leading-6 text-teal-100">
                Good. Now move through the chapters in order: recognition first, future second.
              </p>
            )}
          </div>

          <div className="grid gap-3 p-5 sm:p-6">
            {checks.slice(0, 3).map((check, index) => (
              <button
                key={`${check.label}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(Math.min(index + 1, sections.length - 1))}
                className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${getTheme(index)}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{check.label}</p>
                <p className="mt-2 text-base font-semibold leading-7 text-white">{check.statement}</p>
                <p className="mt-2 text-sm leading-6 opacity-75">{check.why_it_matters}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-white/12 bg-white/[0.05] p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/50">
              <span>Reading progress</span>
              <span>{selectedIndex + 1}/{sections.length}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-teal-300 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={`${section.title}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                  selectedIndex === index
                    ? "border-teal-300 bg-teal-300 text-black"
                    : "border-white/10 bg-black/20 text-white/72 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-wide opacity-70">
                  Chapter {index + 1}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-5">{section.category}</span>
              </button>
            ))}
          </div>
        </div>

        <article className="rounded-lg border border-white/12 bg-white/[0.07] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">
            {activeSection.category || "Reading"}
          </p>
          <h3 className="mt-2 text-2xl font-bold leading-tight text-white">{activeSection.title}</h3>
          <p className="mt-3 text-base leading-7 text-white/68">
            {activeSection.hook || "This chapter reveals one part of your chart."}
          </p>

          {isFutureSection && !futureUnlocked ? (
            <div className="mt-5 rounded-lg border border-sky-200/35 bg-sky-300/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-100">Future reading locked</p>
              <p className="mt-2 text-base leading-7 text-white/78">
                The future section works best after you compare the past and current patterns with your life.
              </p>
              <button
                type="button"
                onClick={() => setFutureUnlocked(true)}
                className="mt-4 rounded-lg bg-sky-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-sky-200"
              >
                Unlock my future timeline
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {(activeSection.insights || []).filter(Boolean).map((insight, index) => (
                <div key={index} className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-[36px_1fr]">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/78">{insight}</p>
                </div>
              ))}
            </div>
          )}

          {(!isFutureSection || futureUnlocked) && activeSection.action && (
            <div className="mt-5 rounded-lg border border-amber-200/30 bg-amber-300/10 px-4 py-4 text-sm leading-7 text-amber-50">
              <span className="font-semibold text-white">What to do with this: </span>
              {activeSection.action}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setSelectedIndex(Math.max(selectedIndex - 1, 0))}
              disabled={selectedIndex === 0}
              className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white disabled:opacity-40"
            >
              Previous chapter
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex(Math.min(selectedIndex + 1, sections.length - 1))}
              disabled={selectedIndex === sections.length - 1}
              className="rounded-lg bg-teal-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-teal-200 disabled:opacity-50"
            >
              Next chapter
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

function Report({ report }) {
  const [activeTab, setActiveTab] = useState("reading");

  const tabs = useMemo(() => [
    { id: "reading", label: "Reading Session" },
    { id: "life", label: "Life Areas" },
    { id: "forecast", label: "Future" },
    { id: "remedies", label: "Remedies" },
  ], []);

  if (!report) return null;

  const summary = report.chart_summary || {};
  const quick = report.quick_summary || {};

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="rounded-lg border border-white/12 bg-white/[0.06] p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Personal reading</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Your chart, turned into a guided session</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Recognition, hidden patterns, past validation, current clarity, then future timing.
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
            {[
              ["Sun", summary.sun_sign],
              ["Moon", summary.moon_sign],
              ["Nakshatra", summary.moon_nakshatra],
              ["System", summary.zodiac_system],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <p className="text-xs text-white/50">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:overflow-x-auto sm:pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition sm:px-4 ${
              activeTab === tab.id
                ? "border-teal-300 bg-teal-300 text-black"
                : "border-white/15 bg-white/[0.06] text-white/70 hover:border-white/35 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "reading" && <ReadingSession report={report} />}

      {activeTab === "life" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Vedic Chart Basics" accent="border-teal-300/50" eyebrow="Chart">
            {field("Ayanamsa", summary.ayanamsa)}
            {field("Sun Sign", summary.sun_sign)}
            {field("Moon Sign", summary.moon_sign)}
            {field("Moon Nakshatra", summary.moon_nakshatra)}
            {field("Time Zone", summary.timezone_assumption)}
          </Card>

          <Card title="Quick Summary" accent="border-amber-300/50" eyebrow="Recognition">
            {field("Personality", quick.personality)}
            {field("Strength", quick.strength)}
            {field("Relationship Style", quick.relationship_style)}
            {field("Career Direction", quick.career_direction)}
          </Card>

          <Card title="Personality & Mindset" accent="border-cyan-300/50" eyebrow="Hidden self">
            {field("Nature", report.personality_and_mindset?.nature)}
            {field("Emotional Pattern", report.personality_and_mindset?.emotional_pattern)}
            {field("Communication Style", report.personality_and_mindset?.communication_style)}
            {field("Stress Handling", report.personality_and_mindset?.stress_handling)}
          </Card>

          <Card title="Love & Relationships" accent="border-pink-300/50" eyebrow="Connection">
            {field("Partner Type", report.love_and_relationships?.partner_type)}
            {field("Relationship Pattern", report.love_and_relationships?.relationship_pattern)}
            {field("Marriage Timing Hint", report.love_and_relationships?.marriage_timing_hint)}
            {field("Red Flags", report.love_and_relationships?.red_flags)}
          </Card>

          <Card title="Career & Education" accent="border-yellow-300/50" eyebrow="Work">
            {field("Best Fields", report.career_and_education?.best_fields?.join(", "))}
            {field("Job or Business", report.career_and_education?.job_or_business)}
            {field("Growth Periods", report.career_and_education?.growth_periods)}
            {field("Skill Recommendations", report.career_and_education?.skill_recommendations?.join(", "))}
          </Card>

          <Card title="Money & Wealth" accent="border-lime-300/50" eyebrow="Resources">
            {field("Earning Style", report.money_and_wealth?.earning_style)}
            {field("Spending Pattern", report.money_and_wealth?.spending_pattern)}
            {field("Wealth Growth Timeline", report.money_and_wealth?.wealth_growth_timeline)}
          </Card>

          <Card title="Strengths" accent="border-emerald-300/50" eyebrow="Build on this">
            {list(report.strengths_and_weaknesses?.strengths)}
          </Card>

          <Card title="Growth Areas" accent="border-rose-300/50" eyebrow="Watch gently">
            {list(report.strengths_and_weaknesses?.weaknesses)}
          </Card>

          <Card title="Health & Lifestyle" accent="border-sky-300/50" eyebrow="Care">
            {field("Weak Areas", report.health_and_lifestyle?.weak_areas?.join(", "))}
            <div>
              <p className="mb-2 font-semibold text-white">Lifestyle Advice</p>
              {list(report.health_and_lifestyle?.lifestyle_advice)}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "forecast" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Current Life Phase" accent="border-violet-300/50" eyebrow="Present energy">
            {field("Planetary Influence", report.current_transits?.planetary_influence)}
            {field("Focus Now", report.current_transits?.focus_now)}
            {field("Avoid Now", report.current_transits?.avoid_now)}
          </Card>

          <Card title="Future Timeline" accent="border-blue-300/50" eyebrow="What opens next">
            {field("Next 7 Days", report.forecast?.next_7_days)}
            {field("Next 30 Days", report.forecast?.next_30_days)}
            {field("Next 6 Months", report.forecast?.next_6_months)}
          </Card>

          <Card title="Final Guidance" accent="border-rose-300/50" eyebrow="Direction">
            {list(report.final_guidance)}
          </Card>
        </div>
      )}

      {activeTab === "remedies" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Daily Remedies" accent="border-fuchsia-300/50" eyebrow="Practice">
            {list(report.remedies?.daily_habits)}
            {field("Mantra", report.remedies?.mantra)}
            {field("Donation or Service", report.remedies?.donation_or_service)}
            {field("Mindset Remedy", report.remedies?.mindset_remedy)}
          </Card>

          <Card title="Lucky Factors" accent="border-lime-300/50" eyebrow="Signals">
            {field("Lucky Day", report.lucky_factors?.lucky_day)}
            {field("Lucky Color", report.lucky_factors?.lucky_color)}
            {field("Lucky Number", report.lucky_factors?.lucky_number)}
            {field("Lucky Direction", report.lucky_factors?.lucky_direction)}
          </Card>
        </div>
      )}
    </section>
  );
}

export default Report;
