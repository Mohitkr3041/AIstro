import { useMemo, useState } from "react";

const clean = (items = []) => items.filter(Boolean);

const navItems = [
  { id: "about", label: "About You" },
  { id: "past", label: "Past" },
  { id: "future", label: "Future" },
  { id: "life", label: "Life Areas" },
  { id: "remedies", label: "Remedies" },
];

const buildFlow = (report) => {
  const flow = report.reading_flow || {};
  const summary = report.chart_summary || {};
  const quick = report.quick_summary || {};
  const personality = report.personality_and_mindset || {};
  const career = report.career_and_education || {};
  const love = report.love_and_relationships || {};
  const money = report.money_and_wealth || {};
  const health = report.health_and_lifestyle || {};
  const forecast = report.forecast || {};
  const current = report.current_transits || {};
  const remedies = report.remedies || {};
  const lucky = report.lucky_factors || {};

  return {
    identity: flow.astrological_identity || {
      title: "Your astrological identity",
      core_signature: quick.personality || personality.nature,
      chart_factors: clean([
        summary.sun_sign && `Sun in ${summary.sun_sign}`,
        summary.moon_sign && `Moon in ${summary.moon_sign}`,
        summary.moon_nakshatra && `Moon nakshatra: ${summary.moon_nakshatra}`,
      ]),
      what_this_means: clean([
        personality.emotional_pattern,
        personality.communication_style,
        personality.stress_handling,
      ]),
      user_hook: quick.strength,
    },
    past: flow.past_happenings || {
      title: "Past patterns your chart may validate",
      validation_points: [
        {
          area: "Personality",
          likely_event: personality.emotional_pattern,
          chart_reason: personality.stress_handling,
          reflection_prompt: "Did this pattern repeat when pressure increased?",
        },
        {
          area: "Education/Career",
          likely_event: career.growth_periods,
          chart_reason: career.job_or_business,
          reflection_prompt: "Did direction become clearer after confusion or delay?",
        },
        {
          area: "Love/Family",
          likely_event: love.relationship_pattern,
          chart_reason: love.partner_type,
          reflection_prompt: "Did you notice this emotional pattern before trusting someone?",
        },
      ],
    },
    future: flow.future_prediction || {
      headline: quick.next_30_days_highlight || "Your next phase rewards clarity and consistent action.",
      timeline: [
        {
          period: "Next 30 days",
          prediction: forecast.next_30_days || quick.next_30_days_highlight,
          opportunity: current.focus_now || quick.career_direction,
          watch_out: current.avoid_now || money.spending_pattern,
          best_action: current.focus_now || "Choose one priority and act consistently.",
        },
        {
          period: "Next 6 months",
          prediction: forecast.next_6_months,
          opportunity: career.growth_periods || money.wealth_growth_timeline,
          watch_out: love.red_flags,
          best_action: clean(report.final_guidance)[0],
        },
        {
          period: "Next 1 year",
          prediction: money.wealth_growth_timeline || career.growth_periods,
          opportunity: "Longer-term growth improves when your actions become steady and less reactive.",
          watch_out: clean(report.strengths_and_weaknesses?.weaknesses)[0],
          best_action: clean(report.final_guidance)[1] || clean(report.final_guidance)[0],
        },
      ],
    },
    departments: flow.departments?.length ? flow.departments : [
      {
        name: "Career",
        insight: career.job_or_business,
        action: career.skill_recommendations?.join(", "),
      },
      {
        name: "Education",
        insight: career.best_fields?.join(", "),
        action: "Choose one learning direction and build depth before switching.",
      },
      {
        name: "Love",
        insight: love.relationship_pattern || love.partner_type,
        action: love.red_flags,
      },
      {
        name: "Money",
        insight: money.earning_style,
        action: money.wealth_growth_timeline,
      },
      {
        name: "Family",
        insight: "Your chart may show emotional responsibility inside close relationships.",
        action: "Speak clearly before resentment builds.",
      },
      {
        name: "Health",
        insight: health.weak_areas?.join(", "),
        action: clean(health.lifestyle_advice)[0],
      },
    ],
    remedy: flow.remedy_plan || {
      priority: remedies.mindset_remedy || "Stability before speed",
      daily_actions: clean(remedies.daily_habits),
      mantra_or_focus: remedies.mantra,
      avoid_this: current.avoid_now,
      lucky_support: clean([
        lucky.lucky_day && `Day: ${lucky.lucky_day}`,
        lucky.lucky_color && `Color: ${lucky.lucky_color}`,
        lucky.lucky_number && `Number: ${lucky.lucky_number}`,
        lucky.lucky_direction && `Direction: ${lucky.lucky_direction}`,
      ]).join(" | "),
    },
  };
};

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-5">
      <p className="aistro-kicker">{eyebrow}</p>
      <h2 className="aistro-title mt-2 text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="aistro-muted mt-2 max-w-3xl text-sm italic leading-6">{subtitle}</p>}
    </div>
  );
}

