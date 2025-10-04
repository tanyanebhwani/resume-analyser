import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#A8E6A3", "#F9A8A8"]; // Indigo, Purple

export default function SkilPie({ found, missing }) {
  const data = [
    { name: "Matched Skills", value: found.length },
    { name: "Missing Skills", value: missing.length },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-col items-center w-[500px]">
      <h2 className="text-lg font-semibold mb-3 text-indigo-700">Skill Match</h2>
      <PieChart width={200} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
