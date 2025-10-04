import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ReadabilityChart({ readability }) {
  const metrics = ["auto_RI","coleman_RI","dale_s","kincaid_g","read_ease","gun_fog","std"];
  const data = Object.entries(readability).map(([metric, value],idx) => ({
    metric: metrics[idx] || metric,
    score: parseFloat(value),
    }
  ));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4 mr-2">
      <h2 className="text-lg font-semibold mb-3 text-indigo-700">Readability Scores</h2>
      <BarChart width={700} height={400} data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <XAxis dataKey="metric" angle={-30} textAnchor="end" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend/>
        <Bar dataKey="score" fill="#4f46e5"/>
      </BarChart>
    </div>
  );
}
