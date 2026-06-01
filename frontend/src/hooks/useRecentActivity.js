import { useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminContext } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

export function useRecentActivity() {
  const { setActivity, setLoadingActivity, setErrorActivity } = useAdminContext();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') return;

    setLoadingActivity(true);
    adminService
      .getRecentActivity()
      .then((data) => setActivity(Array.isArray(data) ? data : []))
      .catch((err) =>
        setErrorActivity(err?.response?.data?.message || 'Falha ao carregar atividades.')
      )
      .finally(() => setLoadingActivity(false));
  }, [user]);
}