function ReadingCard({ children, className = "", ...props }) {
  return (
    <section className={`aistro-card scroll-mt-24 ${className}`} {...props}>
      {children}
    </section>
  );
}

function MiniCard({ eyebrow, title, body, action, tone = "default", children }) {
  const tones = {
    default: "border-[rgba(154,100,21,0.18)] bg-[rgba(255,248,232,0.66)]",
    teal: "border-[rgba(35,118,74,0.24)] bg-[rgba(35,118,74,0.07)]",
    amber: "border-[rgba(154,100,21,0.26)] bg-[rgba(154,100,21,0.08)]",
    coral: "border-[rgba(180,59,47,0.24)] bg-[rgba(180,59,47,0.08)]",
    indigo: "border-[rgba(124,63,147,0.26)] bg-[rgba(124,63,147,0.07)]",
  };

  return (
    <article className={`h-full rounded-[6px] border p-4 ${tones[tone] || tones.default}`}>
      {eyebrow && <p className="aistro-kicker text-[10px]">{eyebrow}</p>}
      <h3 className="mt-2 text-xl font-semibold leading-tight text-[var(--gold-2)]">{title || "Not available"}</h3>
      {body && <p className="aistro-muted mt-3 text-sm leading-6">{body}</p>}
      {children}
      {action && (
        <p className="mt-4 rounded-[4px] border border-[rgba(154,100,21,0.16)] bg-[rgba(255,248,232,0.7)] p-3 text-sm leading-6 text-[var(--parchment)]">
          <span className="font-bold text-[var(--amethyst-2)]">Action: </span>
          {action}
        </p>
      )}
    </article>
  );
}

function BulletList({ items }) {
  return (
    <div className="grid gap-2">
      {clean(items).map((item, index) => (
        <p key={index} className="rounded-[4px] border border-[rgba(154,100,21,0.16)] bg-[rgba(255,248,232,0.7)] p-3 text-sm leading-6 text-[var(--parchment)]">
          <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-[3px] bg-[rgba(155,89,182,0.35)] text-xs font-bold text-[var(--gold-2)]">
            {index + 1}
          </span>
          {item}
        </p>
      ))}
    </div>
  );
}

