import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Compass, LogOut, User, Map, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-[60] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                <Compass size={24} />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-display">BudgetPacker</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 sm:gap-6">
              {user ? (
                <>
                  <Link 
                    to="/my-trips" 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive('/my-trips') 
                        ? 'bg-brand-50 text-brand-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Map size={18} />
                    <span>My Trips</span>
                  </Link>
                  
                  <div className="h-6 w-px bg-slate-200"></div>
                  
                  <div className="flex items-center gap-3 pl-2">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">Explorer</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <button 
                      onClick={handleLogout} 
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors">Log In</Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    Join Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] md:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] sm:w-[320px] bg-white z-[120] shadow-2xl md:hidden flex flex-col overflow-hidden"
            >
              <div className="p-6 flex flex-col h-full bg-white relative">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-brand-50 text-brand-500">
                      <Compass size={24} />
                    </div>
                    <span className="text-lg font-black text-slate-900">BudgetPacker</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 space-y-3 relative z-10">
                  {user ? (
                    <>
                      <div className="bg-slate-50 rounded-[1.5rem] p-5 mb-6 flex items-center gap-4 border border-slate-100/50 shadow-sm relative z-20">
                        <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-brand-600 font-black uppercase tracking-widest opacity-70">Explorer</p>
                        </div>
                      </div>
                      
                      <Link 
                        to="/my-trips" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all relative z-20 ${
                          isActive('/my-trips') ? 'bg-brand-50 text-brand-600 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isActive('/my-trips') ? 'bg-brand-100' : 'bg-slate-100'}`}>
                          <Map size={20} />
                        </div>
                        My Trips
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-4 pt-4">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block p-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 text-center">Log In</Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block p-5 rounded-2xl font-black text-white bg-slate-900 shadow-xl text-center uppercase tracking-widest text-xs">Join Free</Link>
                    </div>
                  )}
                </div>

                {user && (
                  <div className="mt-auto pt-6 border-t border-slate-50 relative z-10">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                    >
                      <LogOut size={20} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
