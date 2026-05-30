import { useEffect, useRef } from 'react';
import { adminService } from '../services/adminService';
import { useAdminContext } from '../context/AdminContext';

const POLL_INTERVAL = 30000;

export function useAdminStats() {
  const { setStats, setLoadingStats, setErrorStats } = useAdminContext();
  const intervalRef = useRef(null);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      setErrorStats(err?.response?.data?.message || 'Falha ao carregar estatísticas.');
    }
  };

  useEffect(() => {
    setLoadingStats(true);
    fetchStats().finally(() => setLoadingStats(false));

    intervalRef.current = setInterval(fetchStats, POLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);
}