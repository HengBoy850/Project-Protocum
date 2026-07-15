
// import React, { useEffect, useState } from "react";
// import {
//   Users,
//   UserCheck,
//   Clock,
//   UserX,
//   TrendingUp,
// } from "lucide-react";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// import api from "../api/client";
// import { useAuth } from "../context/AuthContext";

// const COLORS = {
//   present: "#10b981",
//   late: "#f59e0b",
//   absent: "#ef4444",
// };

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     api
//       .get("/attendance/dashboard")
//       .then((res) => setData(res.data))
//       .catch(console.error);
//   }, []);

//   const cards = [
//     {
//       label: "Total Employees",
//       value: data?.total,
//       icon: Users,
//       color:
//         "bg-gradient-to-r from-slate-500 to-slate-700 text-white",
//     },
//     {
//       label: "Present Today",
//       value: data?.presentToday,
//       icon: UserCheck,
//       color:
//         "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
//     },
//     {
//       label: "Late Today",
//       value: data?.lateToday,
//       icon: Clock,
//       color:
//         "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
//     },
//     {
//       label: "Absent Today",
//       value: data?.absentToday,
//       icon: UserX,
//       color:
//         "bg-gradient-to-r from-red-500 to-pink-500 text-white",
//     },
//   ];

//   const donutData = data
//     ? [
//         {
//           name: "Present",
//           value: data.presentToday,
//           color: COLORS.present,
//         },
//         {
//           name: "Late",
//           value: data.lateToday,
//           color: COLORS.late,
//         },
//         {
//           name: "Absent",
//           value: data.absentToday,
//           color: COLORS.absent,
//         },
//       ]
//     : [];

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header */}
//       <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-4xl font-bold text-slate-800">
//             Welcome Back 👋
//           </h1>

//           <p className="text-slate-500 mt-2">
//             Good morning,{" "}
//             {user?.name?.split(" ")[0] || "Admin"}
//           </p>
//         </div>

//         <div className="mt-4 lg:mt-0 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
//           <p className="text-xs text-slate-500">
//             Today's Date
//           </p>

//           <p className="font-semibold text-slate-800">
//             {new Date().toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//         {cards.map(({ label, value, icon: Icon, color }) => (
//           <div
//             key={label}
//             className="
//               relative
//               overflow-hidden
//               rounded-3xl
//               border
//               border-slate-200
//               bg-white
//               p-6
//               shadow-sm
//               hover:shadow-xl
//               transition-all
//               duration-300
//             "
//           >
//             <div className="absolute top-5 right-5">
//               <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600">
//                 <TrendingUp size={12} />
//                 +12%
//               </span>
//             </div>

//             <div
//               className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 ${color}`}
//             >
//               <Icon size={24} />
//             </div>

//             <p className="text-sm text-slate-500 mb-2">
//               {label}
//             </p>

//             <p className="text-4xl font-bold text-slate-800">
//               {value ?? "—"}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Line Chart */}
//         <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-slate-800">
//               Attendance Overview
//             </h3>

//             <p className="text-sm text-slate-500">
//               Weekly employee attendance trend
//             </p>
//           </div>

//           <ResponsiveContainer width="100%" height={280}>
//             <LineChart data={data?.weeklyTrend || []}>
//               <XAxis
//                 dataKey="day"
//                 tick={{ fontSize: 12 }}
//                 axisLine={false}
//                 tickLine={false}
//               />

//               <YAxis
//                 tick={{ fontSize: 12 }}
//                 axisLine={false}
//                 tickLine={false}
//               />

//               <Tooltip />

//               <Line
//                 type="monotone"
//                 dataKey="count"
//                 stroke="#10b981"
//                 strokeWidth={4}
//                 dot={{
//                   r: 6,
//                   strokeWidth: 2,
//                   fill: "#10b981",
//                 }}
//                 activeDot={{
//                   r: 8,
//                 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Donut Chart */}
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4">
//             <h3 className="text-lg font-semibold text-slate-800">
//               Today's Summary
//             </h3>

//             <p className="text-sm text-slate-500">
//               Attendance breakdown
//             </p>
//           </div>

//           <div className="relative h-[250px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={donutData}
//                   dataKey="value"
//                   innerRadius={65}
//                   outerRadius={95}
//                   paddingAngle={4}
//                 >
//                   {donutData.map((entry) => (
//                     <Cell
//                       key={entry.name}
//                       fill={entry.color}
//                     />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>

