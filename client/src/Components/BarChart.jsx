import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function MissingBarChart({ missing }) {
  const data = missing.map(skill => ({ skill, count: 1 }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3 text-indigo-700">Missing Skills</h2>
      <BarChart width={400} height={250} data={data}>
        <XAxis dataKey="skill" />
        <YAxis hide />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#a78bfa" />
      </BarChart>
    </div>
  );
}
