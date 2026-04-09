import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return toast.error('Please enter complete OTP');

    setLoading(true);
    try {
      const res = await axios.post('https://budgetpacker-ai-powered-trip-planner.onrender.com//api/auth/verify-otp', { email, otp: otpValue });
      localStorage.setItem('token', res.data.token);
      toast.success('Email verified successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-premium border border-slate-50"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Mail size={40} className="animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Verify Email</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            We've sent a 6-digit code to <br/>
            <span className="text-slate-900 font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-16 text-center text-3xl font-black bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all duration-300"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>Verify Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-bold text-sm">
          Didn't receive code? <button className="text-indigo-600 hover:underline">Resend Code</button>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
