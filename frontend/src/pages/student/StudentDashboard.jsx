import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Target, Briefcase, TrendingUp, Brain, Star,
  Award, ChevronRight, Clock, CheckCircle, AlertCircle, Zap
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-primary-500/30 transition-all group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

const CircularProgress = ({ value, label, color }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{value}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center">{label}</p>
    </div>
  );
};

const radarData = [
  { subject: 'Technical', A: 85 },
  { subject: 'Projects', A: 78 },
  { subject: 'Certs', A: 65 },
  { subject: 'CGPA', A: 80 },
  { subject: 'Interview', A: 70 },
  { subject: 'Soft Skills', A: 75 },
];

const trendData = [
  { month: 'Jan', score: 58 },
  { month: 'Feb', score: 62 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 72 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 84 },
];

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [student, setStudent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/student/profile');
        setStudent(data);
        const { data: recs } = await api.get('/api/student/recommendations');
        setRecommendations(recs.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const atsScore = student?.atsScore || 0;
  const readiness = student?.placementReadinessScore || 0;
  const techScore = student?.technicalScore || 0;
  const commScore = student?.communicationScore || 0;

  const activities = [
    { icon: CheckCircle, text: 'Profile updated successfully', time: '2h ago', color: 'text-green-400' },
    { icon: AlertCircle, text: 'Resume analysis pending', time: '1d ago', color: 'text-yellow-400' },
    { icon: Briefcase, text: 'Applied to TCS campus drive', time: '2d ago', color: 'text-blue-400' },
    { icon: Clock, text: 'Mock interview scheduled', time: '3d ago', color: 'text-violet-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-primary-400">{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your placement readiness overview</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-xl px-4 py-2">
          <Zap className="w-4 h-4 text-primary-400" />
          <span className="text-primary-400 text-sm font-medium">AI Powered</span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText}  label="ATS Score"         value={`${atsScore}%`}   color="bg-blue-500/80"    delay={0.1} />
        <StatCard icon={Target}    label="Readiness Score"   value={`${readiness}%`}  color="bg-primary-500/80" delay={0.15} />
        <StatCard icon={Brain}     label="Technical Score"   value={`${techScore}%`}  color="bg-violet-500/80"  delay={0.2} />
        <StatCard icon={Star}      label="Communication"     value={`${Math.round(commScore)}%`} color="bg-amber-500/80" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Scores */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Placement Readiness</h2>
          <div className="flex justify-around">
            <CircularProgress value={atsScore || 72} label="ATS Score"    color="#22c55e" />
            <CircularProgress value={readiness || 68} label="Readiness"   color="#8b5cf6" />
            <CircularProgress value={techScore || 80} label="Technical"   color="#3b82f6" />
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Skill Radar</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="Student" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {activities.map(({ icon: Icon, text, time, color }, i) => (
              <li key={i} className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                <div>
                  <p className="text-sm text-slate-300">{text}</p>
                  <p className="text-xs text-slate-500">{time}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Score Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Readiness Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#22c55e' }}
              />
              <Area type="monotone" dataKey="score" stroke="#22c55e" fill="url(#colorScore)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Company Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recommended Companies</h2>
            <a href="/student/companies" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {(recommendations.length > 0 ? recommendations : [
              { name: 'TCS', matchScore: 90, package: '3.5 LPA', eligible: true },
              { name: 'Infosys', matchScore: 82, package: '4.0 LPA', eligible: true },
              { name: 'Zoho', matchScore: 65, package: '7.0 LPA', eligible: false },
              { name: 'Wipro', matchScore: 75, package: '3.5 LPA', eligible: true },
            ]).map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-200">{c.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.package}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-400">{c.matchScore}%</p>
                    <p className="text-xs text-slate-500">match</p>
                  </div>
                  {c.eligible ? (
                    <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Eligible</span>
                  ) : (
                    <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Gap</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
