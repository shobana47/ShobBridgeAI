import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, X, Edit2, Trash2, CheckCircle, Calendar } from 'lucide-react';
import api from '../../services/api';

const initialForm = {
  name: '', industry: 'IT Services', location: '', package: '',
  minCGPA: 6.0, minAtsScore: 60, positions: 1,
  requiredSkills: '', jobDescription: '', driveDate: '',
};

const industries = ['IT Services', 'Product', 'BFSI', 'Manufacturing', 'Consulting', 'Healthcare'];

const demoCompanies = [
  { _id: '1', name: 'TCS', industry: 'IT Services', location: 'Chennai', package: '3.5 LPA', minCGPA: 6.0, minAtsScore: 60, positions: 50, status: 'Active', requiredSkills: ['Java', 'SQL', 'Communication'] },
  { _id: '2', name: 'Infosys', industry: 'IT Services', location: 'Bangalore', package: '4.0 LPA', minCGPA: 6.5, minAtsScore: 65, positions: 40, status: 'Active', requiredSkills: ['Python', 'SQL', 'REST APIs'] },
  { _id: '3', name: 'Zoho', industry: 'Product', location: 'Chennai', package: '7.0 LPA', minCGPA: 7.5, minAtsScore: 75, positions: 15, status: 'Active', requiredSkills: ['React', 'Node.js', 'System Design'] },
  { _id: '4', name: 'Wipro', industry: 'IT Services', location: 'Hyderabad', package: '3.5 LPA', minCGPA: 6.0, minAtsScore: 60, positions: 35, status: 'Completed', requiredSkills: ['Java', 'Spring Boot'] },
];

const AdminCompanies = () => {
  const [companies, setCompanies] = useState(demoCompanies);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/api/companies').then(({ data }) => { if (data?.length) setCompanies(data); }).catch(() => {});
  }, []);

  const openAdd = () => { setForm(initialForm); setEditing(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({ ...c, requiredSkills: (c.requiredSkills || []).join(', ') });
    setEditing(c._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = { ...form, requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        await api.put(`/api/companies/${editing}`, payload);
        setCompanies(prev => prev.map(c => c._id === editing ? { ...c, ...payload } : c));
      } else {
        const { data } = await api.post('/api/companies', payload);
        setCompanies(prev => [data, ...prev]);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setShowForm(false);
    } catch {
      // fallback: update local state only
      if (!editing) {
        setCompanies(prev => [{ ...payload, _id: Date.now().toString(), status: 'Active' }, ...prev]);
      }
      setShowForm(false);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setCompanies(prev => prev.filter(c => c._id !== id));
    try { await api.delete(`/api/companies/${id}`); } catch {}
  };

  const inputCls = "w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all";

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-violet-400" /> Companies
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage campus recruitment drives</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" /> Saved
            </motion.div>
          )}
          <button onClick={openAdd}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm">
            <Plus className="w-4 h-4" /> Add Company
          </button>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">{editing ? 'Edit Company' : 'Add New Company'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-400">Company Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. TCS" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Industry</label>
                    <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
                      className={inputCls + ' appearance-none cursor-pointer'}>
                      {industries.map(i => <option key={i} value={i} className="bg-[#1e293b]">{i}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Location</label>
                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Chennai" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Package</label>
                    <input value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} className={inputCls} placeholder="3.5 LPA" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Positions</label>
                    <input type="number" value={form.positions} onChange={e => setForm({ ...form, positions: e.target.value })} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Min CGPA</label>
                    <input type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={e => setForm({ ...form, minCGPA: e.target.value })} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Min ATS Score (%)</label>
                    <input type="number" min="0" max="100" value={form.minAtsScore} onChange={e => setForm({ ...form, minAtsScore: e.target.value })} className={inputCls} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-400">Drive Date</label>
                    <input type="date" value={form.driveDate} onChange={e => setForm({ ...form, driveDate: e.target.value })} className={inputCls} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-400">Required Skills <span className="text-slate-500">(comma-separated)</span></label>
                    <input value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} className={inputCls} placeholder="Java, SQL, Communication..." />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-400">Job Description</label>
                    <textarea value={form.jobDescription} onChange={e => setForm({ ...form, jobDescription: e.target.value })}
                      className={inputCls + ' h-20 resize-none'} placeholder="Role overview, responsibilities..." />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={loading || !form.name}
                    className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 text-sm">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editing ? 'Update' : 'Add Company'}
                  </button>
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {companies.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:border-primary-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center text-xl font-bold text-white">
                  {c.name?.[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.industry} · {c.location}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                c.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                c.status === 'Completed' ? 'bg-slate-700 text-slate-400 border-slate-600' :
                'bg-red-500/10 text-red-400 border-red-500/30'}`}>{c.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-800/40 rounded-lg p-2">
                <p className="text-sm font-bold text-primary-400">{c.package || '—'}</p>
                <p className="text-[10px] text-slate-500">Package</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-2">
                <p className="text-sm font-bold text-blue-400">{c.minCGPA}</p>
                <p className="text-[10px] text-slate-500">Min CGPA</p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-2">
                <p className="text-sm font-bold text-violet-400">{c.positions}</p>
                <p className="text-[10px] text-slate-500">Seats</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(c.requiredSkills || []).slice(0, 3).map(s => (
                <span key={s} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">{s}</span>
              ))}
              {(c.requiredSkills || []).length > 3 && (
                <span className="text-xs text-slate-500">+{c.requiredSkills.length - 3} more</span>
              )}
            </div>

            {c.driveDate && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Drive: {new Date(c.driveDate).toLocaleDateString()}
              </div>
            )}

            <div className="flex gap-2 mt-auto pt-1">
              <button onClick={() => openEdit(c)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(c._id)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 py-2 rounded-xl transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompanies;
