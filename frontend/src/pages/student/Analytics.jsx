import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Award, Target } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
const TT = { contentStyle: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }, labelStyle: { color: '#94a3b8' } };

const monthlyData = [
  { month: 'Jan', placed: 10, applied: 30 },
  { month: 'Feb', placed: 18, applied: 42 },
  { month: 'Mar', placed: 24, applied: 55 },
  { month: 'Apr', placed: 38, applied: 70 },
  { month: 'May', placed: 55, applied: 90 },
  { month: 'Jun', placed: 72, applied: 110 },
];

const skillData = [
  { name: 'SQL', count: 140 },
  { name: 'Python', count: 120 },
  { name: 'Java', count: 95 },
  { name: 'React', count: 80 },
  { name: 'ML/AI', count: 60 },
  { name: 'Node.js', count: 55 },
];

const deptData = [
  { dept: 'CSE', rate: 82 },
  { dept: 'IT', rate: 76 },
  { dept: 'ECE', rate: 64 },
  { dept: 'EEE', rate: 55 },
  { dept: 'MECH', rate: 48 },
];

const compData = [
  { name: 'TCS', value: 35 },
  { name: 'Infosys', value: 28 },
  { name: 'Wipro', value: 20 },
  { name: 'Zoho', value: 10 },
  { name: 'Others', value: 7 },
];

const atsData = [
  { range: '0-40', count: 12 }, { range: '40-55', count: 35 }, { range: '55-70', count: 80 },
  { range: '70-80', count: 110 }, { range: '80-90', count: 78 }, { range: '90-100', count: 35 },
];

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="glass-card rounded-2xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </motion.div>
);

const Analytics = () => (
  <div className="p-6 space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <BarChart2 className="w-7 h-7 text-blue-400" /> Placement Analytics
      </h1>
      <p className="text-slate-400 text-sm mt-1">Campus-wide placement intelligence & trends</p>
    </motion.div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users}      label="Total Students" value="350"  color="bg-blue-500/80"   delay={0.1} />
      <StatCard icon={Award}      label="Placed"         value="244"  color="bg-green-500/80"  delay={0.15} />
      <StatCard icon={Target}     label="Placement Rate" value="70%"  color="bg-violet-500/80" delay={0.2} />
      <StatCard icon={TrendingUp} label="Avg Package"    value="4.2L" color="bg-amber-500/80"  delay={0.25} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Monthly Placement Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="gPlaced"  x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gApplied" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip {...TT} />
            <Area type="monotone" dataKey="applied" stroke="#3b82f6" fill="url(#gApplied)" strokeWidth={2} name="Applied" />
            <Area type="monotone" dataKey="placed"  stroke="#22c55e" fill="url(#gPlaced)"  strokeWidth={2} name="Placed" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Skills in Demand */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Top Skills in Demand</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={skillData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={55} />
            <Tooltip {...TT} />
            <Bar dataKey="count" name="Students" radius={[0, 4, 4, 0]}>
              {skillData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dept Rate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Dept-wise Placement Rate (%)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
            <Tooltip {...TT} />
            <Bar dataKey="rate" name="Rate %" radius={[4, 4, 0, 0]}>
              {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Company Pie */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Hiring by Company</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={compData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
              dataKey="value" paddingAngle={4}>
              {compData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip {...TT} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    {/* ATS Distribution */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-6">
      <h2 className="text-base font-semibold text-white mb-5">ATS Score Distribution</h2>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={atsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip {...TT} />
          <Bar dataKey="count" name="Students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  </div>
);

export default Analytics;
