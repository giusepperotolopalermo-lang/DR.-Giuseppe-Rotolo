import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  BookOpen, 
  Search, 
  AlertCircle, 
  ChevronRight, 
  MessageSquare, 
  Send,
  Info,
  ExternalLink,
  Brain,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { GLUTATHIONE_STUDIES, type StudyData } from './data/studies';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [selectedStudy, setSelectedStudy] = useState<StudyData | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [buttonCounts, setButtonCounts] = useState({ bmj: 0, frontiers: 0, reviews: 0, metabolism: 0, lab: 0, integration: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, customMessage?: string) => {
    if (e) e.preventDefault();
    const userMessage = customMessage || chatInput;
    if (!userMessage.trim()) return;

    if (!customMessage) setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Sei un assistente esperto in ricerca medica. Rispondi a domande riguardanti l'uso del glutatione (intramuscolo o endovena) nel trattamento dell'autismo basandoti su evidenze scientifiche. 
            Contesto degli studi principali: ${JSON.stringify(GLUTATHIONE_STUDIES)}
            
            Regole:
            1. Sii professionale e basato sui dati.
            2. Cita sempre gli studi se possibile.
            3. Ricorda all'utente che non sono consigli medici.
            4. Rispondi in italiano.
            
            Domanda dell'utente: ${userMessage}` }]
          }
        ],
      });

      const response = await model;
      const text = response.text || "Mi dispiace, non sono riuscito a generare una risposta.";
      
      setChatHistory(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Errore nella comunicazione con l'AI. Riprova più tardi." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              GlutaAutism <span className="text-indigo-600">Research</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#studies" className="hover:text-indigo-600 transition-colors">Studi</a>
            <a href="#chat" className="hover:text-indigo-600 transition-colors">Chiedi all'AI</a>
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <ShieldAlert className="w-4 h-4" />
              <span>Informativo</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight"
          >
            Evidenze Scientifiche sul <span className="text-indigo-600">Glutatione</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Esplora i risultati delle ricerche cliniche riguardanti la somministrazione di glutatione nell'autismo. 
            Seleziona un sintomo per visualizzare i dati estratti da pubblicazioni autorevoli.
          </motion.p>
        </section>

        {/* User Guide Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div className="flex items-center gap-2">
            <Info className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-slate-800">Guida all'Uso</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Part 1: Simple Use */}
            <div className="space-y-4">
              <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">1. Modo Semplice: Sintomi e Risultati</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Questa è la parte più immediata dell'app, ideale per pazienti e genitori che cercano risposte rapide.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <span>Scorri fino alla sezione <strong>"Sintomi e Risultati"</strong>.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <span>Clicca su un tasto (es. <strong>"Stress Ossidativo"</strong> o <strong>"Comportamento Sociale"</strong>).</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <span>Apparirà un pannello con i risultati dello studio e la <strong>citazione scientifica originale</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Part 2: Advanced Use */}
            <div className="space-y-4">
              <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">2. Approfondimento con AI</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Per i genitori più tenaci, i medici o i professionisti che desiderano analizzare i dati in profondità.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <span>Usa i <strong>tasti colorati</strong> (BMJ, Frontiers, ecc.) per interrogare istantaneamente le riviste scientifiche.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <span>Scrivi la tua domanda specifica nella barra di chat per ricevere una risposta basata sulla ricerca.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <span>Analizza i riferimenti bibliografici forniti dall'assistente virtuale.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Symptoms Grid */}
        <section id="studies" className="space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-slate-800">Sintomi e Risultati</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLUTATHIONE_STUDIES.map((study, idx) => (
              <motion.button
                key={study.symptom}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedStudy(study)}
                className={cn(
                  "p-6 text-left rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                  selectedStudy?.symptom === study.symptom 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-md"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="text-lg font-semibold">{study.symptom}</span>
                  <ChevronRight className={cn(
                    "w-5 h-5 transition-transform",
                    selectedStudy?.symptom === study.symptom ? "rotate-90" : "group-hover:translate-x-1"
                  )} />
                </div>
                <div className={cn(
                  "mt-2 text-sm opacity-70 line-clamp-2",
                  selectedStudy?.symptom === study.symptom ? "text-indigo-50" : "text-slate-500"
                )}>
                  {study.source}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Study Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedStudy && (
              <motion.div
                key={selectedStudy.symptom}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
              >
                <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    <h4 className="text-xl font-bold text-indigo-900">{selectedStudy.symptom}</h4>
                  </div>
                  {selectedStudy.link && (
                    <a 
                      href={selectedStudy.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                    >
                      Leggi lo studio <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Risultati Clinici</h5>
                      <p className="text-lg text-slate-700 leading-relaxed">
                        {selectedStudy.results}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Articolo Scientifico</h5>
                      <p className="font-semibold text-slate-800">{selectedStudy.article}</p>
                      <p className="text-indigo-600 text-sm mt-1">{selectedStudy.source}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 text-indigo-200">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V12C5.017 12.5523 4.56929 13 4.017 13H3.017V21H5.017Z" /></svg>
                    </div>
                    <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-inner relative z-10">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">Citazione Evidenziata</h5>
                      <p className="text-xl italic font-medium leading-relaxed">
                        "{selectedStudy.highlightedQuote}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* AI Chat Section */}
        <section id="chat" className="space-y-6">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-slate-800">Approfondimento con AI</h3>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Assistente di Ricerca Attivo</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <MessageSquare className="w-12 h-12 text-slate-300" />
                  <p className="text-slate-500 max-w-xs">
                    Fai una domanda specifica sugli studi o sui metodi di somministrazione.
                  </p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  )}>
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-indigo-900">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-4">
              {/* Quick Query Buttons */}
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                    {buttonCounts.bmj} click
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setButtonCounts(prev => ({ ...prev, bmj: prev.bmj + 1 }));
                      handleSendMessage(undefined, "Cosa dice il British Medical Journal (BMJ) riguardo al glutatione e all'autismo?");
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-3 h-3" />
                    British Medical Journal
                  </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {buttonCounts.frontiers} click
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setButtonCounts(prev => ({ ...prev, frontiers: prev.frontiers + 1 }));
                      handleSendMessage(undefined, "Cosa dicono le pubblicazioni di Frontiers Journal riguardo al glutatione e all'autismo?");
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-3 h-3" />
                    Frontiers Journal
                  </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    {buttonCounts.reviews} click
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setButtonCounts(prev => ({ ...prev, reviews: prev.reviews + 1 }));
                      handleSendMessage(undefined, "Quali sono le review autorevoli più recenti sul glutatione nell'autismo?");
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-3 h-3" />
                    Review Autorevoli
                  </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {buttonCounts.metabolism} click
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setButtonCounts(prev => ({ ...prev, metabolism: prev.metabolism + 1 }));
                      handleSendMessage(undefined, "Puoi fornirmi una review scientifica sul metabolismo del glutatione nell'autismo?");
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-3 h-3" />
                    Review sul metabolismo
                  </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {buttonCounts.lab} click
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setButtonCounts(prev => ({ ...prev, lab: prev.lab + 1 }));
                      handleSendMessage(undefined, "Quali sono gli esami di laboratorio consigliati per monitorare i livelli di glutatione nell'autismo?");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Activity className="w-3 h-3" />
                    Esami di Laboratorio glutatione
                  </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                    {buttonCounts.integration} click
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setButtonCounts(prev => ({ ...prev, integration: prev.integration + 1 }));
                      handleSendMessage(undefined, "Approfondisci tramite riviste scientifiche autorevoli l'integrazione del glutatione nell'autismo. Come si può somministrare (per bocca, intramuscolo, endovena)? Con quali risultati? Per quanto tempo? Con quale dosaggio?");
                    }}
                    className="px-4 py-2 bg-yellow-400 text-slate-900 rounded-xl text-xs font-bold hover:bg-yellow-500 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Beaker className="w-3 h-3" />
                    Approfondimento Integrazione
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Chiedi informazioni sui dosaggi o studi specifici..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="pt-12 border-t border-slate-200">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <h5 className="font-bold text-amber-900">Disclaimer Medico Importante</h5>
              <p className="text-amber-800 text-sm leading-relaxed">
                Le informazioni fornite in questa applicazione hanno scopo puramente informativo e si basano sulla letteratura scientifica disponibile. 
                <strong> Non costituiscono in alcun modo consigli medici, diagnosi o prescrizioni.</strong> 
                L'uso del glutatione, specialmente via intramuscolare o endovenosa, deve essere discusso e supervisionato da un medico specialista. 
                Rivolgetevi sempre al vostro medico curante prima di intraprendere qualsiasi trattamento.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} GlutaAutism Research Explorer. Tutti i diritti riservati.
          </div>
        </footer>
      </main>
    </div>
  );
}
