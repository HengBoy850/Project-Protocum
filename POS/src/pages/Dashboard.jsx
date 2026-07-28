
// // import React, { useEffect, useState } from "react";
// // import {
// //   Users,
// //   UserCheck,
// //   Clock,
// //   UserX,
// //   TrendingUp,
// // } from "lucide-react";

// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // import api from "../api/client";
// // import { useAuth } from "../context/AuthContext";

// // const COLORS = {
// //   present: "#10b981",
// //   late: "#f59e0b",
// //   absent: "#ef4444",
// // };

// // export default function Dashboard() {
// //   const [data, setData] = useState(null);
// //   const { user } = useAuth();

// //   useEffect(() => {
// //     api
// //       .get("/attendance/dashboard")
// //       .then((res) => setData(res.data))
// //       .catch(console.error);
// //   }, []);

// //   const cards = [
// //     {
// //       label: "Total Employees",
// //       value: data?.total,
// //       icon: Users,
// //       color:
// //         "bg-gradient-to-r from-slate-500 to-slate-700 text-white",
// //     },
// //     {
// //       label: "Present Today",
// //       value: data?.presentToday,
// //       icon: UserCheck,
// //       color:
// //         "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
// //     },
// //     {
// //       label: "Late Today",
// //       value: data?.lateToday,
// //       icon: Clock,
// //       color:
// //         "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
// //     },
// //     {
// //       label: "Absent Today",
// //       value: data?.absentToday,
// //       icon: UserX,
// //       color:
// //         "bg-gradient-to-r from-red-500 to-pink-500 text-white",
// //     },
// //   ];

// //   const donutData = data
// //     ? [
// //         {
// //           name: "Present",
// //           value: data.presentToday,
// //           color: COLORS.present,
// //         },
// //         {
// //           name: "Late",
// //           value: data.lateToday,
// //           color: COLORS.late,
// //         },
// //         {
// //           name: "Absent",
// //           value: data.absentToday,
// //           color: COLORS.absent,
// //         },
// //       ]
// //     : [];

// //   return (
// //     <div className="min-h-screen bg-slate-50 p-6">
// //       {/* Header */}
// //       <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
// //         <div>
// //           <h1 className="text-4xl font-bold text-slate-800">
// //             Welcome Back 👋
// //           </h1>

// //           <p className="text-slate-500 mt-2">
// //             Good morning,{" "}
// //             {user?.name?.split(" ")[0] || "Admin"}
// //           </p>
// //         </div>

// //         <div className="mt-4 lg:mt-0 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
// //           <p className="text-xs text-slate-500">
// //             Today's Date
// //           </p>

// //           <p className="font-semibold text-slate-800">
// //             {new Date().toLocaleDateString()}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Statistics Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
// //         {cards.map(({ label, value, icon: Icon, color }) => (
// //           <div
// //             key={label}
// //             className="
// //               relative
// //               overflow-hidden
// //               rounded-3xl
// //               border
// //               border-slate-200
// //               bg-white
// //               p-6
// //               shadow-sm
// //               hover:shadow-xl
// //               transition-all
// //               duration-300
// //             "
// //           >
// //             <div className="absolute top-5 right-5">
// //               <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600">
// //                 <TrendingUp size={12} />
// //                 +12%
// //               </span>
// //             </div>

// //             <div
// //               className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 ${color}`}
// //             >
// //               <Icon size={24} />
// //             </div>

// //             <p className="text-sm text-slate-500 mb-2">
// //               {label}
// //             </p>

// //             <p className="text-4xl font-bold text-slate-800">
// //               {value ?? "—"}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Charts */}
// //       <div className="grid lg:grid-cols-3 gap-6">
// //         {/* Line Chart */}
// //         <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //           <div className="mb-6">
// //             <h3 className="text-lg font-semibold text-slate-800">
// //               Attendance Overview
// //             </h3>

