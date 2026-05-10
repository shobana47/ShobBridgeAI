import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Save, Plus, X, Link, Globe,
  GraduationCap, Briefcase, Award, Code, CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MBA'];

const Tag = ({ value, onRemove }) => (
  <span className="flex items-center gap-1 text-xs bg-primary-600/20 text-primary-300 border border-primary-500/30 px-2.5 py-1 rounded-full">
    {value}
    <button onClick={onRemove} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
  </span>
);

const StudentProfile = () => {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    rollNumber: '', department: 'CSE', batch: '2025', cgpa: '',
    phone: '', address: '', linkedIn: '', github: '', portfolio: '',
  });
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [projectInput, setProjectInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/api/student/profile').then(({ data }) => {
      setForm({
        rollNumber: data.rollNumber || '',
        department: data.department || 'CSE',
        batch: data.batch || '2025',
        cgpa: data.cgpa || '',
        phone: data.phone || '',
        address: data.address || '',
        linkedIn: data.linkedIn || '',
        github: data.github || '',
        portfolio: data.portfolio || '',
      });
      setSkills(data.skills || []);
      setCertifications((data.certifications || []).map(c => c.name || c));
      setProjects((data.projects || []).map(p => p.title || p));
    }).catch(() => {});
  }, []);

  const addTag = (list, setList, input, setInput) => {
    const val = input.trim();
    if (val && !list.includes(val)) { setList([...list, val]); setInput(''); }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/api/student/profile', {
        ...form,
        cgpa: parseFloat(form.cgpa) || 0,
        skills,
        certifications: certifications.map(name => ({ name })),
        projects: projects.map(title => ({ title })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const inputCls = "w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm";

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-7 h-7 text-primary-400" /> My Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1">Complete your profile to improve your placement readiness score</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4" /> Saved successfully
          </motion.div>
        )}
      </motion.div>

      {/* Avatar Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="inline-block mt-1.5 text-xs bg-primary-600/20 text-primary-400 border border-primary-500/30 px-2.5 py-0.5 rounded-full">{user?.role}</span>
        </div>
      </motion.div>

      {/* Academic Info */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400" /> Academic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Roll Number', key: 'rollNumber', placeholder: '21CS001' },
            { label: 'Batch / Year', key: 'batch', placeholder: '2025' },
            { label: 'CGPA', key: 'cgpa', placeholder: '8.5', type: 'number' },
            { label: 'Phone', key: 'phone', placeholder: '+91 9876543210' },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">{label}</label>
              <input type={type || 'text'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className={inputCls} placeholder={placeholder} />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Department</label>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
              className={inputCls + ' appearance-none cursor-pointer'}>
              {departments.map(d => <option key={d} value={d} className="bg-[#1e293b]">{d}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-slate-400">Address</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              className={inputCls} placeholder="Chennai, Tamil Nadu" />
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Code className="w-5 h-5 text-violet-400" /> Technical Skills
        </h2>
        <div className="flex gap-2 mb-4">
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag(skills, setSkills, skillInput, setSkillInput)}
            className={inputCls} placeholder="e.g. React, Python, SQL... (press Enter)" />
          <button onClick={() => addTag(skills, setSkills, skillInput, setSkillInput)}
            className="px-3 py-2 bg-primary-600/20 text-primary-400 border border-primary-500/30 rounded-xl hover:bg-primary-600/30 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(s => <Tag key={s} value={s} onRemove={() => setSkills(skills.filter(x => x !== s))} />)}
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Certifications
        </h2>
        <div className="flex gap-2 mb-4">
          <input value={certInput} onChange={e => setCertInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag(certifications, setCertifications, certInput, setCertInput)}
            className={inputCls} placeholder="e.g. AWS Cloud Practitioner, Google ML... (press Enter)" />
          <button onClick={() => addTag(certifications, setCertifications, certInput, setCertInput)}
            className="px-3 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-600/30 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {certifications.map(c => (
            <span key={c} className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
              {c}<button onClick={() => setCertifications(certifications.filter(x => x !== c))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Projects */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-green-400" /> Projects
        </h2>
        <div className="flex gap-2 mb-4">
          <input value={projectInput} onChange={e => setProjectInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag(projects, setProjects, projectInput, setProjectInput)}
            className={inputCls} placeholder="e.g. E-Commerce App, AI Chatbot... (press Enter)" />
          <button onClick={() => addTag(projects, setProjects, projectInput, setProjectInput)}
            className="px-3 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {projects.map(p => (
            <span key={p} className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
              {p}<button onClick={() => setProjects(projects.filter(x => x !== p))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Social & Portfolio Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'LinkedIn', key: 'linkedIn', Icon: Link, placeholder: 'linkedin.com/in/yourname', color: 'text-blue-400' },
            { label: 'GitHub', key: 'github', Icon: Code, placeholder: 'github.com/yourname', color: 'text-slate-300' },
            { label: 'Portfolio', key: 'portfolio', Icon: Globe, placeholder: 'yourname.dev', color: 'text-green-400' },
          ].map(({ label, key, Icon, placeholder, color }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${color}`} /> {label}
              </label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className={inputCls} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button onClick={handleSave} disabled={loading}
          className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-semibold">
          {loading
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><Save className="w-4 h-4" /> Save Profile</>
          }
        </button>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
