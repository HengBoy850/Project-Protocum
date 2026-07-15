import React from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  // Changing the `key` remounts the div on every route change,
  // which replays the CSS animation automatically.
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}