function Report({ report }) {
  const [activePeriod, setActivePeriod] = useState(0);
  const flow = useMemo(() => buildFlow(report || {}), [report]);

  if (!report) return null;

  const summary = report.chart_summary || {};
  const activeFuture = flow.future.timeline?.[activePeriod] || flow.future.timeline?.[0] || {};

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="space-y-5">
      <div className="aistro-card">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="aistro-kicker">Personal Astrology Reading</p>
            <h1 className="aistro-title mt-3 max-w-3xl text-5xl">
              Your chart decoded in a simple order.
            </h1>
            <p className="aistro-muted mt-4 max-w-2xl text-base italic leading-7">
              First about you, then past validation, then future prediction, life areas, and remedies.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="aistro-chip transition hover:border-[rgba(212,175,55,0.65)]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-0">
            {[
              ["Sun", summary.sun_sign],
              ["Moon", summary.moon_sign],
              ["Nakshatra", summary.moon_nakshatra],
              ["System", summary.zodiac_system],
            ].map(([label, value]) => (
              <div key={label} className="aistro-panel">
                <p className="aistro-kicker text-[10px]">{label}</p>
                <p className="mt-2 font-semibold text-[var(--parchment)]">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReadingCard id="about">
        <SectionTitle
          eyebrow="About You"
          title={flow.identity.title || "Your astrological identity"}
          subtitle="A short, direct reading of the person behind the chart."
        />
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[6px] border border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)] p-5">
            <p className="aistro-kicker text-[10px]">Core Signature</p>
            <p className="mt-3 text-2xl font-semibold leading-9 text-[var(--gold-2)]">
              {flow.identity.core_signature || "Your chart suggests a layered personality with private intensity and visible responsibility."}
            </p>
            {flow.identity.user_hook && (
              <p className="aistro-muted mt-4 text-sm leading-7">{flow.identity.user_hook}</p>
            )}
          </div>
          <div className="grid gap-4">
            <MiniCard eyebrow="Chart factors" title="Why this is personal" tone="teal">
              <BulletList items={flow.identity.chart_factors} />
            </MiniCard>
            <MiniCard eyebrow="Meaning" title="How this shows up" tone="indigo">
              <BulletList items={flow.identity.what_this_means} />
            </MiniCard>
          </div>
        </div>
      </ReadingCard>

      <ReadingCard id="past">
        <SectionTitle
          eyebrow="Past Validation"
          title={flow.past.title || "What your chart may remember"}
          subtitle="These cards help the user feel that the reading understands what has already happened."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {(flow.past.validation_points || []).map((point, index) => (
            <MiniCard
              key={`${point.area}-${index}`}
              eyebrow={point.area}
              title={point.likely_event}
              body={point.chart_reason}
              action={point.reflection_prompt}
              tone={["teal", "amber", "coral"][index] || "default"}
            />
          ))}
        </div>
      </ReadingCard>

      <ReadingCard id="future" className="border-[rgba(212,175,55,0.4)]">
        <SectionTitle
          eyebrow="Future Prediction"
          title={flow.future.headline || "Your future timeline"}
          subtitle="This is the main value section: prediction, opportunity, warning, and action."
        />
        <div className="grid gap-3 md:grid-cols-3">
          {(flow.future.timeline || []).map((item, index) => (
            <button
              key={item.period}
              type="button"
              onClick={() => setActivePeriod(index)}
              className={`rounded-[6px] border p-4 text-left transition ${
                activePeriod === index
                  ? "border-[rgba(212,175,55,0.52)] bg-[rgba(155,89,182,0.28)] text-[var(--gold-2)]"
                  : "border-[rgba(154,100,21,0.18)] bg-[rgba(255,248,232,0.66)] text-[var(--parchment)] hover:border-[rgba(154,100,21,0.4)]"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-wide opacity-70">{item.period}</p>
              <p className="mt-2 text-lg font-black leading-tight">{item.opportunity || item.prediction || "Prediction"}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[6px] border border-[rgba(212,175,55,0.32)] bg-[rgba(212,175,55,0.08)] p-5">
            <p className="aistro-kicker text-[10px]">{activeFuture.period}</p>
            <h3 className="mt-3 text-2xl font-semibold leading-9 text-[var(--gold-2)]">
              {activeFuture.prediction || "Generate a fresh report to unlock this timing."}
            </h3>
          </div>
          <div className="grid gap-3">
            <MiniCard eyebrow="Opportunity" title={activeFuture.opportunity} tone="teal" />
            <MiniCard eyebrow="Watch out" title={activeFuture.watch_out} tone="coral" />
            <MiniCard eyebrow="Best action" title={activeFuture.best_action} tone="indigo" />
          </div>
        </div>
      </ReadingCard>

      <ReadingCard id="life">
        <SectionTitle
          eyebrow="Life Areas"
          title="Guidance by department"
          subtitle="Concise but useful guidance for the main areas users care about."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(flow.departments || []).map((department, index) => (
            <MiniCard
              key={`${department.name}-${index}`}
              eyebrow="Life area"
              title={department.name}
              body={department.insight || department.future_signal}
              action={department.action}
              tone={["teal", "amber", "coral", "indigo"][index % 4]}
            />
          ))}
        </div>
      </ReadingCard>

      <ReadingCard id="remedies">
        <SectionTitle
          eyebrow="Remedies"
          title={flow.remedy.priority || "Your personal action plan"}
          subtitle="Simple daily actions and lucky support to make the reading useful."
        />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3">
            {clean(flow.remedy.daily_actions).map((action, index) => (
              <div key={index} className="flex gap-3 rounded-[6px] border border-[rgba(154,100,21,0.18)] bg-[rgba(255,248,232,0.66)] p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-[rgba(35,118,74,0.12)] font-bold text-[#1f6b44]">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold leading-6 text-[var(--parchment)]">{action}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4">
            <MiniCard eyebrow="Focus" title={flow.remedy.mantra_or_focus} tone="amber" />
            <MiniCard eyebrow="Avoid" title={flow.remedy.avoid_this} tone="coral" />
            <MiniCard eyebrow="Lucky support" title={flow.remedy.lucky_support} tone="teal" />
          </div>
        </div>
      </ReadingCard>
    </section>
  );
}

export default Report;
