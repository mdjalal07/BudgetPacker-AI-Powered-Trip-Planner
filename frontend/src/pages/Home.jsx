import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, IndianRupee, Calendar, Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [formData, setFormData] = useState({
    budget: '',
    days: '',
    startingCity: '',
    destinationCity: '',
    vibe: 'adventure'
  });
  const [activeTab, setActiveTab] = useState('planner');
  const [packageSearch, setPackageSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const packagesList = [
    { id: 1, title: 'Goa Party & Beaches', details: '4 Days • Flights excluded • Premium Beach Resort', price: 9999 },
    { id: 2, title: 'Gokarna Beach Trek', details: '3 Days • Train from Hubballi • Paradise Beach', price: 3499 },
    { id: 3, title: 'Hampi Heritage & Boulders', details: '2 Days • Bus from AC City • Cycle tour', price: 2999 },
    { id: 4, title: 'Triund Trek, Dharamshala', details: '4 Days • Bus from Delhi • Tent Stay', price: 4500 },
    { id: 5, title: 'Manali Snow Adventure', details: '5 Days • Volvo Bus • Solang Valley', price: 7499 },
    { id: 6, title: 'South Goa Serenity', details: '4 Days • Yoga & Wellness • Palolem Beach', price: 8999 }
  ];

  const filteredPackages = packagesList.filter(pkg => 
    pkg.title.toLowerCase().includes(packageSearch.toLowerCase()) || 
    pkg.details.toLowerCase().includes(packageSearch.toLowerCase())
  );

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!token) {
      toast.error("Please login first to plan your trip!");
      navigate('/login');
      return;
    }

    if (!formData.budget || !formData.days || !formData.startingCity || !formData.destinationCity) return;
    
    setLoading(true);
    try {
      const response = await axios.post('https://budgetpacker-ai-powered-trip-planner.onrender.com//api/trips/generate', {
        budget: Number(formData.budget),
        days: Number(formData.days),
        startingCity: formData.startingCity,
        destinationCity: formData.destinationCity,
        vibe: formData.vibe
      });
      navigate(`/plan/${response.data._id}`);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 429) {
        toast.error("AI service is busy (Quota exceeded). Please wait 1 minute and try again.");
      } else {
        toast.error("Failed to generate trip. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-slate-50/50">
      {/* Background with abstract animated shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Next-Gen Travel Planning
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 font-display">
            Your Premium <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">Travel Companion</span>
          </h1>
          <p className="text-xl text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience AI-driven planning that fits your pocket. From budget hostels to premium stays, we plan every detail so you can just explore.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2"><MapPin size={16} /> 500+ Cities</div>
            <div className="flex items-center gap-2"><Compass size={16} /> AI Optimized</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-[2rem] p-4 sm:p-2 border-white/40 overflow-hidden"
        >
          <div className="bg-white/40 p-4 sm:p-8 rounded-[1.8rem] border border-white/20">
            {/* Tabs */}
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-8 relative">
              <button 
                onClick={() => setActiveTab('planner')}
                className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all relative z-10 ${activeTab === 'planner' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {activeTab === 'planner' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white shadow-sm rounded-xl" />}
                <span className="relative">AI Planner</span>
              </button>
              <button 
                onClick={() => setActiveTab('packages')}
                className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all relative z-10 ${activeTab === 'packages' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {activeTab === 'packages' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white shadow-sm rounded-xl" />}
                <span className="relative">Packages</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'planner' ? (
                <motion.form 
                  key="planner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                        Starting From
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input 
                          required type="text" name="startingCity" 
                          onChange={handleChange} value={formData.startingCity}
                          placeholder="e.g. Delhi" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                        Going To
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input 
                          required type="text" name="destinationCity" 
                          onChange={handleChange} value={formData.destinationCity}
                          placeholder="e.g. Manali" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                        Total Budget
                      </label>
                      <div className="relative group">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input 
                          required type="number" name="budget" 
                          onChange={handleChange} value={formData.budget}
                          placeholder="e.g. 15000" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                        Trip Duration (Days)
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input 
                          required type="number" name="days" 
                          onChange={handleChange} value={formData.days}
                          placeholder="3" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                      Vibe Preference
                    </label>
                    <div className="relative group">
                      <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                      <select 
                        name="vibe" onChange={handleChange} value={formData.vibe}
                        className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all appearance-none font-medium text-slate-700"
                      >
                        <option value="adventure">Adventure & Trekking</option>
                        <option value="peaceful">Peaceful Nature & Hills</option>
                        <option value="historical">Historical & Cultural</option>
                        <option value="party">Party & Beaches</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 rounded-[1.2rem] bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" /> Planning magic...</>
                    ) : (
                      <>
                        <span>Generate Itinerary</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Compass size={20} className="text-brand-400" />
                        </motion.div>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="packages"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      placeholder="Search (e.g. Goa, Manali, Trek...)"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                      value={packageSearch}
                      onChange={(e) => setPackageSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredPackages.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredPackages.map(pkg => (
                          <div key={pkg.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-sm hover:shadow-premium transition-all group">
                            <div className="space-y-1">
                              <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">{pkg.title}</h3>
                              <p className="text-slate-400 text-sm italic">{pkg.details}</p>
                              <div className="pt-2">
                                <span className="font-extrabold text-2xl text-slate-900 tracking-tight">₹{pkg.price.toLocaleString()}</span>
                                <span className="text-xs text-slate-400 font-bold ml-1 uppercase">/ pax</span>
                              </div>
                            </div>
                            <button onClick={() => alert('Booking system coming soon!')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-600 transition-all w-full sm:w-auto">
                              Details
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-slate-400 font-medium">No packages found for "{packageSearch}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
