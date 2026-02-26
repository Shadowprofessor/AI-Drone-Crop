import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Activity, Thermometer, Droplets, Zap, ChevronRight, AlertTriangle, ShieldCheck, Map, Wifi, Battery, Navigation, Wind, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const KPI_CARD = ({ title, value, unit, icon: Icon, color, trend, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`glass-card p-6 border-b-2 ${color} relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500`}
    >
        <div className="absolute top-0 right-0 p-8 bg-current opacity-[0.03] rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${color.replace('border', 'bg')}/10 ${color.replace('border', 'text')} shadow-inner border border-white/5`}>
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <div className={`text-[10px] flex items-center gap-1 font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'} bg-white/5 px-2 py-1 rounded-lg border border-white/5`}>
                <span>{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%</span>
            </div>
        </div>
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{title}</span>
            <div className="text-4xl font-black font-display text-white leading-none flex items-baseline gap-2">
                {value} <span className="text-sm text-zinc-600 font-sans font-medium tracking-tight uppercase">{unit}</span>
            </div>
        </div>
    </motion.div>
);

const StatusIndicator = ({ label, value, color }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-xs font-mono text-white font-bold">{value}</span>
    </div>
);

export default function Dashboard() {
    const [history, setHistory] = useState([]);
    const [latest, setLatest] = useState(null);
    const [loading, setLoading] = useState(true);

    const getPlaceholder = () => Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        nitrogen: 120 + Math.random() * 40,
        phosphorus: 80 + Math.random() * 20,
        potassium: 100 + Math.random() * 30,
        moisture: 35 + Math.random() * 15,
        temperature: 22 + Math.random() * 6,
        ph: 6.5 + Math.random() * 1.0
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/soil/');
                const data = res.data;
                if (data && data.length > 0) {
                    setHistory(data);
                    setLatest(data[data.length - 1]);
                } else {
                    const placeholder = getPlaceholder();
                    setHistory(placeholder);
                    setLatest(placeholder[placeholder.length - 1]);
                }
            } catch (e) {
                console.warn("Backend unavailable, using placeholder data");
                const placeholder = getPlaceholder();
                setHistory(placeholder);
                setLatest(placeholder[placeholder.length - 1]);
            }
            setLoading(false);
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !latest) return (
        <div className="h-screen w-full flex items-center justify-center bg-transparent">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw size={40} className="text-emerald-500 animate-spin" />
                <span className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Initializing Neural Link...</span>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">Operational Control</span>
                        <div className="text-[10px] font-mono text-zinc-500">SYS_TIME: {new Date().toLocaleTimeString()}</div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-2 font-display italic uppercase">
                        FIELD <span className="text-gradient">COMMAND</span>
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-tight max-w-md">
                        Autonomous soil health monitoring & multi-agent telemetry synchronization.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex gap-4 p-2 bg-white/5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl"
                >
                    <div className="px-6 py-3 flex flex-col items-center border-r border-white/5">
                        <Battery className="text-emerald-500 mb-1" size={18} />
                        <span className="text-[10px] font-bold text-white uppercase">98%</span>
                    </div>
                    <div className="px-6 py-3 flex flex-col items-center border-r border-white/5">
                        <Wifi className="text-blue-500 mb-1" size={18} />
                        <span className="text-[10px] font-bold text-white uppercase">Active</span>
                    </div>
                    <div className="px-6 py-3 flex flex-col items-center">
                        <Wind className="text-purple-500 mb-1" size={18} />
                        <span className="text-[10px] font-bold text-white uppercase">4.2<span className="text-[8px] ml-0.5">m/s</span></span>
                    </div>
                </motion.div>
            </header>

            {/* KPI Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPI_CARD title="Nitrogen Persistence" value={latest.nitrogen.toFixed(0)} unit="PPM" icon={Activity} color="border-emerald-500" trend={+4.2} delay={0.1} />
                <KPI_CARD title="Phosphorus Saturation" value={latest.phosphorus.toFixed(0)} unit="PPM" icon={Zap} color="border-amber-500" trend={-2.1} delay={0.2} />
                <KPI_CARD title="Potassium Concentration" value={latest.potassium.toFixed(0)} unit="PPM" icon={ShieldCheck} color="border-blue-500" trend={+1.5} delay={0.3} />
                <KPI_CARD title="Volumetric Moisture" value={latest.moisture.toFixed(1)} unit="%" icon={Droplets} color="border-cyan-500" trend={-3.8} delay={0.4} />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="xl:col-span-8 glass-card p-10 flex flex-col border border-white/10 bg-black/40 shadow-2xl min-h-[500px] rounded-[2.5rem]"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-white italic tracking-tight uppercase mb-1">Nutrient Dynamics</h3>
                            <p className="text-xs text-zinc-500 font-medium">Real-time subsurface temporal analysis</p>
                        </div>
                        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                            {['24H', '7D', '1M', '1Y'].map((range, i) => (
                                <button key={i} className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${range === '24H' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="timestamp"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#444', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(str) => new Date(str).getHours() + ":00"}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="nitrogen" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" />
                                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSec)" strokeDasharray="8 8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
                        <div className="text-center">
                            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Avg Nitrogen</div>
                            <div className="text-sm font-mono text-white font-bold">132.4</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Stability Rate</div>
                            <div className="text-sm font-mono text-emerald-500 font-bold">94.2%</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Anomalies Detected</div>
                            <div className="text-sm font-mono text-amber-500 font-bold">0</div>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Next Sync</div>
                            <div className="text-sm font-mono text-zinc-500 font-bold">04:42</div>
                        </div>
                    </div>
                </motion.div>

                <div className="xl:col-span-4 space-y-8">
                    {/* Environment Gauges */}
                    <div className="glass-card p-8 flex flex-col gap-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-rose-500 opacity-20"></div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight flex items-center gap-3">
                            <Thermometer size={20} className="text-rose-500" /> Atmos Condition
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Ambient Temperature</span>
                                    <span className="font-mono text-3xl font-black text-white italic">{latest.temperature.toFixed(1)}°<span className="text-sm font-sans not-italic text-zinc-600 ml-1">C</span></span>
                                </div>
                                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(latest.temperature / 45) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                                    ></motion.div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Soil pH Balance</span>
                                    <span className="font-mono text-3xl font-black text-white italic">{latest.ph.toFixed(1)}</span>
                                </div>
                                <div className="flex gap-1.5 h-6 items-end">
                                    {[...Array(14)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-sm transition-all duration-700 ${i + 1 === Math.round(latest.ph)
                                                ? 'bg-emerald-500 h-6 shadow-[0_0_20px_#10b981] scale-110'
                                                : (i < latest.ph ? 'bg-zinc-800 h-2' : 'bg-zinc-900 h-1')}`}
                                        ></div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[8px] font-bold text-zinc-700 uppercase tracking-widest px-1">
                                    <span>Acidic</span>
                                    <span>Neutral</span>
                                    <span>Alkaline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Intelligent Insights */}
                    <div className="glass-card p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500 rounded-full blur-[80px]"
                        ></motion.div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                <ShieldCheck size={24} className="text-black" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">AI Strategic Report</h3>
                        </div>

                        <p className="text-zinc-400 text-xs leading-relaxed font-medium mb-8">
                            Field analysis suggests optimal <span className="text-emerald-500">Nitrogen persistence</span>. Moisture levels are trending lower in Sector 4. Recommend autonomous irrigation activation within 120 minutes.
                        </p>

                        <div className="space-y-3 mb-8">
                            <StatusIndicator label="Node Health" value="OPTIMAL" color="bg-emerald-500" />
                            <StatusIndicator label="Network Latency" value="14ms" color="bg-blue-500" />
                            <StatusIndicator label="Security Protocol" value="AES-256" color="bg-zinc-700" />
                        </div>

                        <button className="w-full py-5 rounded-2xl text-[10px] font-black text-white bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-500 uppercase tracking-[0.3em] group shadow-2xl relative overflow-hidden">
                            <span className="relative z-10">Export Full Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
