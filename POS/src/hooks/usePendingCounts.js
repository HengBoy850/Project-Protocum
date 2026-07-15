import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL_MS = 15000;

// Polls both pending queues and returns live counts for sidebar badges.
// This is what makes new requests "just appear" without anyone hitting refresh.
export function usePendingCounts() {
  const [counts, setCounts] = useState({ staffPending: 0, adminPending: 0 });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const staffRes = await api.get('/staff', { params: { status: 'pending' } });
        let adminPending = 0;
        if (user.role === 'super_admin') {
          const adminRes = await api.get('/admin-users', { params: { status: 'pending' } });
          adminPending = adminRes.data.length;
        }
        setCounts({ staffPending: staffRes.data.length, adminPending });
      } catch {
        // Silently skip a failed poll — don't spam errors for a background refresh
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user]);

  return counts;
}
