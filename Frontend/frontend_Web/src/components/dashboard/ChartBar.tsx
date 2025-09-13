"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Marcela", horas: 120 },
  { name: "J. Carlos", horas: 160 },
  { name: "Lidia", horas: 180 },
  { name: "Juan C.", horas: 200 },
  { name: "Nuri", horas: 100 },
  { name: "Anny", horas: 140 },
];

export default function ChartBar() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Horas a la semana</h2>
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Bar dataKey="horas" fill="#8884d8" radius={[6, 6, 0, 0]} />
      </BarChart>
    </div>
  );
}