// //             <p className="text-sm text-slate-500">
// //               Weekly employee attendance trend
// //             </p>
// //           </div>

// //           <ResponsiveContainer width="100%" height={280}>
// //             <LineChart data={data?.weeklyTrend || []}>
// //               <XAxis
// //                 dataKey="day"
// //                 tick={{ fontSize: 12 }}
// //                 axisLine={false}
// //                 tickLine={false}
// //               />

// //               <YAxis
// //                 tick={{ fontSize: 12 }}
// //                 axisLine={false}
// //                 tickLine={false}
// //               />

// //               <Tooltip />

// //               <Line
// //                 type="monotone"
// //                 dataKey="count"
// //                 stroke="#10b981"
// //                 strokeWidth={4}
// //                 dot={{
// //                   r: 6,
// //                   strokeWidth: 2,
// //                   fill: "#10b981",
// //                 }}
// //                 activeDot={{
// //                   r: 8,
// //                 }}
// //               />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* Donut Chart */}
// //         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //           <div className="mb-4">
// //             <h3 className="text-lg font-semibold text-slate-800">
// //               Today's Summary
// //             </h3>

// //             <p className="text-sm text-slate-500">
// //               Attendance breakdown
// //             </p>
// //           </div>

// //           <div className="relative h-[250px]">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <PieChart>
// //                 <Pie
// //                   data={donutData}
// //                   dataKey="value"
// //                   innerRadius={65}
// //                   outerRadius={95}
// //                   paddingAngle={4}
// //                 >
// //                   {donutData.map((entry) => (
// //                     <Cell
// //                       key={entry.name}
// //                       fill={entry.color}
// //                     />
// //                   ))}
// //                 </Pie>
// //               </PieChart>
// //             </ResponsiveContainer>

// //             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
// //               <p className="text-4xl font-bold text-slate-800">
// //                 {data?.total ?? "—"}
// //               </p>

// //               <p className="text-sm text-slate-500">
// //                 Employees
// //               </p>
// //             </div>
// //           </div>

// //           <div className="space-y-3 mt-2">
// //             {donutData.map((item) => (
// //               <div
// //                 key={item.name}
// //                 className="flex items-center justify-between"
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <span
// //                     className="w-3 h-3 rounded-full"
// //                     style={{
// //                       backgroundColor: item.color,
// //                     }}
// //                   />

// //                   <span className="text-sm text-slate-600">
// //                     {item.name}
// //                   </span>
// //                 </div>

// //                 <span className="font-semibold text-slate-800">
// //                   {item.value}
// //                 </span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Statistics */}
// //       <div className="grid md:grid-cols-3 gap-6 mt-8">
// //         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //           <p className="text-sm text-slate-500">
// //             Attendance Rate
// //           </p>

// //           <p className="text-3xl font-bold text-slate-800 mt-2">
// //             {data?.total
// //               ? Math.round(
// //                   ((data.presentToday || 0) /
// //                     data.total) *
// //                     100
// //                 )
// //               : 0}
// //             %
// //           </p>
// //         </div>

// //         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //           <p className="text-sm text-slate-500">
// //             Total Departments
// //           </p>

// //           <p className="text-3xl font-bold text-slate-800 mt-2">
// //             {data?.departmentCount ?? 6}
// //           </p>
// //         </div>

// //         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //           <p className="text-sm text-slate-500">
// //             Active Employees
// //           </p>

// //           <p className="text-3xl font-bold text-slate-800 mt-2">
// //             {data?.presentToday ?? 0}
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { Users, UserCheck, Clock, UserX, TrendingUp } from "lucide-react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell,
// } from "recharts";
// import api from "../api/client";
// import { useAuth } from "../context/AuthContext";

// const COLORS = {
//   present: "#6366f1", // indigo
//   late: "#f59e0b",    // amber — keep semantic meaning distinct
//   absent: "#ef4444",  // red
// };

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     api.get("/attendance/dashboard").then((res) => setData(res.data)).catch(console.error);
//   }, []);

