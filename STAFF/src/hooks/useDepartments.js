import { useEffect, useState } from 'react';
import api from '../api/client';

export function useDepartments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data)).catch(() => setDepartments([]));
  }, []);

  return departments;
}
