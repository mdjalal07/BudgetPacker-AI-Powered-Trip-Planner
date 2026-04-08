import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.message?.includes('verify')) {
        toast.error('Please verify your email first');
        navigate('/verify-otp', { state: { email } });
      } else {
        setError(err.response?.data?.message || 'Invalid credentials or error logging in.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-slate-50/50">
      {/* Background with abstract animated shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="glass rounded-[2.5rem] p-8 border-white/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-brand-100 opacity-20 transform translate-x-4 -translate-y-4">
             <Compass size={120} />
          </div>

          <div className="relative z-10">
            <div className="mb-10">
              <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm mb-6 hover:gap-3 transition-all">
                <ArrowRight className="rotate-180" size={16} /> Back to Home
              </Link>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Log in to continue your journey</p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 mb-8 border border-red-100"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <input 
                    required type="email" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                    placeholder="explorer@earth.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <input 
                    required type="password" 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group mt-4 transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-12 text-center">
              <p className="text-slate-400 font-medium">
                New traveler? <Link to="/register" className="text-brand-600 font-bold hover:text-brand-700 transition-colors">Join the Tribe</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
