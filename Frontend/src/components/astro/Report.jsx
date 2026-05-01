import { useMemo, useState } from "react";

const clean = (items = []) => items.filter(Boolean);

const field = (label, value) => (
  <p className="text-sm leading-6 text-slate-300">
    <span className="font-semibold text-white">{label}:</span> {value || "Not available"}
  </p>
);

const ActionButton = ({ children, active, onClick, tone = "primary", disabled = false }) => {
  const styles = {
    primary: active
      ? "border-cyan-300 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30"
      : "border-white/10 bg-white/[0.07] text-slate-200 hover:border-cyan-200/70 hover:bg-cyan-300/10 hover:text-white",
    gold: "border-amber-200 bg-amber-300 text-slate-950 shadow-lg shadow-amber-950/30 hover:bg-amber-200",
    quiet: "border-white/10 bg-white/[0.06] text-slate-300 hover:border-white/25 hover:text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${styles[tone]}`}
    >
      {children}
    </button>
  );
};

function SectionShell({ eyebrow, title, subtitle, children, action }) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#0c1417] shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{subtitle}</p>}
          </div>
          {action}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InsightCard({ eyebrow, title, body, action, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-200/25 bg-cyan-300/[0.08]",
    amber: "border-amber-200/25 bg-amber-300/[0.08]",
    rose: "border-rose-200/25 bg-rose-300/[0.08]",
    emerald: "border-emerald-200/25 bg-emerald-300/[0.08]",
    violet: "border-violet-200/25 bg-violet-300/[0.08]",
    sky: "border-sky-200/25 bg-sky-300/[0.08]",
  };

  return (
    <article className={`h-full rounded-lg border p-4 ${tones[tone] || tones.cyan}`}>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-white/55">{eyebrow}</p>}
      <h3 className="mt-2 text-lg font-bold leading-tight text-white">{title}</h3>
      {body && <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{body}</div>}
      {action && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white">
          <span className="font-bold text-amber-200">Action: </span>
          {action}
        </div>
      )}
    </article>
  );
}

const buildFallbackJourney = (report) => [
  {
    title: "The part of you people rarely understand",
    category: "Hidden self",
    hook: report.personality_and_mindset?.emotional_pattern || report.quick_summary?.personality,
    insights: clean([
      report.personality_and_mindset?.nature,
      report.personality_and_mindset?.communication_style,
      report.personality_and_mindset?.stress_handling,
    ]),
    action: report.quick_summary?.strength,
  },
  {
    title: "Past patterns your chart remembers",
    category: "Past validation",
    hook: "These patterns may explain why some life areas felt delayed, intense, or confusing earlier.",
    insights: clean([
      report.career_and_education?.growth_periods,
      report.love_and_relationships?.relationship_pattern,
      report.money_and_wealth?.spending_pattern,
      report.strengths_and_weaknesses?.weaknesses?.[0],
    ]),
    action: "Notice the repeating pattern before making the next big decision.",
  },
  {
    title: "Where your life is asking for clarity now",
    category: "Current phase",
    hook: report.current_transits?.focus_now || report.quick_summary?.next_30_days_highlight,
    insights: clean([
      report.current_transits?.planetary_influence,
      report.current_transits?.focus_now,
      report.current_transits?.avoid_now,
    ]),
    action: report.remedies?.mindset_remedy,
  },
  {
    title: "What is opening next",
    category: "Future timeline",
    hook: report.forecast?.next_30_days || report.quick_summary?.next_30_days_highlight,
    insights: clean([
      report.forecast?.next_7_days,
      report.forecast?.next_30_days,
      report.forecast?.next_6_months,
      report.money_and_wealth?.wealth_growth_timeline,
    ]),
    action: report.final_guidance?.[0],
  },
];

const buildFallbackChecks = (report) => [
  {
    label: "Past pattern",
    statement: report.career_and_education?.growth_periods || "Your chart suggests earlier confusion around direction may have shaped your confidence.",
    why_it_matters: "Use this as an accuracy check before trusting future timing.",
  },
  {
    label: "Inner pattern",
    statement: report.personality_and_mindset?.emotional_pattern || "You may process more privately than people around you realize.",
    why_it_matters: "This shows the reading is looking below surface personality.",
  },
  {
    label: "Current phase",
    statement: report.current_transits?.focus_now || report.quick_summary?.next_30_days_highlight,
    why_it_matters: "This connects the report to what is happening now.",
  },
];

