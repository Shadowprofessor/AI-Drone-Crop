import React, { useState, useRef } from 'react';
import { Camera, Zap, ShieldCheck, History, Maximize2, RefreshCw, Cpu, Upload, Brain, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const HistoryItem = ({ diagnosis, date, confidence }) => (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group hover:translate-x-1">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors border border-white/5">
            <Camera size={20} />
        </div>
        <div className="flex-1">
            <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{diagnosis}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">{date}</div>
        </div>
        <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">{(confidence * 100).toFixed(0)}%</div>
    </div>
);

const ReportSection = ({ title, content, icon: Icon, colorClass }) => (
    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors space-y-3 group">
        <div className={`text-[10px] font-bold ${colorClass} uppercase tracking-widest flex items-center gap-2`}>
            <Icon size={14} className="group-hover:scale-110 transition-transform" />
            {title}
        </div>
        <p className="text-zinc-400 text-xs leading-relaxed">{content}</p>
    </div>
);

export default function VisionAI() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
        setAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://127.0.0.1:8000/analyze/', formData);
            setResult(res.data);
        } catch (error) {
            console.error("Analysis failed", error);
            setResult({
                disease: "Analysis Connection Interrupted",
                confidence: 0,
                report: {
                    summary: "Unable to establish communication with the AMD Edge Computing Node.",
                    cure: "Verify backend server status on Port 8000."
                },
                provider: "OFFLINE"
            });
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen bg-mesh"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20">Active Intelligence</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-2 font-display italic">
                        CROP <span className="text-gradient">VISION</span> AI
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-tight max-w-md">
                        Harnessing the power of AMD Ryzen™ NPU for instantaneous plant pathology diagnosis at the edge.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex gap-4"
                >
                    <div className="glass-card px-6 py-3 flex items-center gap-4 border border-white/10 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Cpu size={20} className="text-purple-400 relative z-10" />
                        <div className="relative z-10">
                            <div className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Processing Core</div>
                            <div className="text-xs font-mono text-white font-bold tracking-tight">AMD RYZEN™ AI NPU</div>
                        </div>
                    </div>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visualizer Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card aspect-video relative overflow-hidden group border border-white/10 bg-black/40 shadow-2xl rounded-[2.5rem]">
                        {/* HUD Navigation Elements */}
                        <div className="absolute inset-8 border border-white/5 border-dashed rounded-[2rem] pointer-events-none z-10">
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-16 h-16 border-t-2 border-l-2 border-emerald-500/50 absolute top-0 left-0 rounded-tl-xl"
                            ></motion.div>
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                className="w-16 h-16 border-t-2 border-r-2 border-emerald-500/50 absolute top-0 right-0 rounded-tr-xl"
                            ></motion.div>
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                                className="w-16 h-16 border-b-2 border-l-2 border-emerald-500/50 absolute bottom-0 left-0 rounded-bl-xl"
                            ></motion.div>
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                                className="w-16 h-16 border-b-2 border-r-2 border-emerald-500/50 absolute bottom-0 right-0 rounded-br-xl"
                            ></motion.div>
                        </div>

                        {/* Scanline & Noise */}
                        <div className="absolute inset-0 bg-scanlines z-20 pointer-events-none opacity-10"></div>

                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {previewUrl ? (
                                    <motion.img
                                        key={previewUrl}
                                        initial={{ filter: 'blur(20px)', scale: 1.1, opacity: 0 }}
                                        animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center gap-6"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                                            <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/10 relative z-10 shadow-inner">
                                                <Camera className="text-zinc-600 group-hover:text-emerald-500 transition-colors" size={40} strokeWidth={1.5} />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] text-zinc-600 font-bold tracking-[0.5em] uppercase mb-1">Awaiting Feed</div>
                                            <div className="text-xs text-zinc-500 font-mono italic">NODE_STATUS: DISCONNECTED</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Processing Overlay */}
                            {analyzing && (
                                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full mb-6"
                                    ></motion.div>
                                    <div className="font-mono text-[10px] text-emerald-500 tracking-[0.3em] font-bold">CALCULATING PROBABILITIES...</div>
                                    <div className="mt-2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                            className="w-1/2 h-full bg-emerald-500"
                                        ></motion.div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Telemetry Bar */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-40 flex items-center justify-between border-t border-white/5">
                            <div className="flex gap-8">
                                <div className="space-y-1">
                                    <div className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase">Resolution</div>
                                    <div className="text-[10px] text-white font-mono">1024 x 1024</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase">Stream Latency</div>
                                    <div className="text-[10px] text-emerald-500 font-mono">12ms</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase">Target Node</div>
                                    <div className="text-[10px] text-white font-mono uppercase">LiteWing_A1</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="px-3 py-1 bg-zinc-900/80 rounded-full border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-mono text-zinc-400">FPS: 60.0</span>
                                </div>
                                <Maximize2 size={14} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={analyzing}
                            className="flex-1 py-8 glass-card bg-emerald-500 transition-all duration-500 hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] text-black flex items-center justify-center gap-4 font-black tracking-[0.2em] uppercase disabled:opacity-50 group border-none"
                        >
                            <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                            {analyzing ? "Synthesizing Data..." : "New Field Analysis"}
                        </button>
                    </div>
                </div>

                {/* Analysis Result Sidepanel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-8 min-h-[500px] flex flex-col relative overflow-hidden bg-[#0a0a0b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white tracking-tight">
                                <Brain size={24} className="text-purple-400" />
                                Diagnostic Insights
                            </h3>
                            <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                                <Info size={14} />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="report-active"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8 relative z-10 flex-1"
                                >
                                    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-inner">
                                        <div className="flex items-center gap-2 mb-3">
                                            {result.confidence > 0.8 ? (
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            ) : (
                                                <AlertTriangle size={16} className="text-amber-500" />
                                            )}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${result.confidence > 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {result.severity} Severity Detected
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tighter text-white leading-tight mb-4">{result.disease}</h2>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase font-mono">Certainty Index</span>
                                                <span className="text-xl font-mono text-emerald-500 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.confidence * 100}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advanced LLM Report Sections */}
                                    <div className="grid gap-4">
                                        <ReportSection
                                            title="Analysis Summary"
                                            content={result.report?.summary}
                                            icon={Info}
                                            colorClass="text-blue-400"
                                        />
                                        <ReportSection
                                            title="Scientific Cure / Treatment"
                                            content={result.report?.cure || result.report?.chemical_treatment}
                                            icon={Zap}
                                            colorClass="text-emerald-400"
                                        />
                                        {result.report?.prevention && (
                                            <ReportSection
                                                title="Bio-Prevention Strategy"
                                                content={result.report?.prevention}
                                                icon={ShieldCheck}
                                                colorClass="text-purple-400"
                                            />
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1 font-mono">Engine</div>
                                            <div className="text-xs text-zinc-400 font-mono font-bold">{result.provider}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1 font-mono">Response</div>
                                            <div className="text-xs text-emerald-500 font-mono font-bold">~420ms</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="report-empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center text-zinc-800 space-y-6"
                                >
                                    <div className="relative">
                                        <Cpu size={80} strokeWidth={0.5} className="text-zinc-800 group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-ping scale-150 opacity-20"></div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-[0.4em]">Subsystem Standby</div>
                                        <p className="text-[10px] text-zinc-500 font-mono italic max-w-xs uppercase leading-relaxed">System awaiting optical input for differential diagnostic evaluation.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4">
                        <header className="flex justify-between items-center px-2">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                <History size={12} /> Temporal Analytics
                            </h4>
                            <span className="text-[8px] font-mono text-zinc-600">SESSION_ID: 88AF-0X</span>
                        </header>
                        <div className="space-y-3">
                            <HistoryItem diagnosis="Tomato Leaf Curl Virus" date="14 OCT 2023 | 12:44" confidence={0.92} />
                            <HistoryItem diagnosis="Potato Late Blight" date="13 OCT 2023 | 09:12" confidence={0.98} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
