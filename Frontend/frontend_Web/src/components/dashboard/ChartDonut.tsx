"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Maria Luz", value: 26 },
  { name: "Juan Camilo", value: 28 },
  { name: "Anny", value: 27 },
  { name: "Marcela", value: 30 },
];

const COLORS = ["#111827", "#93C5FD", "#86EFAC", "#A5B4FC"]; // negro, azul claro, verde, lila

export default function ChartDonut() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Horas de Profesores</h2>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut */}
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda personalizada */}
        <ul className="w-full md:w-56 space-y-4">
          {data.map((item, i) => (
            <li
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
