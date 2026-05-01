import { useMemo, useState } from "react";

const clean = (items = []) => items.filter(Boolean);

const steps = [
  { id: "identity", label: "Your Chart", hint: "Who you are" },
  { id: "past", label: "Past Proof", hint: "What happened" },
  { id: "future", label: "Future", hint: "What comes next" },
  { id: "departments", label: "Life Areas", hint: "By category" },
  { id: "remedies", label: "Remedies", hint: "What to do" },
];

const accentClasses = {
  coral: "border-[#ff7a7a]/35 bg-[#ff7a7a]/10",
  mint: "border-[#5eead4]/35 bg-[#5eead4]/10",
  gold: "border-[#f8d66d]/35 bg-[#f8d66d]/10",
  blue: "border-[#7dd3fc]/35 bg-[#7dd3fc]/10",
  green: "border-[#86efac]/35 bg-[#86efac]/10",
  violet: "border-[#c4b5fd]/35 bg-[#c4b5fd]/10",
};

const getAccent = (index) => ["coral", "mint", "gold", "blue", "green", "violet"][index % 6];

function PrimaryButton({ children, onClick, variant = "primary", disabled = false }) {
  const styles = {
    primary: "border-[#f8d66d] bg-[#f8d66d] text-[#171014] shadow-lg shadow-[#f8d66d]/20 hover:bg-[#ffe58a]",
    secondary: "border-white/15 bg-white/[0.06] text-white hover:border-[#5eead4]/60 hover:bg-[#5eead4]/10",
    danger: "border-[#ff7a7a]/40 bg-[#ff7a7a]/15 text-white hover:bg-[#ff7a7a]/20",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-white/45">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value || "-"}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5eead4]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d8dde2]/78">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-white/10 bg-[#171014] p-5 shadow-2xl shadow-black/25 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function InfoCard({ eyebrow, title, children, accent = "mint", action }) {
  return (
    <article className={`h-full rounded-lg border p-4 ${accentClasses[accent] || accentClasses.mint}`}>
      {eyebrow && <p className="text-xs font-black uppercase tracking-wide text-white/50">{eyebrow}</p>}
      <h3 className="mt-2 text-lg font-black leading-tight text-white">{title || "Not available"}</h3>
      {children && <div className="mt-3 space-y-2 text-sm leading-6 text-[#d8dde2]/82">{children}</div>}
      {action && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white">
          <span className="font-black text-[#f8d66d]">Action: </span>
          {action}
        </div>
      )}
    </article>
  );
}

function BulletList({ items }) {
  return (
    <div className="grid gap-2">
      {clean(items).map((item, index) => (
        <p key={index} className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-[#d8dde2]">
          <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-md bg-white/10 text-xs font-black text-white">
            {index + 1}
          </span>
          {item}
        </p>
      ))}
    </div>
  );
}

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
          period: "Next 7 days",
          prediction: forecast.next_7_days,
          opportunity: current.focus_now,
          watch_out: current.avoid_now,
          best_action: "Keep decisions simple and observe what repeats.",
        },
        {
          period: "Next 30 days",
          prediction: forecast.next_30_days,
          opportunity: quick.career_direction,
          watch_out: money.spending_pattern,
          best_action: current.focus_now,
        },
        {
          period: "Next 6 months",
          prediction: forecast.next_6_months,
          opportunity: career.growth_periods || money.wealth_growth_timeline,
          watch_out: love.red_flags,
          best_action: clean(report.final_guidance)[0],
        },
      ],
    },
    departments: flow.departments?.length ? flow.departments : [
      {
        name: "Career",
        insight: career.job_or_business,
        past_pattern: career.growth_periods,
        future_signal: quick.career_direction,
        action: career.skill_recommendations?.join(", "),
      },
      {
        name: "Education",
        insight: career.best_fields?.join(", "),
        past_pattern: "Your chart may show learning through pressure, comparison, or delayed clarity.",
        future_signal: "Skills improve when you choose one direction and build depth.",
        action: career.skill_recommendations?.join(", "),
      },
      {
        name: "Love",
        insight: love.partner_type,
        past_pattern: love.relationship_pattern,
        future_signal: love.marriage_timing_hint,
        action: love.red_flags,
      },
      {
        name: "Money",
        insight: money.earning_style,
        past_pattern: money.spending_pattern,
        future_signal: money.wealth_growth_timeline,
        action: "Track impulse spending and build one steady income skill.",
      },
      {
        name: "Family",
        insight: "Your chart may show emotional responsibility inside close relationships.",
        past_pattern: "You may have carried more silently than people noticed.",
        future_signal: "Clear boundaries can improve peace at home.",
        action: "Speak clearly before resentment builds.",
      },
      {
        name: "Health",
        insight: health.weak_areas?.join(", "),
        past_pattern: "Stress can show up physically when emotions stay unspoken.",
        future_signal: "Lifestyle consistency will matter more than sudden changes.",
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

function IdentityStep({ flow, summary, onNext }) {
  return (
    <Panel>
      <SectionHeader
        eyebrow="Step 1 - Astrological self"
        title={flow.identity.title || "Your astrological identity"}
        subtitle="First the app reads the person behind the chart. This builds interest before asking the user to trust future predictions."
        action={<PrimaryButton onClick={onNext}>Continue to Past Proof</PrimaryButton>}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-[#f8d66d]/35 bg-[#f8d66d]/10 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-[#f8d66d]">Core signature</p>
          <p className="mt-3 text-2xl font-black leading-9 text-white">
            {flow.identity.core_signature || "Your chart suggests a layered personality with private intensity and visible responsibility."}
          </p>
          {flow.identity.user_hook && <p className="mt-4 text-sm leading-7 text-[#f8efe0]">{flow.identity.user_hook}</p>}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label="Sun" value={summary.sun_sign} />
          <Metric label="Moon" value={summary.moon_sign} />
          <Metric label="Nakshatra" value={summary.moon_nakshatra} />
          <Metric label="System" value={summary.zodiac_system} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <InfoCard eyebrow="Chart factors" title="Why this reading is personal" accent="mint">
          <BulletList items={flow.identity.chart_factors} />
        </InfoCard>
        <InfoCard eyebrow="Meaning" title="How this can show up in life" accent="blue">
          <BulletList items={flow.identity.what_this_means} />
        </InfoCard>
      </div>
    </Panel>
  );
}

function PastStep({ flow, checkedPast, setCheckedPast, onNext }) {
  const points = flow.past.validation_points || [];
  const accuracy = points.length ? Math.round((checkedPast.length / points.length) * 100) : 0;

  return (
    <Panel>
      <SectionHeader
        eyebrow="Step 2 - Past validation"
        title={flow.past.title || "Past happenings your chart may remember"}
        subtitle="The user should feel, 'this app understands what has already happened.' That is the trust bridge before future prediction."
        action={<PrimaryButton onClick={onNext}>Reveal Future</PrimaryButton>}
      />

      <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-white/45">Resonance meter</p>
            <p className="mt-1 text-xl font-black text-white">{accuracy}% matched</p>
          </div>
          <div className="h-3 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#5eead4] transition-all" style={{ width: `${accuracy}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {points.map((point, index) => {
          const checked = checkedPast.includes(index);
          return (
            <button
              key={`${point.area}-${index}`}
              type="button"
              onClick={() => {
                setCheckedPast((prev) => (
                  prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
                ));
              }}
              className={`rounded-lg border p-4 text-left transition ${
                checked
                  ? "border-[#5eead4] bg-[#5eead4]/15"
                  : `${accentClasses[getAccent(index)]} hover:border-white/35`
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-wide text-white/50">{point.area}</p>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${checked ? "bg-[#5eead4] text-[#171014]" : "bg-white/10 text-white"}`}>
                  {checked ? "Matched" : "Check"}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-black leading-tight text-white">{point.likely_event || "Past pattern unavailable"}</h3>
              <p className="mt-3 text-sm leading-6 text-[#d8dde2]/80">{point.chart_reason}</p>
              <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white">
                {point.reflection_prompt}
              </p>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function FutureStep({ flow, activePeriod, setActivePeriod, onNext }) {
  const timeline = flow.future.timeline || [];
  const active = timeline[activePeriod] || timeline[0] || {};

  return (
    <Panel>
      <SectionHeader
        eyebrow="Step 3 - Future prediction"
        title={flow.future.headline || "Your future timeline"}
        subtitle="This section is intentionally direct: what may happen, where opportunity opens, what to avoid, and what to do."
        action={<PrimaryButton onClick={onNext}>Open Life Areas</PrimaryButton>}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {timeline.map((item, index) => (
          <button
            key={item.period}
            type="button"
            onClick={() => setActivePeriod(index)}
            className={`rounded-lg border p-4 text-left transition ${
              activePeriod === index
                ? "border-[#f8d66d] bg-[#f8d66d] text-[#171014]"
                : "border-white/10 bg-white/[0.055] text-white hover:border-[#f8d66d]/55"
            }`}
          >
            <p className="text-xs font-black uppercase tracking-wide opacity-70">{item.period}</p>
            <p className="mt-2 text-lg font-black leading-tight">{item.opportunity || item.prediction || "Prediction"}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-[#f8d66d]/35 bg-[#f8d66d]/10 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-[#f8d66d]">{active.period || "Selected period"}</p>
          <h3 className="mt-3 text-2xl font-black leading-9 text-white">{active.prediction || "Generate a fresh report to unlock this timing."}</h3>
        </div>
        <div className="grid gap-3">
          <InfoCard eyebrow="Opportunity" title={active.opportunity || "Not available"} accent="green" />
          <InfoCard eyebrow="Watch out" title={active.watch_out || "Not available"} accent="coral" />
          <InfoCard eyebrow="Best action" title={active.best_action || "Not available"} accent="mint" />
        </div>
      </div>
    </Panel>
  );
}

function DepartmentsStep({ flow, activeDepartment, setActiveDepartment, onNext }) {
  const departments = flow.departments || [];
  const active = departments[activeDepartment] || departments[0] || {};

  return (
    <Panel>
      <SectionHeader
        eyebrow="Step 4 - Departments"
        title="Concise guidance for each life area"
        subtitle="Each department gives one insight, one past pattern, one future signal, and one practical action."
        action={<PrimaryButton onClick={onNext}>Get Remedies</PrimaryButton>}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {departments.map((department, index) => (
          <button
            key={`${department.name}-${index}`}
            type="button"
            onClick={() => setActiveDepartment(index)}
            className={`rounded-lg border p-3 text-left transition ${
              activeDepartment === index
                ? "border-[#5eead4] bg-[#5eead4] text-[#171014]"
                : "border-white/10 bg-white/[0.055] text-white hover:border-[#5eead4]/60"
            }`}
          >
            <span className="text-sm font-black">{department.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        <InfoCard eyebrow={active.name} title="Insight" accent="mint">
          <p>{active.insight || "Not available"}</p>
        </InfoCard>
        <InfoCard eyebrow={active.name} title="Past pattern" accent="blue">
          <p>{active.past_pattern || "Not available"}</p>
        </InfoCard>
        <InfoCard eyebrow={active.name} title="Future signal" accent="gold">
          <p>{active.future_signal || "Not available"}</p>
        </InfoCard>
        <InfoCard eyebrow={active.name} title="Action" accent="coral">
          <p>{active.action || "Not available"}</p>
        </InfoCard>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department, index) => (
          <InfoCard
            key={`${department.name}-summary-${index}`}
            eyebrow="Quick view"
            title={department.name}
            accent={getAccent(index)}
            action={department.action}
          >
            <p>{department.future_signal || department.insight}</p>
          </InfoCard>
        ))}
      </div>
    </Panel>
  );
}

function RemediesStep({ flow, onRestart }) {
  return (
    <Panel>
      <SectionHeader
        eyebrow="Step 5 - Remedies"
        title={flow.remedy.priority || "Your action plan"}
        subtitle="The report ends with useful actions, not just reading material."
        action={<PrimaryButton onClick={onRestart}>Review From Start</PrimaryButton>}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3">
          {clean(flow.remedy.daily_actions).map((action, index) => (
            <div key={index} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#5eead4] text-sm font-black text-[#171014]">
                {index + 1}
              </div>
              <p className="text-sm font-bold leading-6 text-white">{action}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          <InfoCard eyebrow="Focus" title={flow.remedy.mantra_or_focus || "Not available"} accent="gold" />
          <InfoCard eyebrow="Avoid" title={flow.remedy.avoid_this || "Not available"} accent="coral" />
          <InfoCard eyebrow="Lucky support" title={flow.remedy.lucky_support || "Not available"} accent="green" />
        </div>
      </div>
    </Panel>
  );
}

function Report({ report }) {
  const [activeStep, setActiveStep] = useState("identity");
  const [checkedPast, setCheckedPast] = useState([]);
  const [activePeriod, setActivePeriod] = useState(1);
  const [activeDepartment, setActiveDepartment] = useState(0);

  const flow = useMemo(() => buildFlow(report || {}), [report]);

  if (!report) return null;

  const summary = report.chart_summary || {};
  const activeIndex = Math.max(steps.findIndex((step) => step.id === activeStep), 0);
  const goNext = () => setActiveStep(steps[Math.min(activeIndex + 1, steps.length - 1)].id);
  const restart = () => setActiveStep("identity");

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171014] shadow-2xl shadow-black/25">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5eead4]">AIstro chart intelligence</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
              A personal reading built in the right order
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#d8dde2]/82">
              First your astrological identity, then past validation, then future prediction, then department-wise actions.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <PrimaryButton onClick={() => setActiveStep("identity")}>Start Reading</PrimaryButton>
              <PrimaryButton variant="secondary" onClick={() => setActiveStep("future")}>Jump to Future</PrimaryButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Metric label="Sun" value={summary.sun_sign} />
            <Metric label="Moon" value={summary.moon_sign} />
            <Metric label="Nakshatra" value={summary.moon_nakshatra} />
            <Metric label="System" value={summary.zodiac_system} />
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/20 p-3">
          <div className="grid gap-2 md:grid-cols-5">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  activeStep === step.id
                    ? "border-[#f8d66d] bg-[#f8d66d] text-[#171014]"
                    : index < activeIndex
                      ? "border-[#5eead4]/35 bg-[#5eead4]/10 text-white hover:border-[#5eead4]/70"
                      : "border-white/10 bg-white/[0.04] text-[#d8dde2] hover:border-white/30"
                }`}
              >
                <span className="text-xs font-black uppercase tracking-wide opacity-70">Step {index + 1}</span>
                <span className="mt-1 block text-sm font-black">{step.label}</span>
                <span className="mt-1 block text-xs font-bold opacity-70">{step.hint}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeStep === "identity" && <IdentityStep flow={flow} summary={summary} onNext={goNext} />}
      {activeStep === "past" && (
        <PastStep
          flow={flow}
          checkedPast={checkedPast}
          setCheckedPast={setCheckedPast}
          onNext={goNext}
        />
      )}
      {activeStep === "future" && (
        <FutureStep
          flow={flow}
          activePeriod={activePeriod}
          setActivePeriod={setActivePeriod}
          onNext={goNext}
        />
      )}
      {activeStep === "departments" && (
        <DepartmentsStep
          flow={flow}
          activeDepartment={activeDepartment}
          setActiveDepartment={setActiveDepartment}
          onNext={goNext}
        />
      )}
      {activeStep === "remedies" && <RemediesStep flow={flow} onRestart={restart} />}
    </section>
  );
}

export default Report;
