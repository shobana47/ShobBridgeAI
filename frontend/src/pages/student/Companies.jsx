import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ExternalLink, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const Companies = () => {
  const [recs, setRecs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: r }, { data: c }] = await Promise.all([
          api.get('/api/student/recommendations'),
          api.get('/api/companies'),
        ]);
        setRecs(r);
        setCompanies(c);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApply = async (companyId) => {
    setApplying(prev => ({ ...prev, [companyId]: true }));
    try {
      await api.post(`/api/companies/${companyId}/apply`);
    } catch (e) { console.error(e); }
    setApplying(prev => ({ ...prev, [companyId]: false }));
  };

  const display = recs.length > 0 ? recs : [
    { name: 'TCS', matchScore: 90, package: '3.5 LPA', eligible: true, requiredSkills: ['Java', 'SQL'] },
    { name: 'Infosys', matchScore: 82, package: '4.0 LPA', eligible: true, requiredSkills: ['Python', 'SQL'] },
    { name: 'Zoho', matchScore: 65, package: '7.0 LPA', eligible: false, requiredSkills: ['React', 'Node.js'] },
    { name: 'Wipro', matchScore: 76, package: '3.5 LPA', eligible: true, requiredSkills: ['Java', 'Spring Boot'] },
    { name: 'Hexaware', matchScore: 70, package: '4.5 LPA', eligible: true, requiredSkills: ['Python', 'ML'] },
    { name: 'Cognizant', matchScore: 80, package: '4.0 LPA', eligible: true, requiredSkills: ['Java', 'Communication'] },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-blue-400" /> Company Recommendations
        </h1>
        <p className="text-slate-400 text-sm mt-1">AI-matched companies based on your profile</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {display.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-5 hover:border-primary-500/30 transition-all group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xl font-bold text-white border border-slate-600">
                    {c.name?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.industry || 'IT Services'}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${c.matchScore >= 80 ? 'text-green-400' : c.matchScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {c.matchScore}%
                </div>
              </div>

              {/* Package & Eligibility */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Package: <span className="text-white font-medium">{c.package}</span></span>
                {c.eligible ? (
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Eligible
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                    <XCircle className="w-3 h-3" /> Skill Gap
                  </span>
                )}
              </div>

              {/* Required Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(c.requiredSkills || []).map((s) => (
                  <span key={s} className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">{s}</span>
                ))}
              </div>

              {/* Match Bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.matchScore}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${c.matchScore >= 80 ? 'bg-green-500' : c.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  />
                </div>
              </div>

              <button
                onClick={() => handleApply(c._id || i)}
                disabled={!c.eligible || applying[c._id || i]}
                className={`w-full py-2 rounded-xl text-sm font-medium transition-all
                  ${c.eligible
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30 hover:bg-primary-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                {applying[c._id || i] ? 'Applying...' : c.eligible ? 'Apply Now' : 'Improve Profile First'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
