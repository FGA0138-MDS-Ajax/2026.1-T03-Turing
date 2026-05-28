import { useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminContext } from '../context/AdminContext';

export function useRecentActivity() {
  const { setActivity, setLoadingActivity, setErrorActivity } = useAdminContext();

  useEffect(() => {
    setLoadingActivity(true);
    adminService
      .getRecentActivity()
      .then((data) => setActivity(data))
      .catch((err) =>
        setErrorActivity(err?.response?.data?.message || 'Falha ao carregar atividades.')
      )
      .finally(() => setLoadingActivity(false));
  }, []);
}