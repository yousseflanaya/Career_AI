import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function ChatbotWidget() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour, je suis votre mentor CareerAI. Sur quoi avance-t-on aujourd hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isOpen || historyLoaded || !localStorage.getItem('auth_token')) return;
      try {
        const response = await api.get('/chat/history');
        if (response.data?.length) {
          setMessages(response.data.map((message) => ({
            role: message.role,
            content: message.message,
          })));
        }
        setHistoryLoaded(true);
      } catch (error) {
        console.error('Chat history fetch failed', error);
      }
    };

    fetchHistory();
  }, [isOpen, historyLoaded]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await api.post('/chat', { message: newMsg.content, lang: i18n.language });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (err) {
      if (err.response?.status === 401) {
         setMessages(prev => [...prev, { role: 'assistant', content: "Please Sign In to use the AI Assistant!" }]);
      } else {
         setMessages(prev => [...prev, { role: 'assistant', content: err.response?.data?.message || "The backend encountered an error connecting to Gemini API." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-16 h-16 bg-gray-950 hover:bg-gray-800 dark:bg-white dark:text-gray-950 text-white rounded-full shadow-2xl shadow-emerald-500/20 flex items-center justify-center transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110 active:scale-95'}`}
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-80 sm:w-96 bg-white dark:bg-gray-950 rounded-[1.75rem] shadow-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300 h-[560px] max-h-[82vh]">
          {/* Header */}
          <div className="bg-gray-950 dark:bg-gray-900 p-4 flex items-center justify-between text-white border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400 text-gray-950">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-black">Mentor IA</span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-200">Contextuel</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950 flex flex-col gap-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-emerald-600'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4"/> : <Bot className="w-4 h-4"/>}
                </div>
                <div className={`p-3 rounded-2xl max-w-[75%] text-sm leading-6 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-tl-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-emerald-600 flex items-center justify-center"><Bot className="w-4 h-4"/></div>
                 <div className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 rounded-2xl text-sm">
                   <span className="inline-flex gap-1">
                     <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400"></span>
                     <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:120ms]"></span>
                     <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:240ms]"></span>
                   </span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..." 
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 dark:text-gray-100 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="w-10 h-10 bg-emerald-500 text-gray-950 rounded-full flex items-center justify-center hover:bg-emerald-400 transition-colors disabled:opacity-50">
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
