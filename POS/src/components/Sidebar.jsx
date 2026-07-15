
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   ClipboardCheck,
//   CalendarClock,
//   Building2,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ShieldCheck,
// } from "lucide-react";

// import { useAuth } from "../context/AuthContext";
// import { usePendingCounts } from "../hooks/usePendingCounts";

// function Badge({ count }) {
//   if (!count) return null;

//   return (
//     <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold shadow-sm">
//       {count > 99 ? "99+" : count}
//     </span>
//   );
// }

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);

//   const { user, logout } = useAuth();
//   const { staffPending, adminPending } = usePendingCounts();

//   const initials =
//     user?.name
//       ?.split(" ")
//       .map((p) => p[0])
//       .join("")
//       .toUpperCase() || "?";

//   const groups = [
//     {
//       label: "MAIN",
//       links: [
//         {
//           to: "/",
//           label: "Dashboard",
//           icon: LayoutDashboard,
//           end: true,
//         },
//       ],
//     },
//     {
//       label: "STAFF",
//       links: [
//         {
//           to: "/requests",
//           label: "Account Requests",
//           icon: ClipboardCheck,
//           badge: staffPending,
//         },
//         {
//           to: "/staff",
//           label: "Staff Management",
//           icon: Users,
//         },
//         {
//           to: "/attendance",
//           label: "Attendance Records",
//           icon: CalendarClock,
//         },
//         {
//           to: "/departments",
//           label: "Departments",
//           icon: Building2,
//         },
//       ],
//     },
//     {
//       label: "ADMIN",
//       links: [
//         {
//           to: "/admin-accounts",
//           label: "Admin Accounts",
//           icon: ShieldCheck,
//           superAdminOnly: true,
//           badge: adminPending,
//         },
//       ],
//     },
//   ];

//   return (
//     <aside
//       className={`
//         relative
//         shrink-0
//         h-screen
//         flex
//         flex-col
//         justify-between
//         border-r
//         border-slate-200
//         bg-gradient-to-b
//         from-white
//         via-white
//         to-emerald-50/60
//         shadow-xl
//         transition-all
//         duration-300
//         ${collapsed ? "w-[90px] px-3" : "w-72 px-5"}
//       `}
//     >
//       {/* Toggle Button */}
//       <button
//         onClick={() => setCollapsed((v) => !v)}
//         className="
//           absolute
//           -right-4
//           top-24
//           z-20
//           flex
//           h-8
//           w-8
//           items-center
//           justify-center
//           rounded-full
//           border
//           border-slate-200
//           bg-white
//           shadow-lg
//           hover:border-emerald-300
//           hover:text-emerald-600
//           transition-all
//         "
//       >
//         <ChevronLeft
//           size={16}
//           className={`transition-transform ${
//             collapsed ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {/* Top */}
//       <div className="overflow-y-auto">
//         {/* Brand */}
//         <div
//           className={`mb-10 mt-2 flex items-center ${
//             collapsed ? "justify-center" : "gap-3"
//           }`}
//         >
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200">
//             <ClipboardCheck className="text-white" size={22} />
//           </div>

//           {!collapsed && (
//             <div>
//               <h1 className="text-xl font-bold text-slate-800">
//                 StaffSync
//               </h1>
//               <p className="text-xs text-slate-500">
//                 Employee Management
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav className="space-y-6">
//           {groups.map((group) => {
//             const visibleLinks = group.links.filter(
//               (link) =>
//                 !link.superAdminOnly ||
//                 user?.role === "super_admin"
//             );

//             if (!visibleLinks.length) return null;

//             return (
//               <div key={group.label}>
//                 {!collapsed && (
//                   <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-slate-400">
//                     {group.label}
//                   </p>
//                 )}

//                 <div className="space-y-1.5">
//                   {visibleLinks.map(
//                     ({
//                       to,
//                       label,
//                       icon: Icon,
//                       end,
//                       badge,
//                     }) => (
//                       <NavLink
//                         key={to}
//                         to={to}
//                         end={end}
//                         title={collapsed ? label : undefined}
//                         className={({ isActive }) =>
//                           `
//                           flex
//                           items-center
//                           gap-3
//                           px-3
//                           py-3
//                           rounded-xl
//                           text-sm
//                           font-medium
//                           transition-all
//                           duration-300

//                           ${
//                             isActive
//                               ? `
//                               bg-gradient-to-r
//                               from-emerald-500
//                               to-teal-500
//                               text-white
//                               shadow-lg
//                               shadow-emerald-200
//                             `
//                               : `
//                               text-slate-600
//                               hover:bg-white
//                               hover:shadow-md
//                               hover:translate-x-1
//                             `
//                           }

//                           ${
//                             collapsed
//                               ? "justify-center"
//                               : ""
//                           }
//                         `
//                         }
//                       >
//                         <Icon
//                           size={19}
//                           className="shrink-0"
//                         />

//                         {!collapsed && (
//                           <>
//                             <span>{label}</span>
//                             <Badge count={badge} />
//                           </>
//                         )}
//                       </NavLink>
//                     )
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Bottom */}
//       <div className="pb-3">
//         {/* Settings */}
//         <div className="border-t border-slate-200 pt-4 space-y-1.5">
//           <NavLink
//             to="/settings"
//             className={({ isActive }) =>
//               `
//               flex
//               items-center
//               gap-3
//               px-3
//               py-3
//               rounded-xl
//               text-sm
//               font-medium
//               transition-all
//               duration-300

