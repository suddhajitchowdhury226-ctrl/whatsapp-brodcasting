import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MessageSquare, Users, FileSpreadsheet, Zap } from 'lucide-react';

function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800 backdrop-blur-md bg-slate-900/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">WACast</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 rounded-lg text-slate-300 hover:text-white transition-colors duration-200">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200">
            Start Broadcasting
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center flex-grow justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>The easiest way to reach your audience directly</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Broadcast to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Thousands</span> in Minutes.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your Excel sheets, compose a beautiful message, and hit send. No coding required, just pure engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1">
              Start Your Free Trial
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-all duration-300">
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-32 max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FileSpreadsheet className="w-8 h-8 text-cyan-400" />}
            title="Excel Uploads"
            description="Just drop your .xlsx files. We parse and extract all phone numbers automatically."
          />
          <FeatureCard 
            icon={<MessageSquare className="w-8 h-8 text-emerald-400" />}
            title="Rich Messages"
            description="Send text, images, or documents safely with built-in compliance delays to prevent bans."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-purple-400" />}
            title="Audience Insights"
            description="Track successful deliveries, failures, and keep tabs on campaigns from the dashboard."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm text-left hover:bg-slate-800/60 transition-colors duration-300">
      <div className="bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
