
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { Home, Calendar, User } from 'lucide-react';

// const tabs = [
//   { to: '/', label: 'Home', icon: Home, end: true },
//   { to: '/history', label: 'History', icon: Calendar },
//   { to: '/profile', label: 'Profile', icon: User },
// ];

// export default function BottomNav() {
//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] flex max-w-md mx-auto">
//       {tabs.map(({ to, label, icon: Icon, end }) => (
//         <NavLink
//           key={to}
//           to={to}
//           end={end}
//           className="flex-1 flex flex-col items-center gap-1 py-2.5"
//         >
//           {({ isActive }) => (
//             <>
//               <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-sky-50' : ''}`}>
//                 <Icon size={19} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
//               </div>
//               <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
//                 {label}
//               </span>
//             </>
//           )}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { Home, Calendar, User } from 'lucide-react';

// const tabs = [
//   { to: '/', label: 'Home', icon: Home, end: true },
//   { to: '/history', label: 'History', icon: Calendar },
//   { to: '/profile', label: 'Profile', icon: User },
// ];

// export default function BottomNav() {
//   return (
//     <nav className="fixed bottom-3 left-3 right-3 bg-[#FDF8F0] rounded-2xl shadow-xl shadow-black/25 flex max-w-md mx-auto">
//       {tabs.map(({ to, label, icon: Icon, end }) => (
//         <NavLink
//           key={to}
//           to={to}
//           end={end}
//           className="flex-1 flex flex-col items-center gap-1 py-2.5"
//         >
//           {({ isActive }) => (
//             <>
//               <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#FF6452]' : ''}`}>
//                 <Icon size={18} className={isActive ? 'text-[#FDF8F0]' : 'text-[#6B6558]'} />
//               </div>
//               <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-[#FF6452]' : 'text-[#6B6558]'}`}>
//                 {label}
//               </span>
//             </>
//           )}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { Home, Calendar, User } from 'lucide-react';

// const tabs = [
//   { to: '/', label: 'Home', icon: Home, end: true },
//   { to: '/history', label: 'History', icon: Calendar },
//   { to: '/profile', label: 'Profile', icon: User },
// ];

// export default function BottomNav() {
//   return (
//     <nav className="fixed bottom-3 left-3 right-3 bg-white rounded-2xl shadow-xl shadow-black/10 flex max-w-md mx-auto">
//       {tabs.map(({ to, label, icon: Icon, end }) => (
//         <NavLink
//           key={to}
//           to={to}
//           end={end}
//           className="flex-1 flex flex-col items-center gap-1 py-3"
//         >
//           {({ isActive }) => (
//             <>
//               <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#6C63FF]' : ''}`}>
//                 <Icon size={18} className={isActive ? 'text-white' : 'text-[#B4B0C9]'} />
//               </div>
//               <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-[#6C63FF]' : 'text-[#B4B0C9]'}`}>
//                 {label}
//               </span>
//             </>
//           )}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }


import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, User } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/history', label: 'History', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 mx-auto flex max-w-md rounded-2xl bg-white shadow-xl shadow-[#47546D]/10">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className="flex flex-1 flex-col items-center gap-1 py-3">
          {({ isActive }) => (
            <>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'bg-[#7158F6]' : ''
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-[#A5AAB8]'} />
              </div>
              <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-[#7158F6]' : 'text-[#A5AAB8]'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
