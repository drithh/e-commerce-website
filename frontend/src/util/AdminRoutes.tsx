import { Outlet, Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
const AdminRoutes = () => {
  const { role }: any = useRole();
  return role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
