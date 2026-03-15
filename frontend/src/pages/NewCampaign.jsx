import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileSpreadsheet, Send, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function NewCampaign() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid Excel (.xlsx) file.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please upload an Excel file containing contact numbers.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message to broadcast.');
      return;
    }

    setLoading(true);
    
    // Create FormData specifically since we're sending a file buffer
    const formData = new FormData();
    formData.append('excelFile', file);
    formData.append('message', message);

    try {
      // For now we'll pretend there's an endpoint /api/campaigns
      // The implementation on the backend will be Part 3
      const response = await api.post('/campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Campaign successfully queued for broadcasting!');
      setFile(null);
      setMessage('');
      
      // Let success message show for a second before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create campaign. Ensure backend is setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans p-6 sm:p-12 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-white">Create New Campaign</h1>
          <p className="text-slate-400 mb-8">Upload your contact list and compose your broadcast message.</p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 shrink-0">✓</div>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                1. Upload Contacts (Excel .xlsx)
              </label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors
                  ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'}`}
              >
                <input
                  type="file"
                  id="excelUpload"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="excelUpload" className="cursor-pointer flex flex-col items-center">
                  {file ? (
                    <>
                      <FileSpreadsheet className="w-12 h-12 text-emerald-400 mb-4" />
                      <span className="text-emerald-300 font-medium text-lg">{file.name}</span>
                      <span className="text-slate-400 text-sm mt-2">Click to replace file</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                      <span className="text-white font-medium text-lg mb-2">Click to upload Excel file</span>
                      <span className="text-slate-400 text-sm">Only .xlsx files are supported</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Message Compose Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                2. Compose Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Type your WhatsApp message here. E.g., Hi, this is a special offer just for you!..."
                className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-2xl shadow-inner text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Launch Campaign
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
