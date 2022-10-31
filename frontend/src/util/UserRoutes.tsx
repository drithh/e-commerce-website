import { Outlet, Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
const UserRoutes = () => {
  const { role }: any = useRole();
  return role === 'user' || role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default UserRoutes;
