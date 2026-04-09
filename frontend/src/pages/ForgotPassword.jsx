import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://budgetpacker-ai-powered-trip-planner.onrender.com//api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-slate-50"
      >
        <div className="mb-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Recover <br/>Password</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full h-16 pl-14 pr-6 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all duration-300 font-bold"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>Send Reset Link <Send size={18} /></>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-100">
              <Mail size={32} />
            </div>
            <h3 className="text-green-900 font-black text-xl">Check your inbox!</h3>
            <p className="text-green-700/70 font-medium text-sm leading-relaxed">
              We've sent a password reset link to <b>{email}</b>. If it doesn't appear, check your spam folder.
            </p>
            <button 
              onClick={() => setSent(false)} 
              className="text-green-800 font-bold text-sm hover:underline"
            >
              Try another email?
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
