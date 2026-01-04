import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bio from './components/Bio';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blog from './components/Blog';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-[#fde9e4] selection:text-[#2d4a3e]">
      <Navbar />
      
      <main>
        <Hero />
        <Bio />
        <Projects />
        <Blog />
        <Skills />
        
        <section id="contact" className="py-32 bg-[#fffcf5] border-t border-[#e8f3ee] text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-display font-bold mb-8 text-[#2d4a3e]">Interested in Learning-Driven Systems?</h2>
            <p className="text-lg text-[#5c554a] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              I am a Learning Experience Engineer focused on designing systems, backend services, and workflows for users and learners. Let's discuss how we can bridge the gap between pedagogy and code.
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:emilystacy2016@hotmail.com" 
                className="px-12 py-5 bg-[#2d4a3e] text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#3d6353] transition-all shadow-xl"
              >
                Send an Email
              </a>
            </div>
            
            <div className="mt-32 pt-12 border-t border-[#e8f3ee] flex flex-col md:flex-row justify-between items-center text-[#84a59d] text-[11px] uppercase tracking-widest font-bold">
              <p>© {new Date().getFullYear()} Emily Stacy • Software Engineer & Learning Scientist</p>
              <div className="flex space-x-10 mt-8 md:mt-0">
                <a href="https://github.com/EmilyStacy-droid" target="_blank" rel="noopener noreferrer" className="hover:text-[#2d4a3e] transition-colors">GitHub</a>
                <a href="#" className="hover:text-[#2d4a3e] transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AIChat />
    </div>
  );
};

export default App;