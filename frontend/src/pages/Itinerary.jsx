import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Train, Home, CheckCircle2, MessageSquare, Send, Loader2, Bookmark, Printer, GitCompareArrows, X, MapPin, Calendar, IndianRupee, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';

const Itinerary = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatting, setChatting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const chatEndRef = useRef(null);
  const compareRef = useRef(null);
  const { user, token } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.error("Failed to load trip");
      }
    };
    fetchTrip();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [trip?.chatHistory]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Optimistic UI updates could be added here, but keep it simple for now
    const msg = chatInput;
    setChatInput('');
    setChatting(true);
    
    try {
      const res = await axios.post(`http://localhost:5000/api/trips/${id}/chat`, { message: msg });
      setTrip(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setChatting(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!token) {
      alert("Please log in to save trips!");
      return;
    }
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/users/save-trip', { tripId: id });
      alert("Trip saved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save trip");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!trip) return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="space-y-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4 w-2/3">
              <Skeleton variant="title" className="w-1/2" />
              <Skeleton variant="text" className="w-1/3" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <div className="space-y-8">
            <Skeleton variant="title" className="w-32" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6 pl-2">
                <Skeleton variant="circle" className="w-10 h-10" />
                <Skeleton className="flex-1 h-48 rounded-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-96 bg-white border-l border-slate-100 hidden md:block">
        <Skeleton className="h-full" />
      </div>
    </div>
  );

  const currentPlan = trip?.itinerary?.[trip.itinerary?.length - 1];

  if (!currentPlan) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Itinerary Data Error</h2>
        <p className="text-slate-500 mb-6">We couldn't parse the travel plan correctly.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-brand-500 text-white rounded-xl font-bold">Retry</button>
      </div>
    </div>
  );

  const handleCompare = async () => {
    if (comparing) return;
    setComparing(true);
    setCompareData(null);
    
    // Scroll to the comparison section immediately
    setTimeout(() => {
      compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    const lowerBudget = Math.max(1000, Math.round(trip.budget * 0.6));
    const higherBudget = Math.round(trip.budget * 1.5);
    try {
      const [lowerRes, higherRes] = await Promise.all([
        axios.post('http://localhost:5000/api/trips/generate', {
          budget: lowerBudget,
          days: trip.days,
          startingCity: trip.startingCity,
          destinationCity: trip.destinationCity || currentPlan.tripDetails?.destination,
          vibe: trip.vibe
        }),
        axios.post('http://localhost:5000/api/trips/generate', {
          budget: higherBudget,
          days: trip.days,
          startingCity: trip.startingCity,
          destinationCity: trip.destinationCity || currentPlan.tripDetails?.destination,
          vibe: trip.vibe
        })
      ]);
      setCompareData({
        lower: { budget: lowerBudget, plan: lowerRes.data.itinerary[0] },
        current: { budget: trip.budget, plan: currentPlan },
        higher: { budget: higherBudget, plan: higherRes.data.itinerary[0] }
      });
      // Scroll again after data loads
      setTimeout(() => {
        compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      console.error(err);
      alert('Failed to generate comparison. Please try again.');
    } finally {
      setComparing(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Side - Itinerary View */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto print:p-0 print:overflow-visible">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto print:max-w-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 font-display tracking-tight">
                Your Trip to <span className="text-brand-600">{currentPlan.tripDetails?.destination || trip.destinationCity}</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                From {trip.startingCity} • {trip.days} Days • Est. Cost: <span className="text-slate-900 font-bold">₹{currentPlan.tripDetails?.totalEstimatedCost || currentPlan.totalEstimatedCost}</span>
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 print:hidden flex-wrap">
              <button 
                onClick={handleCompare}
                disabled={comparing}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {comparing ? <Loader2 size={18} className="animate-spin text-brand-500" /> : <GitCompareArrows size={18} className="text-brand-500" />}
                {comparing ? 'Analyzing alternatives...' : 'Compare Options'}
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold shadow-sm transition-all"
              >
                <Printer size={18} className="text-slate-400" /> Print
              </button>
              <button 
                onClick={handleSaveTrip}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-2.5 bg-slate-900 rounded-2xl text-white font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all disabled:opacity-50 group"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Bookmark size={18} className="group-hover:fill-brand-500 transition-colors" />} 
                {saving ? 'Saving...' : 'Save Adventure'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] p-7 shadow-premium border border-slate-100 flex items-start gap-6 transition-all"
            >
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner shadow-indigo-100/50"><Train size={24} /></div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">Transportation</h3>
                <p className="text-slate-500 text-sm leading-relaxed"><strong>Outbound:</strong> {currentPlan.transportation?.outbound || 'Check tickets'}</p>
                <p className="text-slate-500 text-sm leading-relaxed mt-1"><strong>Return:</strong> {currentPlan.transportation?.return || 'Check tickets'}</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] p-7 shadow-premium border border-slate-100 flex items-start gap-6 transition-all"
            >
              <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl shadow-inner shadow-brand-100/50"><Home size={24} /></div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">Accommodation</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{currentPlan.accommodation || 'Local Hostels/Hotels'}</p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-12">
            <div className="flex items-end justify-between px-2">
              <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">Day by Day Plan</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Guided Journey</span>
            </div>
            
            <div className="relative border-l-2 border-slate-100 ml-6 space-y-12 pb-12">
              {currentPlan.dailyItinerary?.map((day, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                  key={idx} className="relative pl-10"
                >
                  <div className="absolute -left-[13px] top-2 bg-white border-4 border-brand-500 text-brand-600 w-6 h-6 rounded-full shadow-lg z-10" />
                  
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-50 hover:shadow-premium-hover transition-all duration-500 group">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                      <div>
                        <div className="text-brand-500 font-black text-xs uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                          Day {day.day} <div className="w-1.5 h-1.5 rounded-full bg-brand-200" /> {day.activities?.length || 0} Places
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight group-hover:text-brand-600 transition-colors">
                          {day.theme}
                        </h3>
                      </div>
                      <div className="bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100/50 flex items-center gap-2 transition-all group-hover:bg-brand-50 group-hover:border-brand-100">
                        <IndianRupee size={14} className="text-brand-500" />
                        <span className="text-slate-600 font-bold text-sm tracking-tight group-hover:text-brand-700">₹{day.dailyCost}</span>
                      </div>
                    </div>
                    
                    {(() => {
                      const city = (currentPlan.tripDetails?.destination || trip.destinationCity || "").split(' ')[0];
                      
                      return (
                        <div className="space-y-12">
                          {/* Activities Section */}
                          <div>
                            <h4 className="font-bold text-slate-900 text-xl flex items-center gap-3 mb-6 px-1">
                              <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 shadow-sm"><Compass size={22} /></div>
                              Exploration Highlights
                            </h4>
                            
                            {/* 1 Row of Images */}
                            <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar -mx-1 print:overflow-visible print:flex-wrap print:pb-0">
                              {day.activities?.map((act, i) => {
                                const isObject = typeof act === 'object';
                                const title = isObject ? act.title : act;
                                const keyword = isObject ? act.imageSearchTerm : `${city} ${act}`;
                                
                                // Better pruning: Keep more descriptive words for diversity
                                const prunedTags = keyword.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(w => w.length > 3).slice(0, 3).join(',');
                                const finalTags = `${city},${prunedTags},travel`;

                                return (
                                  <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                    className="flex-shrink-0 w-48 sm:w-64 group/card relative aspect-video rounded-[1.5rem] overflow-hidden shadow-md border border-slate-100 transition-all duration-500"
                                  >
                                    <img 
                                      src={`https://loremflickr.com/800/600/${finalTags}?random=${idx}${i}`} 
                                      alt={title}
                                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 brightness-95 group-hover/card:brightness-100 print:brightness-100 print:filter-none"
                                      loading="eager"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-3 w-full">
                                      <p className="text-white font-bold text-xs truncate drop-shadow-md">{title}</p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                            
                            {/* List below */}
                            <ul className="mt-8 space-y-4 px-2">
                              {day.activities?.map((act, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium group/item">
                                  <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-brand-500 group-hover/item:text-white transition-all transform group-hover/item:scale-110">
                                    <CheckCircle2 size={14} />
                                  </div>
                                  <span className="group-hover/item:text-slate-900 transition-colors uppercase text-xs tracking-wide">
                                    {typeof act === 'object' ? act.title : act}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Food Section */}
                          <div className="pt-8 border-t border-slate-50">
                            <h4 className="font-bold text-slate-900 text-xl flex items-center gap-3 mb-6 px-1">
                              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm"><MapPin size={22} /></div>
                              Local Flavors To Try
                            </h4>

                            {/* 1 Row of Food Images */}
                            <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar -mx-1 print:overflow-visible print:flex-wrap print:pb-0">
                              {day.food?.map((f, i) => {
                                const isObject = typeof f === 'object';
                                const title = isObject ? f.title : f;
                                const foodKeyword = isObject ? f.imageSearchTerm : `${city} ${f}`;
                                const prunedFoodTags = foodKeyword.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(w => w.length > 3).slice(0, 2).join(',');
                                // Prioritize food and city to avoid generic person images
                                const finalFoodTags = `food,travel,${city},${prunedFoodTags}`;

                                return (
                                  <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                    className="flex-shrink-0 w-32 sm:w-40 group/food relative aspect-square rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 transition-all duration-500"
                                  >
                                    <img 
                                      src={`https://loremflickr.com/400/400/${finalFoodTags}?random=${idx}${i}`} 
                                      alt={title}
                                      className="w-full h-full object-cover group-hover/food:scale-110 transition-transform duration-700 brightness-95 print:brightness-100 print:filter-none"
                                      loading="eager"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover/food:bg-black/10 transition-all" />
                                  </motion.div>
                                );
                              })}
                            </div>
                            
                            {/* List below */}
                            <div className="mt-8 flex flex-wrap gap-2 px-1">
                              {day.food?.map((f, i) => (
                                <span 
                                  key={i} 
                                  className="px-4 py-2 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-100 hover:bg-orange-100 transition-colors"
                                >
                                  {typeof f === 'object' ? f.title : f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Things to Carry */}
          {currentPlan.thingsToCarry && currentPlan.thingsToCarry.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 px-1">🎒 Things to Carry</h2>
              <div className="bg-white rounded-[2rem] p-8 shadow-premium border border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.thingsToCarry.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Summary & Expenses</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4 border-b border-slate-100">Day</th>
                    <th className="px-6 py-4 border-b border-slate-100">Theme</th>
                    <th className="px-6 py-4 border-b border-slate-100 hidden sm:table-cell">Key Highlights</th>
                    <th className="px-6 py-4 border-b border-slate-100 text-right">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 whitespace-nowrap sm:whitespace-normal">
                  {currentPlan.dailyItinerary.map((day, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{day.day}</td>
                      <td className="px-6 py-4 font-medium text-brand-600">{day.theme}</td>
                      <td className="px-6 py-4 hidden sm:table-cell truncate max-w-[200px]" title={day.activities.map(a => typeof a === 'object' ? a.title : a).join(", ")}>
                        {typeof day.activities[0] === 'object' ? day.activities[0].title : day.activities[0]}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-700">₹{day.dailyCost}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-bold text-slate-800 hidden sm:table-cell">Total Estimated Cost</td>
                    <td colSpan="2" className="px-6 py-4 text-left sm:hidden font-bold text-slate-800">Total</td>
                    <td className="px-6 py-4 text-right font-extrabold text-brand-600 text-lg">
                      ₹{currentPlan.tripDetails?.totalEstimatedCost || currentPlan.totalEstimatedCost}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Budget Comparison Section */}
          <div ref={compareRef}>
          {comparing && !compareData && (
            <div className="mt-12 space-y-6 print:hidden">
              <h2 className="text-2xl font-bold text-slate-900">Generating Comparison...</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map(i => (
                  <div key={i} className="rounded-2xl p-6 border border-slate-100 bg-white shadow-sm animate-pulse">
                    <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {compareData && (
            <div className="mt-12 space-y-6 print:hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Budget Comparison</h2>
                <button onClick={() => setCompareData(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[compareData.lower, compareData.current, compareData.higher].map((item, idx) => (
                  <div key={idx} className={`rounded-2xl p-6 border shadow-premium transition-all ${
                    idx === 1 
                      ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-500 scale-[1.02]' 
                      : 'bg-white border-slate-100 hover:shadow-md'
                  }`}>
                    {idx === 1 && <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Current Plan</span>}
                    {idx === 0 && <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Budget Saver</span>}
                    {idx === 2 && <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Premium</span>}
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">₹{item.budget.toLocaleString()}</h3>
                    <p className="text-sm text-slate-500 mb-4">Total Budget</p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transport</span>
                        <span className="font-medium text-slate-800 text-right truncate ml-2 max-w-[150px]">{item.plan.transportation?.outbound || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Stay</span>
                        <span className="font-medium text-slate-800 text-right truncate ml-2 max-w-[150px]">{item.plan.accommodation || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Est. Total</span>
                        <span className="font-bold text-brand-600">₹{item.plan.tripDetails?.totalEstimatedCost || item.plan.totalEstimatedCost || 'N/A'}</span>
                      </div>
                      <hr className="border-slate-100" />
                      <div className="text-slate-500 text-xs">
                        {item.plan.dailyItinerary?.map(d => d.theme).join(' → ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </motion.div>
      </div>

    </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-[100] print:hidden">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-brand-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><MessageSquare size={20} /></div>
                  <div>
                    <h3 className="font-bold">Trip Assistant</h3>
                    <p className="text-[10px] text-white/80 opacity-80 uppercase tracking-widest font-black">AI Guide</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[85%] text-sm text-slate-700">
                  Hey! I'm your travel buddy. Want to adjust this plan? Just ask me! (e.g. "Find cheaper stay" or "Add one more day")
                </div>
                
                {trip.chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl p-4 max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-brand-500 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatting && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-2">
                      <Loader2 className="animate-spin text-slate-400" size={16} /> <span className="text-sm text-slate-400 font-medium">Fine-tuning...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleChat} className="flex gap-2 relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask assistant to rethink..." 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none pr-12 text-sm font-medium transition-all"
                    disabled={chatting}
                  />
                  <button 
                    type="submit" 
                    disabled={chatting || !chatInput.trim()}
                    className="absolute right-2 top-2 p-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-all shadow-md active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isChatOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-brand-500 text-white'}`}
        >
          {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-600"></span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default Itinerary;
