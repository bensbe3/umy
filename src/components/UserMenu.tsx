import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Shield, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import './UserMenu.css';

export function UserMenu() {
  const { user, appUser, signOut } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  if (!user) {
    return null; // Don't show anything when not logged in
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home after sign out
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getRoleDisplay = () => {
    if (appUser?.role === 'super_admin') {
      if (appUser.commissions_role === 'full') return 'Super Admin';
      const commissionNames: Record<string, string> = {
        ir: 'IR Admin',
        mp: 'MP Admin',
        sd: 'SD Admin',
      };
      return commissionNames[appUser.commissions_role || ''] || 'Super Admin';
    }
    if (appUser?.role === 'editor') return 'Editor';
    return 'Member';
  };

  const getRoleColor = () => {
    if (appUser?.role === 'super_admin') {
      if (appUser.commissions_role === 'full') return '#d4af37'; // Gold
      const colors: Record<string, string> = {
        ir: '#0ea5e9', // Blue
        mp: '#8B0000', // Red
        sd: '#2d7a3e', // Green
      };
      return colors[appUser.commissions_role || ''] || '#d4af37';
    }
    if (appUser?.role === 'editor') return '#8b5cf6'; // Purple
    return '#6b7280'; // Gray
  };

  const getInitials = () => {
    if (user.email) {
      const parts = user.email.split('@')[0].split('.');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div 
        className="user-menu-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="user-avatar">
          {getInitials()}
        </div>
        <div className="user-menu-info">
          <div className="user-email">{user.email}</div>
          {appUser && (
            <div className="user-role-badge" style={{ color: getRoleColor() }}>
              <Shield size={12} />
              {getRoleDisplay()}
            </div>
          )}
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isExpanded && (
        <div className="user-menu-panel">
          <div className="user-menu-header">
            <div className="user-avatar-large">
              {getInitials()}
            </div>
            <div className="user-details">
              <div className="user-email-large">{user.email}</div>
              {appUser && (
                <div className="user-role-large" style={{ color: getRoleColor() }}>
                  <Shield size={14} />
                  {getRoleDisplay()}
                </div>
              )}
            </div>
          </div>

          <div className="user-menu-divider"></div>

          <div className="user-menu-links">
            <Link 
              to="/a8f4e2c9d7b1" 
              className="user-menu-link"
              onClick={() => setIsExpanded(false)}
            >
              <FileText size={18} />
              <span>Admin Panel</span>
            </Link>
            <Link 
              to="/decryptmundi" 
              className="user-menu-link"
              onClick={() => setIsExpanded(false)}
            >
              <FileText size={18} />
              <span>DecryptMundi</span>
            </Link>
          </div>

          <div className="user-menu-divider"></div>

          <button 
            onClick={handleSignOut} 
            className="user-menu-signout"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
