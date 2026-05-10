import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Zap } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const DEMO_ACCOUNTS = [
  { label: 'Student', email: 'student@demo.com', password: 'demo123', color: 'text-green-400' },
  { label: 'Admin',   email: 'admin@demo.com',   password: 'demo123', color: 'text-violet-400' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login, user, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin' || user.role === 'Placement Staff') navigate('/admin');
      else navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const fillDemo = (acc) => { setEmail(acc.email); setPassword(acc.password); };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a] p-4">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600/20 border border-primary-500/30 mb-4">
            <Zap className="w-7 h-7 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">PlaceAI</h1>
          <p className="text-slate-400 text-sm">AI-Powered Campus Placement Intelligence</p>
        </div>

        {/* Demo Quick Login */}
        <div className="mb-6 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-2 font-medium">⚡ Quick Demo Login</p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.label} onClick={() => fillDemo(acc)}
                className={`flex-1 text-xs py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors font-medium ${acc.color}`}>
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field pl-10" placeholder="Enter your email" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary-500 hover:text-primary-400">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-10 pr-10" placeholder="Enter your password" required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            {isLoading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><LogIn className="w-5 h-5" /> Sign In</>
            }
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
