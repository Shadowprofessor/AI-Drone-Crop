import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Camera,
    Settings,
    User,
    LogOut,
    Activity,
    Sprout,
    Menu,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import Dashboard from './pages/Dashboard';
import VisionAI from './pages/VisionAI';

// Sidebar Item Component
const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className="relative group flex items-center">
        <div className={`
      flex items-center gap-4 px-6 py-4 w-full transition-all duration-300
      ${active ? 'text-emerald-400 bg-emerald-500/5 border-r-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
    `}>
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="font-medium tracking-wide text-sm">{label}</span>
        </div>
        {active && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-emerald-500/10 blur-xl" />
        )}
    </Link>
);

const AppContent = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-transparent relative z-10 transition-colors duration-500">
            {/* Sidebar */}
            <aside className="w-64 glass-card m-6 rounded-3xl overflow-hidden flex flex-col border border-white/5 shadow-2xl">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Sprout className="text-black" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">LiteWing</span>
                </div>

                <nav className="flex-1 mt-4">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
                    <SidebarItem to="/vision" icon={Camera} label="Vision AI" active={location.pathname === '/vision'} />
                    <SidebarItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
                </nav>

                <div className="p-6 mt-auto">
                    <div className="glass-card p-4 flex items-center gap-3 bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xs font-bold text-white truncate">John Doe</div>
                            <div className="text-[10px] text-zinc-500 truncate">Researcher</div>
                        </div>
                        <LogOut size={16} className="text-zinc-600 hover:text-red-400 cursor-pointer transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Main Section */}
            <main className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/vision" element={<VisionAI />} />
                        <Route path="/settings" element={<div className="p-8 text-zinc-600 font-mono text-xs tracking-widest uppercase">System Settings Under Construction</div>} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <ThreeBackground />
            <AppContent />
        </Router>
    );
}
