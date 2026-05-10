import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, AlertCircle, Zap, Tag, Lightbulb } from 'lucide-react';
import api from '../../services/api';

const ProgressBar = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-white">{value}%</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

const ResumeAnalyzer = () => {
  const [form, setForm] = useState({ skills: '', certifications: '', projects: '', cgpa: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const payload = {
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        certifications: form.certifications.split(',').map(c => ({ name: c.trim() })).filter(c => c.name),
        projects: form.projects.split(',').map(p => ({ title: p.trim() })).filter(p => p.title),
        cgpa: parseFloat(form.cgpa) || 7.0,
      };
      const { data } = await api.post('/api/student/analyze-resume', payload);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary-400" /> Resume Analyzer
        </h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered ATS score and resume quality analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Upload className="w-5 h-5 text-primary-400" /> Resume Details</h2>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Technical Skills <span className="text-slate-500">(comma-separated)</span></label>
            <textarea
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              className="input-field h-24 resize-none"
              placeholder="React, Node.js, Python, SQL, Docker..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Certifications <span className="text-slate-500">(comma-separated)</span></label>
            <input
              value={form.certifications}
              onChange={e => setForm({ ...form, certifications: e.target.value })}
              className="input-field"
              placeholder="AWS Cloud, Google ML, Meta Frontend..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Projects <span className="text-slate-500">(comma-separated)</span></label>
            <input
              value={form.projects}
              onChange={e => setForm({ ...form, projects: e.target.value })}
              className="input-field"
              placeholder="E-Commerce App, AI Chatbot, Portfolio..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">CGPA</label>
            <input
              type="number" min="0" max="10" step="0.1"
              value={form.cgpa}
              onChange={e => setForm({ ...form, cgpa: e.target.value })}
              className="input-field"
              placeholder="8.5"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Zap className="w-5 h-5" /> Analyze Resume</>
            )}
          </button>
        </motion.div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {result ? (
            <>
              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'ATS Score', value: result.atsScore, bg: 'from-green-500/20 to-green-600/10 border-green-500/30' },
                  { label: 'Readiness', value: result.placementReadiness, bg: 'from-violet-500/20 to-violet-600/10 border-violet-500/30' },
                  { label: 'Skill Score', value: result.skillScore, bg: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
                  { label: 'Project Score', value: result.projectScore, bg: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
                ].map(({ label, value, bg }) => (
                  <div key={label} className={`glass-card rounded-xl p-4 bg-gradient-to-br ${bg} border`}>
                    <p className="text-2xl font-bold text-white">{value}%</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Progress Bars */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-white">Score Breakdown</h3>
                <ProgressBar label="ATS Score" value={result.atsScore} color="bg-green-500" />
                <ProgressBar label="Technical Skills" value={result.skillScore} color="bg-blue-500" />
                <ProgressBar label="Projects" value={result.projectScore} color="bg-violet-500" />
                <ProgressBar label="Education" value={result.educationScore} color="bg-amber-500" />
              </div>

              {/* Missing Keywords */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-400" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> AI Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full">
              <FileText className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-slate-400">Fill in your resume details and click <span className="text-primary-400 font-medium">Analyze Resume</span> to get your AI-powered ATS score</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