//               ${
//                 isActive
//                   ? `
//                     bg-gradient-to-r
//                     from-emerald-500
//                     to-teal-500
//                     text-white
//                     shadow-lg
//                   `
//                   : `
//                     text-slate-600
//                     hover:bg-white
//                     hover:shadow-md
//                   `
//               }

//               ${collapsed ? "justify-center" : ""}
//             `
//             }
//           >
//             <Settings size={19} />
//             {!collapsed && <span>Settings</span>}
//           </NavLink>

//           <button
//             onClick={logout}
//             className={`
//               flex
//               items-center
//               gap-3
//               px-3
//               py-3
//               rounded-xl
//               text-sm
//               font-medium
//               text-red-500
//               hover:bg-red-50
//               transition-all
//               duration-300
//               w-full
//               ${
//                 collapsed
//                   ? "justify-center"
//                   : ""
//               }
//             `}
//           >
//             <LogOut size={19} />
//             {!collapsed && <span>Logout</span>}
//           </button>
//         </div>

//         {/* User Card */}
//         <div
//           className={`
//             mt-4
//             rounded-2xl
//             border
//             border-emerald-100
//             bg-white
//             shadow-sm
//             p-3

//             ${
//               collapsed
//                 ? "flex justify-center"
//                 : ""
//             }
//           `}
//         >
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md">
//               {initials}
//             </div>

//             {!collapsed && (
//               <div className="min-w-0">
//                 <p className="truncate font-semibold text-slate-800">
//                   {user?.name}
//                 </p>

//                 <p className="truncate text-xs text-slate-500 capitalize">
//                   {user?.role?.replace("_", " ")}
//                 </p>

//                 <div className="mt-1 flex items-center gap-1">
//                   <div className="h-2 w-2 rounded-full bg-green-500"></div>

//                   <span className="text-[10px] text-slate-500">
//                     Online
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarClock,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { usePendingCounts } from "../hooks/usePendingCounts";

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { staffPending, adminPending } = usePendingCounts();

  const initials =
    user?.name?.split(" ").map((p) => p[0]).join("").toUpperCase() || "?";

  const groups = [
    {
      label: "MAIN",
      links: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true }],
    },
    {
      label: "STAFF",
      links: [
        { to: "/requests", label: "Account Requests", icon: ClipboardCheck, badge: staffPending },
        { to: "/staff", label: "Staff Management", icon: Users },
        { to: "/attendance", label: "Attendance Records", icon: CalendarClock },
        { to: "/departments", label: "Departments", icon: Building2 },
      ],
    },
    {
      label: "ADMIN",
      links: [
        { to: "/admin-accounts", label: "Admin Accounts", icon: ShieldCheck, superAdminOnly: true, badge: adminPending },
      ],
    },
  ];

  // flat index across all visible links, used to stagger the entrance animation
  let linkIndex = 0;

  return (
    <aside
      className={`
        relative shrink-0 sticky top-0 h-screen flex flex-col justify-between
        border-r border-slate-800/60
        bg-gradient-to-b from-[#12131f] via-[#171a2b] to-[#0f1019]
        shadow-2xl transition-all duration-300
        ${collapsed ? "w-[90px] px-3" : "w-72 px-5"}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="
          absolute -right-4 top-24 z-20 flex h-8 w-8 items-center justify-center
          rounded-full border border-slate-700 bg-[#1a1c2e] text-slate-300 shadow-lg
          hover:border-indigo-400 hover:text-indigo-300 transition-all
        "
      >
        <ChevronLeft size={16} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Top */}
      <div className="overflow-y-auto">
        {/* Brand */}
        <div className={`mb-10 mt-2 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-900/50">
            <ClipboardCheck className="text-white" size={22} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">StaffSync</h1>
              <p className="text-xs text-slate-400">Employee Management</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          {groups.map((group) => {
            const visibleLinks = group.links.filter(
              (link) => !link.superAdminOnly || user?.role === "super_admin"
            );
            if (!visibleLinks.length) return null;

            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                    {group.label}
                  </p>
                )}

                <div className="space-y-1.5">
                  {visibleLinks.map(({ to, label, icon: Icon, end, badge }) => {
                    const delay = linkIndex * 0.05;
                    linkIndex += 1;
                    return (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        title={collapsed ? label : undefined}
                        style={{ animationDelay: `${delay}s` }}
                        className={({ isActive }) => `
                          nav-item-enter
                          flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                          transition-all duration-300
                          ${isActive
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-900/40"
                            : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                          }
                          ${collapsed ? "justify-center" : ""}
                        `}
                      >
                        <Icon size={19} className="shrink-0" />
                        {!collapsed && (
                          <>
                            <span>{label}</span>
                            <Badge count={badge} />
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="pb-3">
        <div className="border-t border-slate-800 pt-4 space-y-1.5">
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
              transition-all duration-300
              ${isActive
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <Settings size={19} />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
              text-red-400 hover:bg-red-500/10 hover:text-red-300
              transition-all duration-300 w-full
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={19} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* User Card */}
        <div
          className={`
            mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm p-3
            ${collapsed ? "flex justify-center" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold shadow-md">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-400 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] text-slate-400">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}