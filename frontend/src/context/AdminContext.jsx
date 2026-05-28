import { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [errorStats, setErrorStats] = useState(null);
  const [errorActivity, setErrorActivity] = useState(null);

  const updateStats = useCallback((data) => {
    setStats(data);
    setErrorStats(null);
  }, []);

  const updateActivity = useCallback((data) => {
    setActivity(data);
    setErrorActivity(null);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        stats, setStats: updateStats,
        activity, setActivity: updateActivity,
        loadingStats, setLoadingStats,
        loadingActivity, setLoadingActivity,
        errorStats, setErrorStats,
        errorActivity, setErrorActivity,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminContext deve ser usado dentro de AdminProvider');
  return ctx;
}