function ReadingSession({ report, onOpenFuture }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resonance, setResonance] = useState("");

  const journey = report.engagement_journey || {};
  const quick = report.quick_summary || {};
  const sections = journey.reveal_sections?.length ? journey.reveal_sections : buildFallbackJourney(report);
  const checks = journey.accuracy_checks?.length ? journey.accuracy_checks : buildFallbackChecks(report);
  const activeSection = sections[selectedIndex] || sections[0] || {};
  const progress = sections.length ? ((selectedIndex + 1) / sections.length) * 100 : 0;

  return (
    <SectionShell
      eyebrow="Guided reading"
      title="Start with proof, then reveal the future"
      subtitle="This keeps the reading easy to follow: first recognition, then past validation, then current clarity, then prediction."
      action={<ActionButton tone="gold" onClick={onOpenFuture}>Jump to Future</ActionButton>}
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="rounded-lg border border-amber-200/30 bg-amber-300/[0.08] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-100">Spotlight insight</p>
            <p className="mt-3 text-2xl font-bold leading-9 text-white">
              {journey.spotlight_insight || journey.trust_statement || quick.strength || "Your chart suggests your real growth begins when pressure turns into direction."}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {journey.opening_hook || quick.personality || "Compare this with your real life before moving into the future section."}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {["Feels accurate", "Partly true", "Show more"].map((label) => (
                <ActionButton key={label} active={resonance === label} onClick={() => setResonance(label)}>
                  {label}
                </ActionButton>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {checks.slice(0, 3).map((check, index) => (
              <InsightCard
                key={`${check.label}-${index}`}
                eyebrow={check.label}
                title={check.statement}
                body={<p>{check.why_it_matters}</p>}
                tone={["cyan", "violet", "emerald"][index]}
              />
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400">
            <span>Reading path</span>
            <span>{selectedIndex + 1}/{sections.length}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 space-y-2">
            {sections.map((section, index) => (
              <button
                key={`${section.title}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selectedIndex === index
                    ? "border-cyan-300 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-wide opacity-70">Chapter {index + 1}</span>
                <span className="mt-1 block text-sm font-bold">{section.category}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <article className="mt-5 rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">{activeSection.category}</p>
        <h3 className="mt-2 text-2xl font-bold text-white">{activeSection.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{activeSection.hook}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {clean(activeSection.insights).map((insight, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-200">
              <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-md bg-white/10 text-xs font-bold text-white">
                {index + 1}
              </span>
              {insight}
            </div>
          ))}
        </div>
        {activeSection.action && (
          <div className="mt-4 rounded-lg border border-amber-200/30 bg-amber-300/10 p-4 text-sm leading-7 text-amber-50">
            <span className="font-bold text-white">Next step: </span>
            {activeSection.action}
          </div>
        )}
      </article>
    </SectionShell>
  );
}

function FutureSection({ report, onOpenRemedies }) {
  const forecast = report.forecast || {};
  const current = report.current_transits || {};
  const money = report.money_and_wealth || {};
  const career = report.career_and_education || {};
  const love = report.love_and_relationships || {};

  const timeline = [
    {
      label: "Next 7 days",
      title: "Immediate energy",
      body: forecast.next_7_days,
      action: current.avoid_now ? `Avoid: ${current.avoid_now}` : "Keep decisions simple and observe the pattern.",
      tone: "cyan",
    },
    {
      label: "Next 30 days",
      title: "Main opportunity window",
      body: forecast.next_30_days || report.quick_summary?.next_30_days_highlight,
      action: current.focus_now ? `Focus: ${current.focus_now}` : "Choose one priority and stay consistent.",
      tone: "amber",
    },
    {
      label: "Next 6 months",
      title: "Growth direction",
      body: forecast.next_6_months,
      action: career.growth_periods || money.wealth_growth_timeline,
      tone: "emerald",
    },
  ];

  return (
    <SectionShell
      eyebrow="Most important section"
      title="Your future timeline"
      subtitle="A clear view of what to expect, what to focus on, and what to avoid. This is the part users come back for."
      action={<ActionButton tone="gold" onClick={onOpenRemedies}>Get Remedies</ActionButton>}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {timeline.map((item) => (
          <InsightCard
            key={item.label}
            eyebrow={item.label}
            title={item.title}
            body={<p>{item.body || "Prediction will appear after a fresh report is generated."}</p>}
            action={item.action}
            tone={item.tone}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InsightCard
          eyebrow="Career"
          title="Where progress can open"
          body={
            <>
              {field("Direction", career.job_or_business)}
              {field("Best fields", career.best_fields?.join(", "))}
            </>
          }
          action={career.skill_recommendations?.join(", ")}
          tone="sky"
        />
        <InsightCard
          eyebrow="Money"
          title="How wealth growth may behave"
          body={
            <>
              {field("Earning style", money.earning_style)}
              {field("Spending pattern", money.spending_pattern)}
            </>
          }
          action={money.wealth_growth_timeline}
          tone="emerald"
        />
        <InsightCard
          eyebrow="Love"
          title="Relationship timing and pattern"
          body={
            <>
              {field("Pattern", love.relationship_pattern)}
              {field("Timing hint", love.marriage_timing_hint)}
            </>
          }
          action={love.red_flags}
          tone="rose"
        />
      </div>
    </SectionShell>
  );
}

function LifeAreas({ report }) {
  const personality = report.personality_and_mindset || {};
  const strengths = report.strengths_and_weaknesses || {};
  const career = report.career_and_education || {};
  const love = report.love_and_relationships || {};
  const money = report.money_and_wealth || {};
  const health = report.health_and_lifestyle || {};

  const areas = [
    {
      eyebrow: "Personality",
      title: "How your mind works",
      body: (
        <>
          {field("Nature", personality.nature)}
          {field("Emotional pattern", personality.emotional_pattern)}
          {field("Stress response", personality.stress_handling)}
        </>
      ),
      action: personality.communication_style,
      tone: "cyan",
    },
    {
      eyebrow: "Career",
      title: "Best direction for work",
      body: (
        <>
          {field("Best fields", career.best_fields?.join(", "))}
          {field("Job or business", career.job_or_business)}
        </>
      ),
      action: career.skill_recommendations?.join(", "),
      tone: "amber",
    },
    {
      eyebrow: "Love",
      title: "Your relationship pattern",
      body: (
        <>
          {field("Partner type", love.partner_type)}
          {field("Pattern", love.relationship_pattern)}
        </>
      ),
      action: love.red_flags,
      tone: "rose",
    },
    {
      eyebrow: "Money",
      title: "Earning and spending style",
      body: (
        <>
          {field("Earning", money.earning_style)}
          {field("Spending", money.spending_pattern)}
        </>
      ),
      action: money.wealth_growth_timeline,
      tone: "emerald",
    },
    {
      eyebrow: "Strengths",
      title: "What to build on",
      body: <ul className="space-y-2">{clean(strengths.strengths).slice(0, 3).map((item, index) => <li key={index}>{item}</li>)}</ul>,
      action: clean(strengths.weaknesses)[0],
      tone: "violet",
    },
    {
      eyebrow: "Health",
      title: "Lifestyle guidance",
      body: (
        <>
          {field("Weak areas", health.weak_areas?.join(", "))}
          <ul className="space-y-2">{clean(health.lifestyle_advice).slice(0, 2).map((item, index) => <li key={index}>{item}</li>)}</ul>
        </>
      ),
      action: clean(health.lifestyle_advice)[2],
      tone: "sky",
    },
  ];

  return (
    <SectionShell
      eyebrow="Life areas"
      title="Clear guidance by category"
      subtitle="Each area gives the user one insight, one pattern, and one practical next step."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <InsightCard key={area.eyebrow} {...area} />
        ))}
      </div>
    </SectionShell>
  );
}

function Remedies({ report, onOpenFuture }) {
  const remedies = report.remedies || {};
  const lucky = report.lucky_factors || {};
  const daily = clean(remedies.daily_habits);

  return (
    <SectionShell
      eyebrow="Remedies"
      title="Simple actions for daily alignment"
      subtitle="Remedies should feel practical, memorable, and easy to repeat."
      action={<ActionButton tone="gold" onClick={onOpenFuture}>Review Future</ActionButton>}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3">
          {daily.map((habit, index) => (
            <div key={index} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan-300 text-sm font-black text-slate-950">
                {index + 1}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Daily habit</p>
                <p className="mt-1 text-sm leading-6 text-white">{habit}</p>
              </div>
            </div>
          ))}
          <InsightCard
            eyebrow="Mindset remedy"
            title={remedies.mindset_remedy || "Stay steady before reacting"}
            body={<p>{remedies.donation_or_service || "A small act of service can help turn pressure into grounded action."}</p>}
            action={remedies.mantra}
            tone="amber"
          />
        </div>

        <div className="rounded-lg border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Lucky factors</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Day", lucky.lucky_day],
              ["Color", lucky.lucky_color],
              ["Number", lucky.lucky_number],
              ["Direction", lucky.lucky_direction],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-bold text-white">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Report({ report }) {
  const [activeTab, setActiveTab] = useState("future");

  const tabs = useMemo(() => [
    { id: "future", label: "Future", hint: "Most used" },
    { id: "reading", label: "Reading", hint: "Trust builder" },
    { id: "life", label: "Life Areas", hint: "Guidance" },
    { id: "remedies", label: "Remedies", hint: "Action" },
  ], []);

  if (!report) return null;

  const summary = report.chart_summary || {};
  const quick = report.quick_summary || {};

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#081114] shadow-2xl shadow-black/20">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">AIstro personal prediction</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
              Your future timeline is ready
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
              {quick.next_30_days_highlight || "Start with your prediction, then explore the reading, life areas, and remedies."}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <ActionButton tone="gold" onClick={() => setActiveTab("future")}>View Future Prediction</ActionButton>
              <ActionButton onClick={() => setActiveTab("remedies")}>Show Remedies</ActionButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["Sun", summary.sun_sign],
              ["Moon", summary.moon_sign],
              ["Nakshatra", summary.moon_nakshatra],
              ["System", summary.zodiac_system],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.045] px-3 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-bold text-white">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-black/20 p-3 lg:grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg border p-3 text-left transition ${
                activeTab === tab.id
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white"
              }`}
            >
              <span className="block text-sm font-black">{tab.label}</span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-wide opacity-65">{tab.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "future" && <FutureSection report={report} onOpenRemedies={() => setActiveTab("remedies")} />}
      {activeTab === "reading" && <ReadingSession report={report} onOpenFuture={() => setActiveTab("future")} />}
      {activeTab === "life" && <LifeAreas report={report} />}
      {activeTab === "remedies" && <Remedies report={report} onOpenFuture={() => setActiveTab("future")} />}
    </section>
  );
}

export default Report;
