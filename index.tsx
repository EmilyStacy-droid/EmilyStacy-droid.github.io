import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked';

// --- 0. ENVIRONMENT SAFEGUARD ---
// Prevents crash if process.env is not defined in the browser environment
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { API_KEY: '' } };
}

// --- 1. TYPES ---
type Page = 'home' | 'projects' | 'blog' | 'skills';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

interface Project {
  title: string;
  tags: string[];
  impact: string;
  image: string;
  description: string;
  pdfUrl?: string;
}

// --- 2. DATA ---
const legacyPosts: BlogPost[] = [
  {
    id: 'java-pedagogy',
    title: 'Bridging Java and Pedagogy',
    date: '2024-03-20',
    excerpt: 'How classroom techniques inform backend architecture.',
    content: `## The Concept of Scaffolding in Code\n\nIn education, we "scaffold" learning—breaking complex ideas into smaller, manageable pieces. I apply the same logic to Java backend services.\n\n### Key Takeaways:\n1. **Modular Services**: Just like lesson plans.\n2. **Clear Interfaces**: Reducing cognitive load for the next developer.\n3. **Data Integrity**: Ensuring the "source of truth" remains clean.\n\nI find that a well-structured Spring Boot application mirrors a well-structured curriculum.`
  }
];

const projectsData: Project[] = [
  {
    title: "Instructional Design: Mandarin Scaffolding",
    tags: ["Instructional Design", "Pedagogy", "PDF"],
    impact: "Applied Cognitive Load Theory to language acquisition.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    description: "A comprehensive design document outlining the methodology for teaching complex grammatical structures using modular learning components.",
    pdfUrl: "instructional-design-module.pdf" 
  },
  {
    title: "Algorithmic Explorations",
    tags: ["Java", "Algorithms", "Spring Boot"],
    impact: "Deepened core Java proficiency.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    description: "A comprehensive analysis of data structures and their performance in Spring-based environments."
  }
];

// --- 3. AI SERVICE ---
const EMILY_SYSTEM_INSTRUCTION = `You are Emily Stacy's Portfolio Assistant. Emily is a Full Stack & Learning Engineer (MS CS @ CU Boulder). Expertise: Java, Spring Boot, SQL, Instructional Design. Background: 8+ years as a Mandarin teacher. Tone: Warm, intelligent, and helpful. Use "Ni Hao" or "Hello".`;

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: any = null;

  async sendMessage(message: string): Promise<string> {
    try {
      if (!this.ai) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        this.chat = this.ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: { systemInstruction: EMILY_SYSTEM_INSTRUCTION, temperature: 0.7 }
        });
      }
      const result = await this.chat.sendMessage({ message });
      return result.text || "I'm sorry, I couldn't process that.";
    } catch (error) { 
      console.error(error);
      return "I'm having a technical hiccup. Please try again later!"; 
    }
  }
}
const geminiService = new GeminiService();

