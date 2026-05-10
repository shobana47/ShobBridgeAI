import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, CheckCheck } from 'lucide-react';

const mockNotifications = [
  { _id: '1', title: 'TCS Campus Drive', message: 'TCS has opened registrations. Apply before June 15th.', type: 'Alert', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { _id: '2', title: 'Resume Score Updated', message: 'Your ATS score has been recalculated to 82%.', type: 'Success', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { _id: '3', title: 'Profile Incomplete', message: 'Complete your profile to unlock more company recommendations.', type: 'Warning', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { _id: '4', title: 'Mock Interview Result', message: 'Your HR mock interview scored 74%. Great communication!', type: 'Info', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { _id: '5', title: 'Infosys Shortlisted', message: 'Congratulations! You are shortlisted for Infosys Round 2.', type: 'Success', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
];

const typeConfig = {
  Alert:   { Icon: AlertCircle,   bg: 'bg-red-500/10',    border: 'border-red-500/20',    iconColor: 'text-red-400' },
  Success: { Icon: CheckCircle,   bg: 'bg-green-500/10',  border: 'border-green-500/20',  iconColor: 'text-green-400' },
  Warning: { Icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', iconColor: 'text-yellow-400' },
  Info:    { Icon: Info,          bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   iconColor: 'text-blue-400' },
};

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
};

const Notifications = () => {
  const [notifs, setNotifs] = useState(mockNotifications);
  const unread = notifs.filter(n => !n.isRead).length;

  const markAll = () => setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  const markOne = (id) => setNotifs(notifs.map(n => n._id === id ? { ...n, isRead: true } : n));

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-amber-400" /> Notifications
            {unread > 0 && (
              <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">{unread}</span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Stay updated with your placement activities</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 bg-primary-600/10 border border-primary-500/20 px-3 py-2 rounded-xl transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </motion.div>

      <div className="space-y-3">
        {notifs.map(({ _id, title, message, type, isRead, createdAt }, i) => {
          const { Icon, bg, border, iconColor } = typeConfig[type] || typeConfig.Info;
          return (
            <motion.div key={_id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => markOne(_id)}
              className={`glass-card rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all
                hover:border-slate-600 ${!isRead ? 'border-slate-600' : 'opacity-70'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} border ${border}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-semibold ${!isRead ? 'text-white' : 'text-slate-300'}`}>{title}</h3>
                  <span className="text-xs text-slate-500 shrink-0">{timeAgo(createdAt)}</span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{message}</p>
              </div>
              {!isRead && <div className="w-2 h-2 rounded-full bg-primary-400 shrink-0 mt-1.5" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
