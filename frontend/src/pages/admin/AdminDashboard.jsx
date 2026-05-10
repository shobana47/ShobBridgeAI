import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, TrendingUp, Award, BarChart2, Building2, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const deptData = [
  { dept: 'CSE', students: 120, placed: 95 },
  { dept: 'IT', students: 80, placed: 62 },
  { dept: 'ECE', students: 60, placed: 41 },
  { dept: 'MECH', students: 50, placed: 28 },
  { dept: 'CIVIL', students: 40, placed: 18 },
];

const pieData = [
  { name: 'TCS', value: 35 },
  { name: 'Infosys', value: 28 },
  { name: 'Wipro', value: 20 },
  { name: 'Zoho', value: 10 },
  { name: 'Others', value: 7 },
];

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card rounded-2xl p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {sub && <p className="text-xs text-green-400 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/api/companies/analytics').then(({ data }) => setAnalytics(data)).catch(() => {});
  }, []);

  const stats = analytics || {
    totalStudents: 350, placedStudents: 244, totalCompanies: 18,
    totalApplications: 820, placementRate: 70,
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Placement Intelligence Overview</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total Students"    value={stats.totalStudents}    color="bg-blue-500/80"    delay={0.1} />
        <StatCard icon={Award}      label="Placed Students"   value={stats.placedStudents}   sub={`${stats.placementRate}% rate`} color="bg-green-500/80" delay={0.15} />
        <StatCard icon={Building2}  label="Companies"         value={stats.totalCompanies}   color="bg-violet-500/80"  delay={0.2} />
        <StatCard icon={Briefcase}  label="Applications"      value={stats.totalApplications} color="bg-amber-500/80"  delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Placement Bar Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Department-wise Placements</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="students" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="placed"   name="Placed" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Company Distribution Pie */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Top Hiring Companies</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Students Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-5">Recent Placement Activities</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-800">
              <th className="pb-3 font-medium">Student</th>
              <th className="pb-3 font-medium">Department</th>
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Package</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {[
              { name: 'Aravind K', dept: 'CSE', company: 'TCS', pkg: '3.5 LPA', status: 'Selected' },
              { name: 'Priya S', dept: 'IT', company: 'Infosys', pkg: '4.0 LPA', status: 'Selected' },
              { name: 'Rajan M', dept: 'ECE', company: 'Wipro', pkg: '3.5 LPA', status: 'Interviewed' },
              { name: 'Divya R', dept: 'CSE', company: 'Zoho', pkg: '7.0 LPA', status: 'Shortlisted' },
              { name: 'Karthik P', dept: 'MECH', company: 'Hexaware', pkg: '4.5 LPA', status: 'Applied' },
            ].map(({ name, dept, company, pkg, status }, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 text-slate-200 font-medium">{name}</td>
                <td className="py-3 text-slate-400">{dept}</td>
                <td className="py-3 text-slate-300">{company}</td>
                <td className="py-3 text-primary-400 font-semibold">{pkg}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    status === 'Selected' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    status === 'Interviewed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    status === 'Shortlisted' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                    'bg-slate-700 text-slate-400'
                  }`}>{status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