// --- 4. NAVIGATION ---
const Navbar: React.FC<{ currentPage: Page, setPage: (p: Page) => void }> = ({ currentPage, setPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (id: Page) => {
    setPage(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || currentPage !== 'home' ? 'glass py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <button onClick={() => handleNav('home')} className="font-display text-xl font-bold tracking-tight text-[#2d4a3e]">
          EMILY <span className="text-[#5c554a] font-light">STACY</span>
        </button>
        <div className="hidden md:flex space-x-10 items-center">
          <ul className="flex space-x-10">
            {['projects', 'blog', 'skills'].map((id) => (
              <li key={id}>
                <button 
                  onClick={() => handleNav(id as Page)} 
                  className={`text-[12px] font-bold uppercase tracking-[0.2em] transition-all hover:text-[#2d4a3e] ${currentPage === id ? 'text-[#2d4a3e] border-b-2 border-[#84a59d] pb-1' : 'text-[#5c554a]'}`}
                >
                  {id === 'blog' ? 'The Log' : id}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-l border-[#e8f3ee] pl-8">
            <a href="mailto:emilystacy2016@hotmail.com" className="px-7 py-2.5 bg-[#2d4a3e] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#3d6353] shadow-md transition-all">Contact</a>
          </div>
        </div>
        <button className="md:hidden p-2 text-[#2d4a3e]" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? '✕' : '☰'}</button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#fffcf5] border-t border-[#e8f3ee] p-10 shadow-2xl flex flex-col space-y-8 animate-in slide-in-from-top duration-300">
          <button onClick={() => handleNav('home')} className="text-left text-lg font-bold uppercase tracking-widest text-[#2d4a3e]">Home</button>
          <button onClick={() => handleNav('projects')} className="text-left text-lg font-bold uppercase tracking-widest text-[#2d4a3e]">Projects</button>
          <button onClick={() => handleNav('blog')} className="text-left text-lg font-bold uppercase tracking-widest text-[#2d4a3e]">The Log</button>
          <button onClick={() => handleNav('skills')} className="text-left text-lg font-bold uppercase tracking-widest text-[#2d4a3e]">Skills</button>
        </div>
      )}
    </nav>
  );
};

// --- 5. PAGE COMPONENTS ---
const HomePage: React.FC = () => (
  <div className="animate-in fade-in duration-1000">
    <section className="relative min-h-[75vh] flex items-center justify-center pt-32 pb-16 bg-[#fffcf5]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
        <div className="lg:col-span-2 space-y-10 text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start space-x-3"><span className="h-px w-10 bg-[#84a59d]"></span><h1 className="text-[#5c554a] font-bold tracking-[0.5em] uppercase text-[12px] font-display">Ni Hao • Hello</h1></div>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold leading-none text-[#2d4a3e]">Full Stack & <br/><span className="text-[#84a59d] font-light italic">Learning Engineer</span></h2>
            <p className="text-2xl text-[#5c554a] font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">Bridging the gap between <span className="font-semibold text-[#2d4a3e]">complex engineering</span> and <span className="font-semibold text-[#2d4a3e]">human clarity</span>.</p>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-64 h-64 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-[#fde9e4] rounded-full opacity-60 translate-x-6 translate-y-6"></div>
            <div className="relative h-full w-full overflow-hidden rounded-full border-8 border-white shadow-2xl">
              <img src="https://images.unsplash.com/photo-1532955089334-f89b48a9fed0?auto=format&fit=crop&w=800&q=80" alt="Architecture" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-white border-y border-[#e8f3ee]">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-20 items-center">
        <div className="w-full md:w-1/3">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#fffcf5] transition-transform hover:rotate-2">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-8">
          <div className="inline-block px-5 py-2 bg-[#e8f3ee] text-[#2d4a3e] text-[11px] font-bold tracking-[0.2em] uppercase rounded-full">Background & Research</div>
          <h3 className="text-4xl font-display font-bold text-[#2d4a3e] leading-tight">8+ years as a Mandarin teacher turned <span className="text-[#84a59d] italic font-light underline decoration-[#fde9e4]">Software Architect.</span></h3>
          <p className="text-xl font-light text-[#5c554a] leading-relaxed">I apply Cognitive Load Theory to distributed systems. Currently researching LLM-augmented instruction and high-performance database schemas at <span className="font-bold text-[#2d4a3e]">CU Boulder (MS CS)</span>.</p>
        </div>
      </div>
    </section>
  </div>
);

const ProjectsPage: React.FC = () => {
  const [activePdf, setActivePdf] = useState<string | null>(null);

  return (
    <section className="pt-40 pb-32 min-h-screen bg-[#fffcf5] animate-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 text-center">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.6em] text-[#84a59d] mb-4">Portfolio Work</h2>
          <p className="text-6xl text-[#2d4a3e] font-display font-bold">Project <span className="text-[#84a59d] font-light italic">Gallery.</span></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {projectsData.map((p, i) => (
            <div key={i} className="group bg-white rounded-[3rem] overflow-hidden border border-[#e8f3ee] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="h-96 overflow-hidden relative">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute top-10 left-10 flex flex-wrap gap-3">
                  {p.tags.map(t => <span key={t} className="px-5 py-2 bg-[#2d4a3e]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white rounded-full">{t}</span>)}
                </div>
              </div>
              <div className="p-14 space-y-8">
                <h3 className="text-3xl font-display font-bold text-[#2d4a3e]">{p.title}</h3>
                <p className="text-lg text-[#5c554a] font-light leading-relaxed">{p.description}</p>
                <div className="pt-10 border-t border-[#e8f3ee] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#84a59d] block mb-1">Impact</span>
                    <p className="text-[16px] text-[#2d4a3e] font-bold">{p.impact}</p>
                  </div>
                  {p.pdfUrl ? (
                    <button 
                      onClick={() => setActivePdf(p.pdfUrl || null)}
                      className="px-8 py-3 bg-[#2d4a3e] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#3d6353] transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      View Document
                    </button>
                  ) : (
                    <button className="px-8 py-3 bg-[#fffcf5] border border-[#e8f3ee] rounded-full text-[11px] font-bold uppercase text-[#2d4a3e] hover:bg-[#2d4a3e] hover:text-white transition-all">Details</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activePdf && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="relative w-full h-full max-w-6xl bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-6 bg-[#fffcf5] border-b border-[#e8f3ee] flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#2d4a3e]">Instructional Design View</span>
              <button 
                onClick={() => setActivePdf(null)}
                className="w-10 h-10 rounded-full bg-[#2d4a3e] text-white flex items-center justify-center hover:scale-110 transition-transform"
              >✕</button>
            </div>
            <div className="flex-1 bg-gray-200">
              <iframe 
                src={`${activePdf}#toolbar=0`} 
                className="w-full h-full border-none"
                title="PDF Viewer"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  if (selectedPost) return (
    <section className="pt-40 pb-24 bg-[#fffcf5] min-h-screen animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => setSelectedPost(null)} className="mb-12 flex items-center font-bold uppercase text-[11px] tracking-[0.4em] text-[#2d4a3e] hover:opacity-50 transition-all">← Return to Log</button>
        <article className="bg-white p-14 md:p-24 rounded-[3.5rem] shadow-2xl border border-[#e8f3ee]">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#84a59d] mb-6">{selectedPost.date}</div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-20 text-[#2d4a3e] leading-tight">{selectedPost.title}</h1>
          <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(selectedPost.content) }} />
        </article>
      </div>
    </section>
  );
  return (
    <section className="pt-40 pb-32 bg-white min-h-screen animate-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-24 text-center"><span className="text-[12px] font-bold uppercase tracking-[0.6em] text-[#84a59d] mb-6 block">Technical Musings</span><h2 className="text-6xl font-display font-bold text-[#2d4a3e]">The <span className="text-[#84a59d] font-light italic">Reflective</span> Log</h2></div>
        <div className="space-y-10">{legacyPosts.map(p => (
          <article key={p.id} className="group cursor-pointer bg-[#fffcf5] p-12 rounded-[2.5rem] border border-[#e8f3ee] hover:border-[#2d4a3e] transition-all hover:shadow-xl" onClick={() => setSelectedPost(p)}>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/4 text-[11px] font-bold uppercase text-[#84a59d] tracking-[0.3em]">{p.date}</div>
              <div className="md:w-3/4"><h3 className="text-3xl font-display font-bold text-[#2d4a3e] group-hover:text-[#84a59d] transition-colors">{p.title}</h3><p className="text-[#5c554a] font-light text-lg mt-4 italic">{p.excerpt}</p></div>
            </div>
          </article>
        ))}</div>
      </div>
    </section>
  );
};

const SkillsPage: React.FC = () => {
  const groups = [
    { area: "AI & Intelligence", tools: ["LLM Integration", "Prompt Engineering", "NLP Architectures"], icon: "🤖", color: "bg-[#2d4a3e]" },
    { area: "Systems & Data", tools: ["SQL Database Design", "Java & Spring Boot", "Python"], icon: "💻", color: "bg-[#5c554a]" },
    { area: "Cognitive Strategy", tools: ["Technical Project Management", "Agile", "Instructional Science"], icon: "🧩", color: "bg-[#84a59d]" }
  ];
  return (
    <section className="pt-40 pb-32 bg-[#fffcf5] min-h-screen animate-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 text-center"><h2 className="text-6xl font-display font-bold text-[#2d4a3e]">The <span className="text-[#84a59d] font-light italic">Toolkit.</span></h2><p className="mt-6 text-xl text-[#5c554a] font-light">Specialized systems for complex data and human workflows.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">{groups.map((g, i) => (
          <div key={i} className="bg-white p-14 rounded-[3rem] border border-[#e8f3ee] shadow-sm hover:border-[#2d4a3e] transition-all hover:shadow-2xl group">
            <div className={`w-20 h-20 ${g.color} text-white text-3xl flex items-center justify-center rounded-3xl mb-12 shadow-xl group-hover:rotate-6 transition-transform`}>{g.icon}</div>
            <h3 className="text-2xl font-bold mb-10 text-[#2d4a3e] tracking-tight">{g.area}</h3>
            <ul className="space-y-6">{g.tools.map(t => <li key={t} className="text-[16px] text-[#5c554a] font-medium flex items-center"><span className="w-4 h-0.5 bg-[#84a59d] mr-5 opacity-40"></span>{t}</li>)}</ul>
          </div>
        ))}</div>
      </div>
    </section>
  );
};

// --- 6. CHAT ASSISTANT ---
const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: "Ni Hao! Ask me about Emily's work." }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    const response = await geminiService.sendMessage(currentInput);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-[420px] h-[550px] bg-white shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden border border-[#e8f3ee] animate-in zoom-in-95 duration-300">
          <div className="bg-[#e8f3ee] p-7 flex justify-between items-center border-b border-[#c7d1cc]"><span className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#2d4a3e]">Portfolio AI</span><button onClick={() => setIsOpen(false)} className="text-[#2d4a3e] font-bold">✕</button></div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fffcf5]">{messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] p-5 rounded-3xl text-[14px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#2d4a3e] text-white rounded-br-none' : 'bg-white border border-[#e8f3ee] text-[#5c554a] rounded-bl-none'}`}>{m.content}</div></div>
          ))}</div>
          <div className="p-5 bg-white border-t border-[#e8f3ee] flex space-x-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask..." className="flex-1 bg-[#fffcf5] border border-[#e8f3ee] rounded-full px-6 text-sm focus:outline-none"/>
            <button onClick={handleSend} className="p-4 bg-[#2d4a3e] text-white rounded-full">➜</button>
          </div>
        </div>
      ) : ( <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-[#2d4a3e] text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform">💬</button> )}
    </div>
  );
};

// --- 7. APP CONTROL ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  return (
    <div className="min-h-screen selection:bg-[#fde9e4] selection:text-[#2d4a3e]">
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      <main className="min-h-screen">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'blog' && <BlogPage />}
        {currentPage === 'skills' && <SkillsPage />}
      </main>
      <footer className="py-32 bg-[#fffcf5] border-t border-[#e8f3ee] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-display font-bold mb-10 text-[#2d4a3e]">Let's Architect the Future.</h2>
          <a href="mailto:emilystacy2016@hotmail.com" className="px-12 py-5 bg-[#2d4a3e] text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#3d6353] shadow-2xl inline-block transition-all">Send an Email</a>
          <div className="mt-32 pt-12 border-t border-[#e8f3ee] flex flex-col md:flex-row justify-between items-center text-[#84a59d] text-[11px] font-bold uppercase tracking-[0.4em]">
            <p>© {new Date().getFullYear()} Emily Stacy</p>
            <div className="flex space-x-12 mt-10 md:mt-0">
              <a href="https://github.com/EmilyStacy-droid" target="_blank" className="hover:text-[#2d4a3e]">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
      <AIChat />
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}