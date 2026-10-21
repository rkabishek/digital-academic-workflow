import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../ui/NotificationBell';
import {
  FileText,
  Clock,
  FolderGit2,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Copy,
  Check,
  GraduationCap,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyStaffCode = () => {
    if (user?.staffCode) {
      navigator.clipboard.writeText(user.staffCode);
      setCopiedCode(true);
      toast.success(`Staff Code ${user.staffCode} copied to clipboard!`);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Signed out successfully.');
  };

  // Student links
  const studentNav = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/documents', icon: FileText, label: 'My Documents' },
    { to: '/student/od-requests', icon: Clock, label: 'OD & Permissions' },
    { to: '/student/projects', icon: FolderGit2, label: 'Projects & Reviews' },
    { to: '/student/notes', icon: BookOpen, label: 'Notes Repository' },
    { to: '/student/certificates', icon: Award, label: 'Certificates' },
  ];

  // Staff links
  const staffNav = [
    { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/staff/documents', icon: FileText, label: 'Document Reviews' },
    { to: '/staff/od-requests', icon: Clock, label: 'OD & Leave Requests' },
    { to: '/staff/projects', icon: FolderGit2, label: 'Project Milestones' },
    { to: '/staff/notes', icon: BookOpen, label: 'Upload Materials' },
    { to: '/staff/certificates', icon: Award, label: 'Issue Certificates' },
  ];

  // Admin links
  const adminNav = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'System Overview' },
    { to: '/admin/users', icon: Users, label: 'User Directory' },
    { to: '/admin/documents', icon: FileText, label: 'Document Archive' },
    { to: '/admin/audit-logs', icon: ShieldCheck, label: 'Audit Trail' },
  ];

  const currentNav =
    user?.role === 'admin'
      ? adminNav
      : user?.role === 'staff'
      ? staffNav
      : studentNav;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
                AcadFlow
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium -mt-1">
                Academic Portal
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold flex items-center justify-center text-sm uppercase">
              {user?.name ? user.name.slice(0, 2) : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {user?.role}
                </span>
                {user?.department && (
                  <span className="text-[10px] text-slate-400 truncate">
                    {user.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Staff Code Display & Copy */}
          {user?.role === 'staff' && user.staffCode && (
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                  Staff Code
                </span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  {user.staffCode}
                </span>
              </div>
              <button
                type="button"
                onClick={copyStaffCode}
                title="Copy code for your students"
                className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Student Advisor Info */}
          {user?.role === 'student' && user.linkedStaffCode && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Advisor: <span className="font-mono font-medium">{user.linkedStaffCode}</span></span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title || 'Academic Management Portal'}
            </h1>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationBell />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <span className="block text-xs font-medium text-slate-900 dark:text-slate-100">
                  {user?.name}
                </span>
                <span className="block text-[10px] text-slate-400 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
