import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Plus, FileSpreadsheet, Activity } from 'lucide-react';
import api from '../utils/api';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ campaigns: 0, sent: 0, failed: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-xs text-slate-400 capitalize">{user.plan} Plan</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Campaigns" value={stats.campaigns} icon={<Activity className="text-blue-400" />} />
          <StatCard title="Messages Sent" value={stats.sent} icon={<FileSpreadsheet className="text-emerald-400" />} />
          <StatCard title="Messages Failed" value={stats.failed} icon={<Activity className="text-red-400" />} />
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4">Recent Campaigns</h3>
          <div className="text-center py-12 text-slate-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No campaigns yet. Click "New Campaign" to get started.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-4">
      <div className="bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-800">
        {icon}
      </div>
      <div>
        <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
        <p className="text-3xl font-bold mt-1 text-white">{value}</p>
      </div>
    </div>
  );
}
