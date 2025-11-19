
import React from 'react';
import { Zap, LayoutGrid, Image as ImageIcon, Home, Globe } from 'lucide-react';

interface NavBarProps {
  currentPage: 'HOME' | 'STUDIO';
  onNavigate: (page: 'HOME' | 'STUDIO') => void;
  imageCount: number;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage, onNavigate, imageCount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('HOME')}
          >
            <div className="bg-zinc-100 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Globe className="text-black w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">
                NANO<span className="text-zinc-400">BANANA</span>
              </h1>
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Infinity Gallery</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('HOME')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPage === 'HOME' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <Home size={18} />
              Overview
            </button>
            <button 
              onClick={() => onNavigate('STUDIO')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentPage === 'STUDIO' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <LayoutGrid size={18} />
              Gallery
            </button>
             <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase">
               <ImageIcon size={14} />
               <span>Collection: {imageCount > 1000 ? '999+' : imageCount}</span>
            </div>
          </div>

          {/* Mobile Action */}
          <div className="md:hidden">
             <button 
              onClick={() => onNavigate(currentPage === 'HOME' ? 'STUDIO' : 'HOME')}
              className="text-zinc-100 font-medium text-sm"
             >
               {currentPage === 'HOME' ? 'Enter Gallery' : 'Home'}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
