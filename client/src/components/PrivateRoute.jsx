import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);

  console.log('🔒 [PrivateRoute] Checking access:', {
    hasUser: !!user,
    userRole: user?.role,
    allowedRoles,
    loading,
    path: window.location.pathname
  });

  if (loading) {
    console.log('⏳ [PrivateRoute] Still loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    console.warn('⚠️ [PrivateRoute] No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn('🚫 [PrivateRoute] Access denied:', {
      userRole: user.role,
      allowedRoles,
      redirecting: true
    });
    return <Navigate to="/" replace />;
  }

  console.log('✅ [PrivateRoute] Access granted');
  return children;
};

export default PrivateRoute;

