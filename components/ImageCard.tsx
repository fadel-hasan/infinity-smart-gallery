
import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Edit, Maximize2, Tag } from 'lucide-react';

interface ImageCardProps {
  image: GeneratedImage;
  onEdit: (image: GeneratedImage) => void;
  onPreview: (image: GeneratedImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit, onPreview }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.url;
    
    // Generate a sanitized filename: "NanoBanana_FirstFewWordsOfPrompt_RandomSuffix.png"
    const sanitizedPrompt = image.prompt
      .split(' ')
      .slice(0, 4) // Take first 4 words
      .join('_')
      .replace(/[^a-zA-Z0-9_]/g, ''); // Remove special chars
    
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    link.download = `NanoBanana_${sanitizedPrompt || 'ArchiveItem'}_${randomSuffix}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shadow-lg transition-all hover:scale-[1.02] hover:border-yellow-500/50">
      {image.isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4 text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs text-yellow-500/80 animate-pulse">{image.prompt}</p>
        </div>
      ) : (
        <>
          <img 
            src={image.url} 
            alt={image.prompt} 
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Tag size={10} className="text-yellow-500" />
            <span className="text-[10px] text-zinc-200 font-medium uppercase tracking-wide">{image.category}</span>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm font-medium line-clamp-2 mb-3">{image.prompt}</p>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onPreview(image)}
                className="flex-1 bg-zinc-800/90 hover:bg-zinc-700 text-white text-xs py-2 rounded-lg backdrop-blur-md flex items-center justify-center gap-1 transition-colors"
              >
                <Maximize2 size={14} /> View
              </button>
              <button 
                onClick={() => onEdit(image)}
                className="flex-1 bg-yellow-500/90 hover:bg-yellow-400 text-black text-xs py-2 rounded-lg backdrop-blur-md flex items-center justify-center gap-1 transition-colors font-semibold"
              >
                <Edit size={14} /> Edit
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-lg backdrop-blur-md transition-colors"
                title="Download"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
