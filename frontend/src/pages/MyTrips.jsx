import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Map, Calendar, IndianRupee, ArrowRight, Compass, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from '../components/Skeleton';

const MyTrips = () => {
  const { token, loading: authLoading } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login');
    }
  }, [token, authLoading, navigate]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/users/saved-trips');
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [token]);

  if (loading || authLoading) return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <Skeleton variant="title" className="w-1/4 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display mb-2">My Adventures</h1>
            <p className="text-slate-500 font-medium tracking-tight">Your collection of planned travels and budget getaways.</p>
          </motion.div>
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
            <Compass size={20} />
            <span>New Trip</span>
          </Link>
        </div>
        
        {trips.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-16 rounded-[3rem] text-center border-white/40">
            <div className="mx-auto w-24 h-24 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6">
              <Map size={48} />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-3 font-display">No Saved Tales</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">Your luggage is empty! Start planning your next budget adventure today.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Launch AI Planner <ArrowRight size={20} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip, idx) => {
              const currentPlan = trip.itinerary[trip.itinerary.length - 1];
              return (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="z-10 w-[95%] sm:w-full max-w-md"
                >
                  <Link to={`/plan/${trip._id}`} className="group block h-full">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium group-hover:shadow-premium-hover transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
                      {/* Decorative corner */}
                      <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 text-brand-500 mb-4">
                          <div className="px-3 py-1 rounded-full bg-brand-50 text-[10px] font-bold uppercase tracking-widest border border-brand-100">
                            Planned
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors leading-tight font-display">
                          {trip.startingCity} <span className="text-slate-300 mx-1">→</span> {currentPlan?.tripDetails?.destination || trip.destinationCity}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 mb-6">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/50"><Calendar size={14} className="text-slate-400" /> {trip.days} Days</span>
                          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl border border-green-100/50 font-extrabold tracking-tight">₹{trip.budget.toLocaleString()}</span>
                        </div>
                        
                        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6 font-medium italic">
                          "{currentPlan?.accommodation || 'Custom accommodation'}"
                        </p>
                      </div>

                      <div className="relative z-10 pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-brand-500 transition-colors">
                          View Trip <ArrowRight size={14} />
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
                           <Compass size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
