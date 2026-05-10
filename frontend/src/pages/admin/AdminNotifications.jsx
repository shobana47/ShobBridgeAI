import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Send, Users, CheckCircle, AlertTriangle, Info, AlertCircle, Plus, X } from 'lucide-react';

const TYPES = [
  { value: 'Info',    label: 'Info',    Icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30' },
  { value: 'Success', label: 'Success', Icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30' },
  { value: 'Warning', label: 'Warning', Icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { value: 'Alert',   label: 'Alert',   Icon: AlertCircle,   color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
];

const initialHistory = [
  { id: 1, title: 'TCS Drive Registration Open', message: 'Register before June 15.', type: 'Alert',   audience: 'All Students', sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2),  sent: true },
  { id: 2, title: 'Resume Workshop Tomorrow',    message: 'Join the resume workshop at 10AM.',  type: 'Info',    audience: 'CSE', sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24), sent: true },
  { id: 3, title: 'Infosys Results Announced',   message: 'Check your result on the portal.',  type: 'Success', audience: 'All Students', sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48), sent: true },
];

const timeAgo = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 3600)  return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
};

const AdminNotifications = () => {
  const [title, setTitle]     = useState('');
  const [message, setMessage] = useState('');
  const [type, setType]       = useState('Info');
  const [audience, setAudience] = useState('All Students');
  const [sending, setSending]   = useState(false);
  const [history, setHistory]   = useState(initialHistory);
  const [sent, setSent]         = useState(false);

  const selectedType = TYPES.find(t => t.value === type);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate API call
    const newNotif = {
      id: Date.now(), title, message, type, audience,
      sentAt: new Date(), sent: true,
    };
    setHistory(prev => [newNotif, ...prev]);
    setTitle(''); setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setSending(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-amber-400" /> Notifications
          </h1>
          <p className="text-slate-400 text-sm mt-1">Broadcast announcements to students</p>
        </div>
        {sent && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4" /> Notification sent!
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-400" /> Compose Notification
          </h2>

          {/* Type selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Notification Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(({ value, label, Icon, color, bg, border }) => (
                <button key={value} onClick={() => setType(value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all
                    ${type === value ? `${bg} ${border} ${color}` : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Target Audience</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={audience} onChange={e => setAudience(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer">
                {['All Students', 'CSE', 'IT', 'ECE', 'MECH', 'EEE', 'Placed Students', 'Unplaced Students'].map(a => (
                  <option key={a} value={a} className="bg-[#1e293b]">{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. TCS Drive Registration Open" maxLength={80} />
            <p className="text-xs text-slate-600 text-right">{title.length}/80</p>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Message *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all h-28 resize-none"
              placeholder="Enter the notification message..." maxLength={300} />
            <p className="text-xs text-slate-600 text-right">{message.length}/300</p>
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className={`rounded-xl p-4 border ${selectedType.bg} ${selectedType.border}`}>
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">Preview</p>
              <div className="flex items-start gap-3">
                <selectedType.Icon className={`w-5 h-5 ${selectedType.color} shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-sm font-semibold ${selectedType.color}`}>{title || 'Title...'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{message || 'Message...'}</p>
                  <p className="text-xs text-slate-600 mt-1">To: {audience}</p>
                </div>
              </div>
            </div>
          )}

          <button onClick={handleSend} disabled={sending || !title || !message}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all
              ${title && message
                ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
            {sending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Send className="w-4 h-4" /> Send Notification</>
            }
          </button>
        </motion.div>

        {/* Sent History */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Sent History</h2>
          <div className="space-y-3 overflow-y-auto max-h-[560px] pr-1">
            <AnimatePresence>
              {history.map(({ id, title, message, type: t, audience: aud, sentAt }, i) => {
                const cfg = TYPES.find(x => x.value === t) || TYPES[0];
                return (
                  <motion.div key={id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.04 }}
                    className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                    <div className="flex items-start gap-3">
                      <cfg.Icon className={`w-5 h-5 ${cfg.color} shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={`text-sm font-semibold ${cfg.color} truncate`}>{title}</p>
                          <span className="text-xs text-slate-500 shrink-0">{timeAgo(sentAt)}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Users className="w-3 h-3 text-slate-600" />
                          <span className="text-xs text-slate-500">{aud}</span>
                          <span className="text-slate-700">·</span>
                          <span className="text-xs text-green-500">✓ Sent</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNotifications;
