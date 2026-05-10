import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, ChevronDown, Eye, GraduationCap } from 'lucide-react';
import api from '../../services/api';

const statusBadge = (placed) => placed
  ? <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Placed</span>
  : <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Unplaced</span>;

const demoStudents = [
  { _id: '1', rollNumber: '21CS001', department: 'CSE', batch: '2025', cgpa: 8.9, atsScore: 88, isPlaced: true,  placedCompany: 'TCS',     user: { name: 'Aravind Kumar',  email: 'aravind@mail.com' } },
  { _id: '2', rollNumber: '21CS002', department: 'CSE', batch: '2025', cgpa: 7.5, atsScore: 72, isPlaced: true,  placedCompany: 'Infosys',  user: { name: 'Priya Sharma',   email: 'priya@mail.com' } },
  { _id: '3', rollNumber: '21IT001', department: 'IT',  batch: '2025', cgpa: 8.1, atsScore: 65, isPlaced: false, placedCompany: null,       user: { name: 'Rajan Mehta',    email: 'rajan@mail.com' } },
  { _id: '4', rollNumber: '21CS003', department: 'CSE', batch: '2025', cgpa: 9.1, atsScore: 92, isPlaced: true,  placedCompany: 'Zoho',     user: { name: 'Divya Ramesh',   email: 'divya@mail.com' } },
  { _id: '5', rollNumber: '21EC001', department: 'ECE', batch: '2025', cgpa: 6.8, atsScore: 58, isPlaced: false, placedCompany: null,       user: { name: 'Karthik Patel',  email: 'karthik@mail.com' } },
  { _id: '6', rollNumber: '21IT002', department: 'IT',  batch: '2025', cgpa: 7.9, atsScore: 75, isPlaced: true,  placedCompany: 'Wipro',    user: { name: 'Sneha Das',      email: 'sneha@mail.com' } },
  { _id: '7', rollNumber: '21CS004', department: 'CSE', batch: '2025', cgpa: 8.3, atsScore: 80, isPlaced: true,  placedCompany: 'Cognizant',user: { name: 'Vijay Mohan',    email: 'vijay@mail.com' } },
  { _id: '8', rollNumber: '21ME001', department: 'MECH',batch: '2025', cgpa: 6.5, atsScore: 50, isPlaced: false, placedCompany: null,       user: { name: 'Arjun Singh',    email: 'arjun@mail.com' } },
];

const AdminStudents = () => {
  const [students, setStudents] = useState(demoStudents);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    api.get('/api/student/all').then(({ data }) => { if (data?.length) setStudents(data); }).catch(() => {});
  }, []);

  const depts = ['All', ...new Set(students.map(s => s.department))];
  const filtered = students.filter(s =>
    (deptFilter === 'All' || s.department === deptFilter) &&
    (s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.rollNumber?.toLowerCase().includes(search.toLowerCase()))
  );

  const placed = students.filter(s => s.isPlaced).length;

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-400" /> Students
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage and monitor all registered students</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: students.length, color: 'text-blue-400' },
          { label: 'Placed', value: placed, color: 'text-green-400' },
          { label: 'Placement Rate', value: `${Math.round((placed / students.length) * 100)}%`, color: 'text-violet-400' },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search by name or roll number..." />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer">
            {depts.map(d => <option key={d} value={d} className="bg-[#1e293b]">{d}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/60">
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                <th className="px-5 py-4 font-medium">Student</th>
                <th className="px-5 py-4 font-medium">Roll No</th>
                <th className="px-5 py-4 font-medium">Dept</th>
                <th className="px-5 py-4 font-medium">CGPA</th>
                <th className="px-5 py-4 font-medium">ATS Score</th>
                <th className="px-5 py-4 font-medium">Company</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(({ _id, user, rollNumber, department, cgpa, atsScore, isPlaced, placedCompany }, i) => (
                <motion.tr key={_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{rollNumber || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md">{department || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-semibold ${cgpa >= 8 ? 'text-green-400' : cgpa >= 7 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {cgpa || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${atsScore || 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{atsScore || 0}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{placedCompany || <span className="text-slate-600">—</span>}</td>
                  <td className="px-5 py-3.5">{statusBadge(isPlaced)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-40" />
              No students found
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStudents;
