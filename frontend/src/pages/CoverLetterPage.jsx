import { useState } from 'react';
import { PenTool, Sparkles, Copy, Download } from 'lucide-react';
import api from '../lib/axios';

export default function CoverLetterPage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    
    setGenerating(true);
    setError('');
    
    try {
      const response = await api.post('/cover-letter', { job_description: description });
      
      // Load the generated content from Laravel response
      setResult(response.data.content);
    } catch (err) {
      if (err.response?.status === 401) {
         setError('You must be logged in to use this AI feature.');
      } else {
         setError('Failed to connect to backend securely. ' + (err.response?.data?.message || ''));
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Cover Letter</h1>
        <p className="text-gray-500 mt-1">Generate personalized cover letters tailored to specific jobs using the backend Gemini integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2"><PenTool className="text-primary-600" /> Target Job</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paste Job Description</label>
            <textarea 
              rows="8" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none"
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] active:scale-95"
          >
            {generating ? <Sparkles className="animate-spin" /> : <Sparkles />}
            {generating ? "Generating with Backend AI..." : "Generate Cover Letter"}
          </button>
        </div>

        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 flex flex-col h-[500px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-4">Your Cover Letter</h2>
          
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 overflow-y-auto font-serif text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {result || <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center px-4">Your AI-generated text will appear here.<br/><br/>(Remember: You must be signed in for the API request to succeed securely!)</div>}
          </div>

          <div className="flex gap-4 mt-6">
            <button disabled={!result} className="flex-1 flex gap-2 items-center justify-center p-3 border border-gray-300 bg-white rounded-xl text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-50 transition-all">
              <Copy className="w-5 h-5"/> Copy Text
            </button>
            <button disabled={!result} className="flex-1 flex gap-2 items-center justify-center p-3 bg-gray-900 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-gray-800 transition-all">
              <Download className="w-5 h-5"/> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
