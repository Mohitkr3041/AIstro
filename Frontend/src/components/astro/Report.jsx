import Card from "./Card";

function Report({ report }) {
  if (!report) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title="Quick Summary" titleColor="text-indigo-300">
        <p className="mb-2"><span className="font-semibold">Personality:</span> {report.quick_summary?.personality}</p>
        <p className="mb-2"><span className="font-semibold">Strength:</span> {report.quick_summary?.strength}</p>
        <p className="mb-2"><span className="font-semibold">Relationship Style:</span> {report.quick_summary?.relationship_style}</p>
        <p className="mb-2"><span className="font-semibold">Career Direction:</span> {report.quick_summary?.career_direction}</p>
        <p><span className="font-semibold">Next 30 Days:</span> {report.quick_summary?.next_30_days_highlight}</p>
      </Card>

      <Card title="Personality & Mindset" titleColor="text-cyan-300">
        <p className="mb-2"><span className="font-semibold">Nature:</span> {report.personality_and_mindset?.nature}</p>
        <p className="mb-2"><span className="font-semibold">Emotional Pattern:</span> {report.personality_and_mindset?.emotional_pattern}</p>
        <p className="mb-2"><span className="font-semibold">Communication Style:</span> {report.personality_and_mindset?.communication_style}</p>
        <p><span className="font-semibold">Stress Handling:</span> {report.personality_and_mindset?.stress_handling}</p>
      </Card>

      <Card title="Strengths" titleColor="text-green-300">
        <ul className="list-disc pl-5 space-y-1">
          {report.strengths_and_weaknesses?.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Weaknesses" titleColor="text-red-300">
        <ul className="list-disc pl-5 space-y-1">
          {report.strengths_and_weaknesses?.weaknesses?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Love & Relationships" titleColor="text-pink-300">
        <p className="mb-2"><span className="font-semibold">Partner Type:</span> {report.love_and_relationships?.partner_type}</p>
        <p className="mb-2"><span className="font-semibold">Relationship Pattern:</span> {report.love_and_relationships?.relationship_pattern}</p>
        <p className="mb-2"><span className="font-semibold">Marriage Timing Hint:</span> {report.love_and_relationships?.marriage_timing_hint}</p>
        <p><span className="font-semibold">Red Flags:</span> {report.love_and_relationships?.red_flags}</p>
      </Card>

      <Card title="Career & Education" titleColor="text-yellow-300">
        <p className="mb-2"><span className="font-semibold">Best Fields:</span> {report.career_and_education?.best_fields?.join(", ")}</p>
        <p className="mb-2"><span className="font-semibold">Job or Business:</span> {report.career_and_education?.job_or_business}</p>
        <p className="mb-2"><span className="font-semibold">Growth Periods:</span> {report.career_and_education?.growth_periods}</p>
        <p><span className="font-semibold">Skill Recommendations:</span> {report.career_and_education?.skill_recommendations?.join(", ")}</p>
      </Card>

      <Card title="Money & Wealth" titleColor="text-emerald-300">
        <p className="mb-2"><span className="font-semibold">Earning Style:</span> {report.money_and_wealth?.earning_style}</p>
        <p className="mb-2"><span className="font-semibold">Spending Pattern:</span> {report.money_and_wealth?.spending_pattern}</p>
        <p><span className="font-semibold">Wealth Growth Timeline:</span> {report.money_and_wealth?.wealth_growth_timeline}</p>
      </Card>

      <Card title="Health & Lifestyle" titleColor="text-orange-300">
        <p className="mb-2"><span className="font-semibold">Weak Areas:</span> {report.health_and_lifestyle?.weak_areas?.join(", ")}</p>
        <p className="font-semibold mb-2">Lifestyle Advice:</p>
        <ul className="list-disc pl-5 space-y-1">
          {report.health_and_lifestyle?.lifestyle_advice?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Current Transits" titleColor="text-violet-300">
        <p className="mb-2"><span className="font-semibold">Planetary Influence:</span> {report.current_transits?.planetary_influence}</p>
        <p className="mb-2"><span className="font-semibold">Focus Now:</span> {report.current_transits?.focus_now}</p>
        <p><span className="font-semibold">Avoid Now:</span> {report.current_transits?.avoid_now}</p>
      </Card>

      <Card title="Forecast" titleColor="text-blue-300">
        <p className="mb-2"><span className="font-semibold">Next 7 Days:</span> {report.forecast?.next_7_days}</p>
        <p className="mb-2"><span className="font-semibold">Next 30 Days:</span> {report.forecast?.next_30_days}</p>
        <p><span className="font-semibold">Next 6 Months:</span> {report.forecast?.next_6_months}</p>
      </Card>

      <Card title="Remedies" titleColor="text-fuchsia-300">
        <p className="mb-2 font-semibold">Daily Habits:</p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          {report.remedies?.daily_habits?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p className="mb-2"><span className="font-semibold">Mantra:</span> {report.remedies?.mantra}</p>
        <p className="mb-2"><span className="font-semibold">Donation or Service:</span> {report.remedies?.donation_or_service}</p>
        <p><span className="font-semibold">Mindset Remedy:</span> {report.remedies?.mindset_remedy}</p>
      </Card>

      <Card title="Lucky Factors" titleColor="text-lime-300">
        <p className="mb-2"><span className="font-semibold">Lucky Day:</span> {report.lucky_factors?.lucky_day}</p>
        <p className="mb-2"><span className="font-semibold">Lucky Color:</span> {report.lucky_factors?.lucky_color}</p>
        <p className="mb-2"><span className="font-semibold">Lucky Number:</span> {report.lucky_factors?.lucky_number}</p>
        <p><span className="font-semibold">Lucky Direction:</span> {report.lucky_factors?.lucky_direction}</p>
      </Card>

      <Card title="Final Guidance" titleColor="text-white">
        <ul className="list-disc pl-5 space-y-1">
          {report.final_guidance?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default Report;