//   const cards = [
//     { label: "Total Employees", value: data?.total, icon: Users, color: "bg-gradient-to-r from-slate-700 to-slate-900 text-white" },
//     { label: "Present Today", value: data?.presentToday, icon: UserCheck, color: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" },
//     { label: "Late Today", value: data?.lateToday, icon: Clock, color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white" },
//     { label: "Absent Today", value: data?.absentToday, icon: UserX, color: "bg-gradient-to-r from-red-500 to-pink-500 text-white" },
//   ];

//   const donutData = data
//     ? [
//         { name: "Present", value: data.presentToday, color: COLORS.present },
//         { name: "Late", value: data.lateToday, color: COLORS.late },
//         { name: "Absent", value: data.absentToday, color: COLORS.absent },
//       ]
//     : [];

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between fade-in-up">
//         <div>
//           <h1 className="text-4xl font-bold text-slate-800">Welcome Back 👋</h1>
//           <p className="text-slate-500 mt-2">Good morning, {user?.name?.split(" ")[0] || "Admin"}</p>
//         </div>
//         <div className="mt-4 lg:mt-0 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
//           <p className="text-xs text-slate-500">Today's Date</p>
//           <p className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//         {cards.map(({ label, value, icon: Icon, color }, i) => (
//           <div
//             key={label}
//             style={{ animationDelay: `${i * 0.08}s` }}
//             className="fade-in-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
//           >
//             <div className="absolute top-5 right-5">
//               <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600">
//                 <TrendingUp size={12} /> +12%
//               </span>
//             </div>
//             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 ${color}`}>
//               <Icon size={24} />
//             </div>
//             <p className="text-sm text-slate-500 mb-2">{label}</p>
//             <p className="text-4xl font-bold text-slate-800">{value ?? "—"}</p>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.32s" }}>
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-slate-800">Attendance Overview</h3>
//             <p className="text-sm text-slate-500">Weekly employee attendance trend</p>
//           </div>
//           <ResponsiveContainer width="100%" height={280}>
//             <LineChart data={data?.weeklyTrend || []}>
//               <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="count"
//                 stroke="#6366f1"
//                 strokeWidth={4}
//                 dot={{ r: 6, strokeWidth: 2, fill: "#6366f1" }}
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.4s" }}>
//           <div className="mb-4">
//             <h3 className="text-lg font-semibold text-slate-800">Today's Summary</h3>
//             <p className="text-sm text-slate-500">Attendance breakdown</p>
//           </div>
//           <div className="relative h-[250px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={donutData} dataKey="value" innerRadius={65} outerRadius={95} paddingAngle={4}>
//                   {donutData.map((entry) => (
//                     <Cell key={entry.name} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <p className="text-4xl font-bold text-slate-800">{data?.total ?? "—"}</p>
//               <p className="text-sm text-slate-500">Employees</p>
//             </div>
//           </div>
//           <div className="space-y-3 mt-2">
//             {donutData.map((item) => (
//               <div key={item.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                   <span className="text-sm text-slate-600">{item.name}</span>
//                 </div>
//                 <span className="font-semibold text-slate-800">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Quick Statistics */}
//       <div className="grid md:grid-cols-3 gap-6 mt-8">
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.48s" }}>
//           <p className="text-sm text-slate-500">Attendance Rate</p>
//           <p className="text-3xl font-bold text-slate-800 mt-2">
//             {data?.total ? Math.round(((data.presentToday || 0) / data.total) * 100) : 0}%
//           </p>
//         </div>
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.55s" }}>
//           <p className="text-sm text-slate-500">Total Departments</p>
//           <p className="text-3xl font-bold text-slate-800 mt-2">{data?.departmentCount ?? 6}</p>
//         </div>
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.62s" }}>
//           <p className="text-sm text-slate-500">Active Employees</p>
//           <p className="text-3xl font-bold text-slate-800 mt-2">{data?.presentToday ?? 0}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, Clock, UserX, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

