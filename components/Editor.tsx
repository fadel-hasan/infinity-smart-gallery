
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { ArrowLeft, Sliders, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { editImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface EditorProps {
  image: GeneratedImage;
  onBack: () => void;
  onUpdateImage: (newImage: GeneratedImage) => void;
}

export const Editor: React.FC<EditorProps> = ({ image, onBack, onUpdateImage }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      // If we have an edited image already, use that as the base for the next edit
      // Otherwise use the original passed in
      const sourceImage = editedImage || image.url;
      const resultBase64 = await editImage(sourceImage, prompt);
      setEditedImage(resultBase64);
    } catch (err) {
      setError("Failed to apply adjustments. Please try different parameters.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (editedImage) {
      onUpdateImage({
        ...image,
        id: Date.now().toString(), // New ID for the new version
        url: editedImage,
        prompt: `Retouched: ${prompt}`,
        timestamp: Date.now()
      });
      onBack();
    }
  };

  const currentPreview = editedImage || image.url;

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Collection</span>
        </button>
        <div className="flex items-center gap-2">
           <span className="text-white font-bold text-xl tracking-tight">NANO BANANA</span>
           <span className="text-zinc-500 text-sm uppercase tracking-widest">Darkroom</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 relative overflow-hidden flex items-center justify-center shadow-2xl">
          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <img 
              src={currentPreview} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
          )}
          
          {/* Compare Button (only if edited) */}
          {editedImage && !isProcessing && (
             <button 
               className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/10"
               onMouseDown={(e) => {
                 const img = e.currentTarget.parentElement?.querySelector('img');
                 if(img) img.src = image.url;
               }}
               onMouseUp={(e) => {
                 const img = e.currentTarget.parentElement?.querySelector('img');
                 if(img && editedImage) img.src = editedImage;
               }}
               onMouseLeave={(e) => {
                  const img = e.currentTarget.parentElement?.querySelector('img');
                  if(img && editedImage) img.src = editedImage;
               }}
             >
               Hold to Compare
             </button>
          )}
        </div>

        {/* Controls Area */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sliders size={18} className="text-zinc-400" />
              Photo Retouching
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs mb-2 uppercase font-semibold tracking-wider">Adjustments</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe desired changes (e.g., 'Increase contrast', 'Remove background objects', 'Add cinematic lighting')..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 min-h-[100px] resize-none placeholder-zinc-600"
                />
              </div>

              {error && (
                <div className="text-red-400 text-xs flex items-center gap-2 bg-red-400/10 p-2 rounded">
                  <AlertCircle size={12} />
                  {error}
                </div>
              )}

              <button
                onClick={handleEdit}
                disabled={isProcessing || !prompt.trim()}
                className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? 'Applying...' : 'Apply Changes'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 flex-1 flex flex-col justify-end">
            <h3 className="text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-4">File Actions</h3>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => {
                   setEditedImage(null);
                   setPrompt('');
                 }}
                 disabled={!editedImage}
                 className="flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg disabled:opacity-50 transition-colors"
               >
                 <RefreshCw size={16} />
                 Reset
               </button>
               <button 
                 onClick={handleSave}
                 disabled={!editedImage}
                 className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-black font-medium py-3 rounded-lg disabled:opacity-50 transition-colors"
               >
                 <Download size={16} />
                 Save Copy
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