//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <p className="text-4xl font-bold text-slate-800">
//                 {data?.total ?? "—"}
//               </p>

//               <p className="text-sm text-slate-500">
//                 Employees
//               </p>
//             </div>
//           </div>

//           <div className="space-y-3 mt-2">
//             {donutData.map((item) => (
//               <div
//                 key={item.name}
//                 className="flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-2">
//                   <span
//                     className="w-3 h-3 rounded-full"
//                     style={{
//                       backgroundColor: item.color,
//                     }}
//                   />

//                   <span className="text-sm text-slate-600">
//                     {item.name}
//                   </span>
//                 </div>

//                 <span className="font-semibold text-slate-800">
//                   {item.value}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Quick Statistics */}
//       <div className="grid md:grid-cols-3 gap-6 mt-8">
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="text-sm text-slate-500">
//             Attendance Rate
//           </p>

//           <p className="text-3xl font-bold text-slate-800 mt-2">
//             {data?.total
//               ? Math.round(
//                   ((data.presentToday || 0) /
//                     data.total) *
//                     100
//                 )
//               : 0}
//             %
//           </p>
//         </div>

//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="text-sm text-slate-500">
//             Total Departments
//           </p>

//           <p className="text-3xl font-bold text-slate-800 mt-2">
//             {data?.departmentCount ?? 6}
//           </p>
//         </div>

//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="text-sm text-slate-500">
//             Active Employees
//           </p>

//           <p className="text-3xl font-bold text-slate-800 mt-2">
//             {data?.presentToday ?? 0}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Users, UserCheck, Clock, UserX, TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  present: "#6366f1", // indigo
  late: "#f59e0b",    // amber — keep semantic meaning distinct
  absent: "#ef4444",  // red
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/attendance/dashboard").then((res) => setData(res.data)).catch(console.error);
  }, []);

  const cards = [
    { label: "Total Employees", value: data?.total, icon: Users, color: "bg-gradient-to-r from-slate-700 to-slate-900 text-white" },
    { label: "Present Today", value: data?.presentToday, icon: UserCheck, color: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" },
    { label: "Late Today", value: data?.lateToday, icon: Clock, color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white" },
    { label: "Absent Today", value: data?.absentToday, icon: UserX, color: "bg-gradient-to-r from-red-500 to-pink-500 text-white" },
  ];

  const donutData = data
    ? [
        { name: "Present", value: data.presentToday, color: COLORS.present },
        { name: "Late", value: data.lateToday, color: COLORS.late },
        { name: "Absent", value: data.absentToday, color: COLORS.absent },
      ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between fade-in-up">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Welcome Back 👋</h1>
          <p className="text-slate-500 mt-2">Good morning, {user?.name?.split(" ")[0] || "Admin"}</p>
        </div>
        <div className="mt-4 lg:mt-0 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
          <p className="text-xs text-slate-500">Today's Date</p>
          <p className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color }, i) => (
          <div
            key={label}
            style={{ animationDelay: `${i * 0.08}s` }}
            className="fade-in-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute top-5 right-5">
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600">
                <TrendingUp size={12} /> +12%
              </span>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 ${color}`}>
              <Icon size={24} />
            </div>
            <p className="text-sm text-slate-500 mb-2">{label}</p>
            <p className="text-4xl font-bold text-slate-800">{value ?? "—"}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.32s" }}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Attendance Overview</h3>
            <p className="text-sm text-slate-500">Weekly employee attendance trend</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.weeklyTrend || []}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={4}
                dot={{ r: 6, strokeWidth: 2, fill: "#6366f1" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Today's Summary</h3>
            <p className="text-sm text-slate-500">Attendance breakdown</p>
          </div>
          <div className="relative h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-4xl font-bold text-slate-800">{data?.total ?? "—"}</p>
              <p className="text-sm text-slate-500">Employees</p>
            </div>
          </div>
          <div className="space-y-3 mt-2">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.48s" }}>
          <p className="text-sm text-slate-500">Attendance Rate</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {data?.total ? Math.round(((data.presentToday || 0) / data.total) * 100) : 0}%
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.55s" }}>
          <p className="text-sm text-slate-500">Total Departments</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{data?.departmentCount ?? 6}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm fade-in-up" style={{ animationDelay: "0.62s" }}>
          <p className="text-sm text-slate-500">Active Employees</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{data?.presentToday ?? 0}</p>
        </div>
      </div>
    </div>
  );
}