import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, XCircle, BookOpen, ArrowRight, Zap } from 'lucide-react';
import api from '../../services/api';

const companies = ['TCS', 'Infosys', 'Wipro', 'Zoho', 'Cognizant', 'Hexaware', 'Accenture', 'IBM'];

const SkillGap = () => {
  const [targetCompany, setTargetCompany] = useState('TCS');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/student/skill-gap', { targetCompany });
      setResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-7 h-7 text-violet-400" /> Skill Gap Analyzer
        </h1>
        <p className="text-slate-400 text-sm mt-1">Compare your skills vs company requirements</p>
      </motion.div>

      {/* Company Selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Select Target Company</h2>
        <div className="flex flex-wrap gap-3 mb-5">
          {companies.map((c) => (
            <button
              key={c}
              onClick={() => setTargetCompany(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                ${targetCompany === c
                  ? 'bg-primary-600/20 border-primary-500/50 text-primary-400'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <button onClick={analyze} disabled={loading} className="btn-primary flex items-center gap-2 px-6 py-2.5">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap className="w-4 h-4" /> Analyze Gap</>}
        </button>
      </motion.div>

      {result && (
        <>
          {/* Match Score */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Match Analysis — {result.targetCompany}</h2>
              <div className={`text-2xl font-bold ${result.matchPercentage >= 70 ? 'text-green-400' : result.matchPercentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {result.matchPercentage}% Match
              </div>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.matchPercentage}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${result.matchPercentage >= 70 ? 'bg-green-500' : result.matchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Matched Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched.length > 0 ? result.matched.map((s) => (
                    <span key={s} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">{s}</span>
                  )) : <span className="text-xs text-slate-500">No matching skills found</span>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1"><XCircle className="w-4 h-4" /> Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing.map((s) => (
                    <span key={s} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Roadmap */}
          {result.learningRoadmap.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" /> Learning Roadmap
              </h2>
              <div className="space-y-4">
                {result.learningRoadmap.map(({ skill, resources, estimatedTime }, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{skill}</h3>
                      <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-full">{estimatedTime}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {resources.map((r, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                          <ArrowRight className="w-3 h-3 text-primary-400 shrink-0" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default SkillGap;
