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

const compactList = (items = []) => (
  <div className="grid gap-2">
    {items.filter(Boolean).map((item, index) => (
      <p key={index} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm leading-6 text-white/78">
        {item}
      </p>
    ))}
  </div>
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

function RevealCard({ section, index, isOpen, onToggle }) {
  return (
    <section className="rounded-lg border border-white/12 bg-white/[0.07] p-4 shadow-xl shadow-black/10 sm:p-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span>
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-200">
            Step {index + 1} - {section.category}
          </span>
          <span className="mt-2 block text-xl font-bold leading-tight text-white">
            {section.title}
          </span>
          <span className="mt-2 block text-sm leading-6 text-white/65">
            {section.hook || "Reveal this part of your reading."}
          </span>
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/15 bg-black/25 text-lg font-bold text-white">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
          {compactList(section.insights)}
          {section.action && (
            <div className="rounded-lg border border-amber-200/30 bg-amber-300/10 px-3 py-3 text-sm leading-6 text-amber-50">
              <span className="font-semibold text-white">Guidance: </span>
              {section.action}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Report({ report }) {
  const [activeTab, setActiveTab] = useState("journey");
  const [openReveal, setOpenReveal] = useState(0);

  const tabs = useMemo(() => [
    { id: "journey", label: "Reading Journey" },
    { id: "life", label: "Life Areas" },
    { id: "forecast", label: "Future" },
    { id: "remedies", label: "Remedies" },
  ], []);

  if (!report) return null;

  const summary = report.chart_summary || {};
  const quick = report.quick_summary || {};
  const journey = report.engagement_journey || {};
  const revealSections = journey.reveal_sections?.length
    ? journey.reveal_sections
    : buildFallbackJourney(report);

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="rounded-lg border border-white/12 bg-white/[0.06] p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Personal reading</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Your chart is ready to reveal</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              {journey.opening_hook || quick.next_30_days_highlight || "Start with what your chart recognizes about you, then move into the future."}
            </p>
            {journey.trust_statement && (
              <p className="mt-3 max-w-2xl rounded-lg border border-teal-200/25 bg-teal-300/10 px-3 py-2 text-sm leading-6 text-teal-50">
                {journey.trust_statement}
              </p>
            )}
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

      {journey.curiosity_lines?.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {journey.curiosity_lines.filter(Boolean).map((line, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/75">
              {line}
            </div>
          ))}
        </div>
      )}

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

      {activeTab === "journey" && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Recognition", quick.personality || "Your chart begins with the patterns you already sense."],
              ["Hidden Self", quick.strength || "Then it reveals the traits people may not notice."],
              ["Future", quick.next_30_days_highlight || "Finally, it points toward the next phase."],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/45">{label}</p>
                <p className="mt-2 text-sm leading-6 text-white/75">{value}</p>
              </div>
            ))}
          </div>

          {revealSections.map((section, index) => (
            <RevealCard
              key={`${section.title}-${index}`}
              section={section}
              index={index}
              isOpen={openReveal === index}
              onToggle={() => setOpenReveal(openReveal === index ? -1 : index)}
            />
          ))}
        </div>
      )}

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
