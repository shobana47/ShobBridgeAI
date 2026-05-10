import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, XCircle, ChevronRight, Zap, BarChart2 } from 'lucide-react';

const hrQuestions = [
  { q: "Tell me about yourself.", hint: "Structure: Background → Skills → Goals" },
  { q: "What are your strengths and weaknesses?", hint: "Be specific and honest." },
  { q: "Where do you see yourself in 5 years?", hint: "Align with company growth." },
  { q: "Why do you want to join this company?", hint: "Research the company first." },
  { q: "Describe a challenge you overcame.", hint: "Use STAR method." },
];

const techQuestions = [
  { q: "Explain the difference between Stack and Queue.", hint: "Think LIFO vs FIFO." },
  { q: "What is the time complexity of Binary Search?", hint: "O(log n)" },
  { q: "What is REST API? Explain HTTP methods.", hint: "GET, POST, PUT, DELETE." },
  { q: "What is OOP? Explain its principles.", hint: "Encapsulation, Inheritance, Polymorphism, Abstraction." },
  { q: "Explain SQL JOINs with examples.", hint: "INNER, LEFT, RIGHT, FULL." },
];

const MockInterview = () => {
  const [interviewType, setInterviewType] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(null);

  const questions = interviewType === 'HR' ? hrQuestions : interviewType === 'Tech' ? techQuestions : [];

  const startInterview = (type) => {
    setInterviewType(type);
    setCurrentQ(0);
    setAnswers({});
    setDone(false);
    setTimeLeft(120);
    startTimer();
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
    setTimer(t);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setTimeLeft(120);
    } else {
      setDone(true);
      if (timer) clearInterval(timer);
    }
  };

  const score = done ? Math.round(
    Object.values(answers).reduce((acc, a) => acc + Math.min(100, (a.split(' ').length / 3) * 5), 0) / questions.length
  ) : 0;

  if (!interviewType) {
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-violet-400" /> Mock Interview
          </h1>
          <p className="text-slate-400 text-sm mt-1">Practice AI-powered mock interviews</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { type: 'HR', label: 'HR Interview', desc: '5 behavioral questions · STAR method · Communication focused', color: 'from-blue-600/20 to-blue-800/10 border-blue-500/30', icon: MessageSquare, iconColor: 'text-blue-400' },
            { type: 'Tech', label: 'Technical Interview', desc: '5 technical questions · DSA, OOP, SQL, REST API', color: 'from-violet-600/20 to-violet-800/10 border-violet-500/30', icon: Zap, iconColor: 'text-violet-400' },
          ].map(({ type, label, desc, color, icon: Icon, iconColor }) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => startInterview(type)}
              className={`glass-card rounded-2xl p-8 cursor-pointer bg-gradient-to-br ${color} border hover:shadow-2xl transition-all`}
            >
              <Icon className={`w-10 h-10 ${iconColor} mb-4`} />
              <h2 className="text-xl font-bold text-white mb-2">{label}</h2>
              <p className="text-slate-400 text-sm mb-4">{desc}</p>
              <div className="flex items-center gap-1 text-sm text-primary-400 font-medium">
                Start Interview <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-10 text-center">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Interview Complete!</h2>
          <p className="text-slate-400 mb-8">Here's your performance summary</p>
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-primary-400">{Math.min(100, score)}%</p>
              <p className="text-xs text-slate-400">Overall</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-violet-400">{questions.length}</p>
              <p className="text-xs text-slate-400">Questions</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-400">{Object.keys(answers).length}</p>
              <p className="text-xs text-slate-400">Answered</p>
            </div>
          </div>
          <button onClick={() => setInterviewType(null)} className="btn-primary px-8 py-3">Take Another Interview</button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{interviewType} Interview</h1>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timeLeft < 30 ? 'border-red-500/40 text-red-400' : 'border-slate-700 text-slate-300'}`}>
          <Clock className="w-4 h-4" />
          <span className="font-mono font-semibold">{mins}:{secs}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {questions.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= currentQ ? 'bg-primary-500' : 'bg-slate-700'}`} />
        ))}
      </div>

      <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
          <span>Question {currentQ + 1} of {questions.length}</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-3">{q.q}</h2>
        <p className="text-sm text-slate-500 mb-6 italic">💡 Hint: {q.hint}</p>
        <textarea
          value={answers[currentQ] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [currentQ]: e.target.value }))}
          className="input-field h-36 resize-none mb-6"
          placeholder="Type your answer here..."
        />
        <button onClick={handleNext} className="btn-primary flex items-center gap-2 px-6 py-2.5">
          {currentQ === questions.length - 1 ? 'Finish' : 'Next Question'} <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default MockInterview;
