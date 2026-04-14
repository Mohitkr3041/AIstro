import { useMemo, useState } from "react";
import Card from "./Card";

const list = (items = []) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
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

function Report({ report }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = useMemo(() => [
    { id: "overview", label: "Overview" },
    { id: "life", label: "Life" },
    { id: "forecast", label: "Forecast" },
    { id: "remedies", label: "Remedies" },
  ], []);

  if (!report) return null;

  const summary = report.chart_summary || {};
  const quick = report.quick_summary || {};

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="rounded-lg border border-white/12 bg-white/[0.06] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Personal report</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Your chart at a glance</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              {quick.next_30_days_highlight || "Your personalized report is ready."}
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
            className={`rounded-lg border px-3 py-2 text-sm sm:px-4 font-semibold transition ${
              activeTab === tab.id
                ? "border-teal-300 bg-teal-300 text-black"
                : "border-white/15 bg-white/[0.06] text-white/70 hover:border-white/35 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Vedic Chart Basics" accent="border-teal-300/50" eyebrow="Chart">
            {field("Ayanamsa", summary.ayanamsa)}
            {field("Sun Sign", summary.sun_sign)}
            {field("Moon Sign", summary.moon_sign)}
            {field("Moon Nakshatra", summary.moon_nakshatra)}
            {field("Time Zone", summary.timezone_assumption)}
          </Card>

          <Card title="Quick Summary" accent="border-amber-300/50" eyebrow="Now">
            {field("Personality", quick.personality)}
            {field("Strength", quick.strength)}
            {field("Relationship Style", quick.relationship_style)}
            {field("Career Direction", quick.career_direction)}
          </Card>

          <Card title="Personality & Mindset" accent="border-cyan-300/50" eyebrow="Self">
            {field("Nature", report.personality_and_mindset?.nature)}
            {field("Emotional Pattern", report.personality_and_mindset?.emotional_pattern)}
            {field("Communication Style", report.personality_and_mindset?.communication_style)}
            {field("Stress Handling", report.personality_and_mindset?.stress_handling)}
          </Card>

          <Card title="Final Guidance" accent="border-rose-300/50" eyebrow="Direction">
            {list(report.final_guidance)}
          </Card>
        </div>
      )}

      {activeTab === "life" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Strengths" accent="border-emerald-300/50" eyebrow="Build on this">
            {list(report.strengths_and_weaknesses?.strengths)}
          </Card>

          <Card title="Growth Areas" accent="border-rose-300/50" eyebrow="Watch gently">
            {list(report.strengths_and_weaknesses?.weaknesses)}
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
          <Card title="Current Transits" accent="border-violet-300/50" eyebrow="Present energy">
            {field("Planetary Influence", report.current_transits?.planetary_influence)}
            {field("Focus Now", report.current_transits?.focus_now)}
            {field("Avoid Now", report.current_transits?.avoid_now)}
          </Card>

          <Card title="Forecast" accent="border-blue-300/50" eyebrow="Timeline">
            {field("Next 7 Days", report.forecast?.next_7_days)}
            {field("Next 30 Days", report.forecast?.next_30_days)}
            {field("Next 6 Months", report.forecast?.next_6_months)}
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

