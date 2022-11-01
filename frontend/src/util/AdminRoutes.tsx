import { Outlet, Navigate } from 'react-router-dom';
import { useAuth, authType } from '../context/AuthContext';
const AdminRoutes = () => {
  const { role }: authType = useAuth();
  return role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
