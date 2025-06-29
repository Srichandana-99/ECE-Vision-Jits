import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Users, FileText, Bell, Newspaper, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard />, path: '/admin' },
  { label: 'Users', icon: <Users />, path: '/admin/users' },
  { label: 'Projects', icon: <FileText />, path: '/admin/projects' },
  { label: 'Notifications', icon: <Bell />, path: '/admin/notifications' },
  { label: 'News', icon: <Newspaper />, path: '/admin/news' },
];

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { user, signOut, getUserRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return; // Wait for user to load
      try {
        const role = await getUserRole(user.id);
        if (role !== 'admin') {
          setIsAdmin(false);
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      }
    };

    checkAdminAccess();
  }, [user, navigate, getUserRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading spinner if user or isAdmin is not loaded
  if (!user || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect if user is loaded and not admin
  if (isAdmin === false) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between py-6 px-4 fixed h-full z-20 border-r border-gray-200 shadow">
        <div>
          <div className="mb-8 flex items-center gap-3 px-2">
            <User className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Admin Panel</span>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-blue-50 hover:text-blue-700 ${location.pathname.startsWith(item.path) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 mb-2">
            <User className="h-6 w-6 text-gray-400" />
            <span className="text-sm font-semibold">{user?.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-red-600 hover:bg-red-50 hover:text-red-700 transition font-medium"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-blue-600">
            {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Admin'}
          </h1>
        </header>
        <main className="p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
} 