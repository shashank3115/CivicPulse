import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Link2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import { CopilotResponse } from '../../types';

export default function AskCivicPulse() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{type: 'user'|'bot', text: string, data?: CopilotResponse}[]>([]);

  const handleAsk = async (e?: React.FormEvent, q?: string) => {
    if (e) e.preventDefault();
    const finalQ = q || query;
    if (!finalQ.trim()) return;

    setHistory(prev => [...prev, { type: 'user', text: finalQ }]);
    setQuery('');
    setLoading(true);

    const res = await apiClient.askCopilot(finalQ);
    if (res) {
      setHistory(prev => [...prev, { type: 'bot', text: res.answer, data: res }]);
    } else {
      setHistory(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error connecting to the intelligence engine.' }]);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-sky-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 group"
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-cardBg rounded-2xl shadow-2xl border border-borderLight flex flex-col overflow-hidden z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex justify-between items-center text-white">
        <div className="flex items-center font-bold">
          <Sparkles className="w-5 h-5 mr-2 text-primary" /> Ask CivicPulse AI
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50/50">
        {history.length === 0 && (
          <div className="text-center mt-8">
            <Sparkles className="w-12 h-12 text-primary/20 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4">Ask anything about infrastructure gaps, citizen demand, or regional priorities.</p>
            <div className="space-y-2">
              {['Which districts have the worst road quality?', 'Summarize recent complaints in Palghar', 'Why is Nashik prioritized?'].map(s => (
                <button key={s} onClick={() => handleAsk(undefined, s)} className="block w-full text-left text-xs p-2 bg-white border border-slate-200 rounded-lg hover:border-primary text-slate-700 transition-colors">
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}
        
        {history.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.type === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
            }`}>
              {msg.text}
              {msg.data && msg.data.evidence && msg.data.evidence.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <div className="text-xs font-semibold text-slate-500 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Evidence Sources</div>
                  {msg.data.evidence.map((e, idx) => (
                    <div key={idx} className="text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 truncate">{e}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center text-primary text-sm p-3"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-borderLight">
        <form onSubmit={handleAsk} className="flex relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Copilot..." 
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <button type="submit" disabled={!query || loading} className="absolute right-2 top-1.5 p-1.5 bg-primary hover:bg-sky-600 disabled:bg-slate-300 text-white rounded-lg transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
