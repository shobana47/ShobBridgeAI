import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, FileText, Briefcase, BarChart2,
  MessageSquare, Bell, Settings, LogOut, Menu, X,
  GraduationCap, ChevronRight, TrendingUp, Target, Users, Building2
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const studentNav = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/student/dashboard' },
  { label: 'My Profile',     icon: User,            path: '/student/profile' },
  { label: 'Resume Analyzer',icon: FileText,        path: '/student/resume' },
  { label: 'Skill Gap',      icon: Target,          path: '/student/skill-gap' },
  { label: 'Companies',      icon: Briefcase,       path: '/student/companies' },
  { label: 'Mock Interview', icon: MessageSquare,   path: '/student/mock-interview' },
  { label: 'Analytics',      icon: TrendingUp,      path: '/student/analytics' },
  { label: 'Notifications',  icon: Bell,            path: '/student/notifications' },
];

const adminNav = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/admin' },
  { label: 'Students',       icon: Users,           path: '/admin/students' },
  { label: 'Companies',      icon: Building2,       path: '/admin/companies' },
  { label: 'Analytics',      icon: BarChart2,       path: '/admin/analytics' },
  { label: 'Notifications',  icon: Bell,            path: '/admin/notifications' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role === 'Admin' || user?.role === 'Placement Staff';
  const navItems = isAdmin ? adminNav : studentNav;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-[#0a1628] border-r border-slate-800/80 flex flex-col relative overflow-hidden shrink-0 shadow-xl"
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-white font-bold text-[15px] tracking-tight">PlaceAI</p>
                <p className="text-primary-400 text-[10px] font-medium">Placement Intelligence</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-all shrink-0">
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Role Badge ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="px-4 pt-4">
            <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg
              ${isAdmin ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-primary-500/10 text-primary-400 border border-primary-500/20'}`}>
              {isAdmin ? '⚡ Admin Portal' : '🎓 Student Portal'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <motion.div whileHover={{ x: collapsed ? 0 : 3 }} transition={{ duration: 0.15 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                  ${active
                    ? 'bg-primary-600/15 text-primary-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
                {/* Active indicator bar */}
                {active && (
                  <motion.div layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-400 rounded-r-full" />
                )}
                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1 truncate">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && active && (
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    {label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── User Footer ── */}
      <div className="border-t border-slate-800/80 p-3 mt-auto">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={handleLogout} title="Logout"
              className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
