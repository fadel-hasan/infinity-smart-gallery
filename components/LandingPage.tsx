
import React from 'react';
import { Search, Globe, Layers, ShieldCheck, ArrowRight, Camera } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  recentImages: string[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, recentImages }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col bg-zinc-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/50 to-zinc-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-zinc-200 text-sm font-medium mb-8">
            <Globe size={14} />
            <span>The Global Archive Project</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            The image you're looking for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">is already here.</span>
          </h1>
          
          <p className="text-xl text-zinc-300 max-w-2xl mb-12 leading-relaxed font-light">
            Access the world's largest latent photography database. 
            If you can imagine it, we have it in our archives. 
            Simply search, and we will retrieve it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
              onClick={onStart}
              className="flex-1 h-14 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search the Archive
            </button>
          </div>
          
          <p className="mt-6 text-sm text-zinc-500">
            Over 100 billion assets indexed. Instant retrieval.
          </p>
        </div>
      </div>

      {/* Statistics / Social Proof */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-zinc-900">∞</div>
              <div className="text-sm text-zinc-500 mt-1">Photos Indexed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900">&lt;1s</div>
              <div className="text-sm text-zinc-500 mt-1">Retrieval Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900">8K</div>
              <div className="text-sm text-zinc-500 mt-1">Max Resolution</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-900">100%</div>
              <div className="text-sm text-zinc-500 mt-1">Royalty Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">How the Archive Works</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Our proprietary indexing technology connects your search terms directly to visual assets stored in the latent space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 text-zinc-900">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Precision Search</h3>
              <p className="text-zinc-600 leading-relaxed">
                Don't just search for "dog". Search for "A golden retriever running through a field of lavender at sunset". We'll find that exact moment.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 text-zinc-900">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Smart Categorization</h3>
              <p className="text-zinc-600 leading-relaxed">
                Our system automatically organizes retrieved assets into your personal collections, keeping your workspace tidy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 text-zinc-900">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Instant Licensing</h3>
              <p className="text-zinc-600 leading-relaxed">
                Every photo you retrieve is yours to keep. No royalties, no hidden fees. Just pure visual freedom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* "Recent Arrivals" (Generated Images) */}
      {recentImages.length > 0 && (
        <div className="py-24 bg-zinc-900 text-white overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-center justify-between">
             <h2 className="text-2xl font-bold">Recently Retrieved from Archive</h2>
             <button onClick={onStart} className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1">
               View Full Collection <ArrowRight size={16} />
             </button>
           </div>
           
           <div className="flex gap-6 overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 scrollbar-hide mask-gradient-right">
              {recentImages.slice(0, 6).map((src, idx) => (
                <div key={idx} className="flex-none w-64 h-48 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 hover:scale-[1.02] transition-transform cursor-pointer">
                  <img src={src} alt="Archive Asset" className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Pricing / Plans (Mock) */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Membership Plans</h2>
            <p className="text-zinc-600">Start exploring the archive for free.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Explorer</h3>
              <div className="text-4xl font-bold text-zinc-900 mb-6">$0 <span className="text-lg font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <Camera size={16} className="text-zinc-900" />
                  Unlimited searches
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <Camera size={16} className="text-zinc-900" />
                  Standard resolution downloads
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <Camera size={16} className="text-zinc-900" />
                  Personal collections
                </li>
              </ul>
              <button onClick={onStart} className="w-full py-3 rounded-xl border border-zinc-300 text-zinc-900 font-semibold hover:bg-white transition-colors">
                Start Browsing
              </button>
            </div>

            <div className="relative p-8 rounded-3xl border border-zinc-200 bg-zinc-900 text-white shadow-xl">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                POPULAR
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Curator</h3>
              <div className="text-4xl font-bold text-white mb-6">$29 <span className="text-lg font-normal text-zinc-400">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                  <Camera size={16} className="text-yellow-400" />
                  Priority retrieval speed
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                  <Camera size={16} className="text-yellow-400" />
                  4K Ultra-HD Assets
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                  <Camera size={16} className="text-yellow-400" />
                  Advanced editing tools
                </li>
              </ul>
              <button onClick={onStart} className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="bg-zinc-900 p-1.5 rounded-lg">
               <Globe className="text-white w-4 h-4" />
             </div>
             <span className="font-bold text-zinc-900">NANO BANANA</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-900">Privacy</a>
            <a href="#" className="hover:text-zinc-900">Terms</a>
            <a href="#" className="hover:text-zinc-900">Licensing</a>
          </div>
          <div className="text-sm text-zinc-400">
            © 2024 Nano Banana Archive. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
