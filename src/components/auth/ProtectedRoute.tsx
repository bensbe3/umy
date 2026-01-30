import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'editor' | 'super_admin';
  commissionId?: 'ir' | 'mp' | 'sd';
}

export function ProtectedRoute({
  children,
  requiredRole,
  commissionId,
}: ProtectedRouteProps) {
  const { user, appUser, loading, isEditor, isSuperAdmin, canAccessCommission } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#022c22',
        color: '#f5e6d3'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/cachepost" replace />;
  }

  if (requiredRole === 'editor' && !isEditor()) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: '#022c22',
        color: '#f5e6d3',
        padding: '2rem'
      }}>
        <h2>Access Denied</h2>
        <p>You need editor access to view this page.</p>
        <a href="/" style={{ color: '#0ea5e9' }}>Return to Home</a>
      </div>
    );
  }

  if (requiredRole === 'super_admin') {
    if (!isSuperAdmin()) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          background: '#022c22',
          color: '#f5e6d3',
          padding: '2rem'
        }}>
          <h2>Access Denied</h2>
          <p>You need super admin access to view this page.</p>
          <a href="/" style={{ color: '#0ea5e9' }}>Return to Home</a>
        </div>
      );
    }
    if (commissionId && !canAccessCommission(commissionId)) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          background: '#022c22',
          color: '#f5e6d3',
          padding: '2rem'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have access to this commission.</p>
          <a href="/" style={{ color: '#0ea5e9' }}>Return to Home</a>
        </div>
      );
    }
  }

  return <>{children}</>;
}