// Single, restrained palette. Present/Late/Absent stay semantically distinct;
// everything else is neutral so the data does the talking.
const COLORS = {
  present: "#5B5FEF",
  late: "#E3A008",
  absent: "#E1493F",
  trendLine: "#1F2328", // near-black line from the reference chart
  ink: "#14161B",
  muted: "#7A7F8A",
  border: "#E8E9EE",
};

function StatCard({ label, value, icon: Icon, tint, trend, delay }) {
  const isUp = trend?.direction === "up";
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className="fade-in-up group rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_rgba(20,22,27,0.15)]"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${tint}14`, color: tint }}
        >
          <Icon size={18} strokeWidth={2.25} />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-[13px] text-slate-500">{label}</p>
      <p className="mt-1 text-[28px] font-semibold tracking-tight text-slate-900 tabular-nums">
        {value ?? <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-100 align-middle" />}
      </p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-900/5">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800 tabular-nums">{payload[0].value} employees</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/attendance/dashboard").then((res) => setData(res.data)).catch(console.error);
  }, []);

  const donutData = useMemo(
    () =>
      data
        ? [
            { name: "Present", value: data.presentToday || 0, color: COLORS.present },
            { name: "Late", value: data.lateToday || 0, color: COLORS.late },
            { name: "Absent", value: data.absentToday || 0, color: COLORS.absent },
          ]
        : [],
    [data]
  );

  // Derive a real week-over-week trend instead of a hardcoded number.
  const weeklyTrend = data?.weeklyTrend || [];
  const trendDelta = useMemo(() => {
    if (weeklyTrend.length < 2) return null;
    const first = weeklyTrend[0].count;
    const last = weeklyTrend[weeklyTrend.length - 1].count;
    if (!first) return null;
    const pct = Math.round(((last - first) / first) * 100);
    return { direction: pct >= 0 ? "up" : "down", value: `${Math.abs(pct)}%` };
  }, [weeklyTrend]);

  const attendanceRate = data?.total ? Math.round(((data.presentToday || 0) / data.total) * 100) : 0;

  const cards = [
    { label: "Total employees", value: data?.total, icon: Users, tint: "#334155" },
    { label: "Present today", value: data?.presentToday, icon: UserCheck, tint: COLORS.present, trend: trendDelta },
    { label: "Late today", value: data?.lateToday, icon: Clock, tint: COLORS.late },
    { label: "Absent today", value: data?.absentToday, icon: UserX, tint: COLORS.absent },
  ];

  return (
    <div className="min-h-full bg-slate-50/60">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 fade-in-up lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Overview</p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-slate-900">
            Good morning, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here's how attendance looks today.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <p className="text-[11px] text-slate-400">Today</p>
          <p className="text-sm font-medium text-slate-800">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.06} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className="rounded-2xl border border-slate-200/80 bg-white p-6 fade-in-up lg:col-span-2"
          style={{ animationDelay: "0.24s" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Attendance this week</h3>
              <p className="text-sm text-slate-500">Employees marked present, by day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.trendLine} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={COLORS.trendLine} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: COLORS.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: COLORS.muted }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E8E9EE" }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS.trendLine}
                strokeWidth={1.75}
                fill="url(#presentFill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: COLORS.trendLine }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-2xl border border-slate-200/80 bg-white p-6 fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-[15px] font-semibold text-slate-900">Today's split</h3>
          <p className="mb-2 text-sm text-slate-500">Present, late and absent</p>
          <div className="relative h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={3} stroke="none">
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{attendanceRate}%</p>
              <p className="text-xs text-slate-500">attendance</p>
            </div>
          </div>
          <div className="mt-3 space-y-2.5 border-t border-slate-100 pt-4">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium text-slate-800 tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
