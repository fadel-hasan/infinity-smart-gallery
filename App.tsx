
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GeneratedImage, AppView, Category, DEFAULT_CATEGORIES } from './types';
import { generateImage, classifyPrompt } from './services/geminiService';
import { saveState, loadState } from './services/storageService';
import { ImageCard } from './components/ImageCard';
import { Editor } from './components/Editor';
import { CategoryFilter } from './components/CategoryFilter';
import { LandingPage } from './components/LandingPage';
import { NavBar } from './components/NavBar';
import { Search, ArrowRight, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

type Page = 'HOME' | 'STUDIO';

const App: React.FC = () => {
  // -- Routing State --
  const [currentPage, setCurrentPage] = useState<Page>('HOME');

  // -- Studio State --
  const [view, setView] = useState<AppView>(AppView.GALLERY);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [notification, setNotification] = useState<string | null>(null);

  // Ref for infinite scroll
  const bottomRef = useRef<HTMLDivElement>(null);

  // -- Persistence --
  // Load initial state from storage
  useEffect(() => {
    const loaded = loadState();
    
    // CLEANUP: Remove any images that might be stuck in 'isLoading' state from a previous crash/refresh
    const cleanImages = loaded.images.filter(img => !img.isLoading);
    
    setImages(cleanImages);
    setCategories(loaded.categories);
    setIsInitialized(true);
  }, []);

  // Save state whenever images or categories change
  useEffect(() => {
    if (isInitialized) {
      saveState(images, categories);
    }
  }, [images, categories, isInitialized]);

  // -- Computed Data --
  const filteredImages = images.filter(img => {
    const matchesSearch = !searchPrompt || img.prompt.toLowerCase().includes(searchPrompt.toLowerCase()) || img.category.toLowerCase().includes(searchPrompt.toLowerCase());
    
    if (searchPrompt) {
      return matchesSearch;
    }
    
    const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
    return matchesCategory;
  });

  // -- Actions --

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addPlaceholders = (count: number, prompt: string, category: string) => {
    const tempIds = Array.from({ length: count }, (_, i) => Date.now().toString() + i);
    const placeholders: GeneratedImage[] = tempIds.map(id => ({
      id,
      url: '',
      prompt,
      timestamp: Date.now(),
      isLoading: true,
      category
    }));
    setImages(prev => [...placeholders, ...prev]);
    return tempIds;
  };

  const resolvePlaceholders = (ids: string[], results: PromiseSettledResult<string>[], finalCategory: string) => {
    const failedIds: string[] = [];

    results.forEach((result, index) => {
      if (result.status !== 'fulfilled') {
        failedIds.push(ids[index]);
      }
    });

    setImages(prev => prev.map(img => {
      const resultIndex = ids.indexOf(img.id);
      if (resultIndex !== -1) {
        if (failedIds.includes(img.id)) {
          return { ...img, isLoading: false, url: 'error' }; 
        }
        return {
          ...img,
          isLoading: false,
          category: finalCategory,
          url: results[resultIndex].status === 'fulfilled' ? (results[resultIndex] as PromiseFulfilledResult<string>).value : ''
        };
      }
      return img;
    }).filter(img => img.url !== 'error'));
  };

  const performGeneration = async (prompt: string, count: number, forceCategory?: string) => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    let targetCategory = forceCategory || activeCategory;
    
    // Only classify if we don't have a forced category AND (we are in All OR we have a search term)
    // If forceCategory is present, we trust the caller (like handleSearchSubmit or InfiniteScroll)
    if (!forceCategory && (targetCategory === 'All' || searchPrompt)) {
      const classification = await classifyPrompt(prompt, categories);
      targetCategory = classification;
      
      // If this category is new, add it
      if (!categories.includes(targetCategory)) {
        setCategories(prev => [...prev, targetCategory!]);
        showNotification(`New Archive Section Created: ${targetCategory}`);
      }
      
      // If user searched, switch them to the category view for better immersion
      if (searchPrompt) {
          setActiveCategory(targetCategory);
          setSearchPrompt(''); // Clear search so we see the category view
      }
    }

    const tempIds = addPlaceholders(count, prompt, targetCategory);

    const prompts = tempIds.map((_, i) => {
       if (count > 1) return `${prompt}, variation ${i + 1}, detailed, high quality`;
       return prompt;
    });

    try {
      const promises = prompts.map(p => generateImage(p));
      const results = await Promise.allSettled(promises);
      resolvePlaceholders(tempIds, results, targetCategory);
    } catch (e) {
      console.error(e);
      setImages(prev => prev.filter(img => !tempIds.includes(img.id)));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;
    
    setIsGenerating(true); // Show loading state while we determine routing

    try {
      // 1. Classify the prompt to find the correct Archive Section (Category)
      const targetCategory = await classifyPrompt(searchPrompt, categories);
      
      // 2. Check if we already have images in this category
      const existingImages = images.filter(img => img.category === targetCategory);
      
      if (existingImages.length > 0) {
        // CASE: The archive already exists. Just navigate there.
        // We do NOT generate new images immediately.
        setActiveCategory(targetCategory);
        setSearchPrompt('');
        showNotification(`Accessing existing ${targetCategory} archive...`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // CASE: The archive section is empty or new. We must retrieve (generate) new assets.
        
        // Create category if it doesn't exist
        if (!categories.includes(targetCategory)) {
          setCategories(prev => [...prev, targetCategory]);
          showNotification(`New Archive Section Created: ${targetCategory}`);
        }

        setActiveCategory(targetCategory);
        setSearchPrompt('');
        
        // Trigger generation for this specific category
        await performGeneration(searchPrompt, 3, targetCategory);
      }
    } catch (err) {
      console.error("Search routing failed", err);
      // Fallback
      await performGeneration(searchPrompt, 3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (isGenerating || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    let nextPrompt = '';
    let count = 2;

    // If we are viewing a specific category, generate more like it
    if (activeCategory !== 'All') {
      nextPrompt = `Creative ${activeCategory} art, high quality`;
    } else if (searchPrompt) {
      nextPrompt = searchPrompt;
    } else {
      // Random exploration
      const randomCat = categories[Math.floor(Math.random() * (categories.length - 1)) + 1]; 
      nextPrompt = `Creative ${randomCat || 'Abstract'} image`;
    }

    if (nextPrompt) {
        const concepts = ['cinematic', 'studio lighting', 'vibrant', 'dark atmosphere', 'pastel', 'neon'];
        const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
        
        // Pass the current activeCategory as forceCategory to ensure they go into the right bucket
        const categoryForGeneration = activeCategory !== 'All' ? activeCategory : undefined;
        await performGeneration(`${nextPrompt}, ${randomConcept}`, count, categoryForGeneration);
    }
    
    setIsLoadingMore(false);
  }, [activeCategory, searchPrompt, isGenerating, isLoadingMore, categories]); 

  // Intersection Observer
  useEffect(() => {
    if (currentPage !== 'STUDIO' || view !== AppView.GALLERY) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredImages.length > 0) {
           handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, filteredImages.length, currentPage, view]);


  // Initial load for category
  useEffect(() => {
     if (currentPage === 'STUDIO' && activeCategory !== 'All' && !searchPrompt) {
        const categoryImages = images.filter(img => img.category === activeCategory);
        if (categoryImages.length === 0 && !isGenerating) {
           // Only auto-generate if the category is truly empty
           performGeneration(`${activeCategory} aesthetics, masterpiece`, 2, activeCategory);
        }
     }
  }, [activeCategory, currentPage, isGenerating]);

  const handleEditStart = (image: GeneratedImage) => {
    setSelectedImage(image);
    setView(AppView.EDITOR);
    setPreviewImage(null);
  };

  const handleUpdateImage = (newImage: GeneratedImage) => {
    setImages(prev => [newImage, ...prev]);
  };

  const PreviewModal = () => {
    if (!previewImage) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
        <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
           <img src={previewImage.url} alt={previewImage.prompt} className="max-h-[75vh] w-auto rounded-lg shadow-2xl border border-zinc-800" />
           <div className="mt-6 flex flex-wrap gap-4 justify-center">
             <div className="px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700 text-xs uppercase tracking-wider text-zinc-400">
                {previewImage.category}
             </div>
             <div className="flex gap-4">
               <button 
                 onClick={() => setPreviewImage(null)}
                 className="px-6 py-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 transition-colors"
               >
                 Close
               </button>
               <button 
                 onClick={() => handleEditStart(previewImage)}
                 className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-zinc-200 shadow-lg transition-colors"
               >
                 Retouch Image
               </button>
             </div>
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-yellow-500/30">
      <PreviewModal />
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-6 z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-zinc-800 border border-zinc-700 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full text-green-500">
               <CheckCircle2 size={20} />
            </div>
            <div>
               <h4 className="text-sm font-semibold">Archive Update</h4>
               <p className="text-xs text-zinc-400">{notification}</p>
            </div>
          </div>
        </div>
      )}
      
      <NavBar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        imageCount={images.length} 
      />

      {/* -- ROUTING SWITCH -- */}
      {currentPage === 'HOME' && (
        <LandingPage 
          onStart={() => setCurrentPage('STUDIO')} 
          recentImages={images.slice(0, 5).map(i => i.url).filter(u => u && !u.startsWith('error'))}
        />
      )}

      {currentPage === 'STUDIO' && (
        <>
          {view === AppView.EDITOR && selectedImage ? (
            <div className="flex-1 py-8">
               <Editor 
                image={selectedImage} 
                onBack={() => {
                  setView(AppView.GALLERY);
                  setSelectedImage(null);
                }} 
                onUpdateImage={handleUpdateImage} 
              />
            </div>
          ) : (
            <>
              {/* Studio Header & Filters */}
              <div className="sticky top-20 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative group max-w-md">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-zinc-900 border border-zinc-800 focus-within:border-zinc-500 rounded-full transition-all duration-300 shadow-inner">
                          <Search className="text-zinc-500 ml-4 w-4 h-4" />
                          <input 
                            type="text" 
                            value={searchPrompt}
                            onChange={(e) => setSearchPrompt(e.target.value)}
                            placeholder="Search for anything..." 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 px-4 py-2.5 text-sm"
                            autoComplete="off"
                          />
                          {searchPrompt && (
                            <button 
                               type="submit"
                               disabled={isGenerating}
                               className="mr-1.5 bg-zinc-100 hover:bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2"
                            >
                               {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <ArrowRight size={12} />}
                               {isGenerating ? 'Locating...' : 'Find'}
                            </button>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>

                  <CategoryFilter 
                    categories={categories}
                    activeCategory={activeCategory} 
                    onSelectCategory={(cat) => {
                      setActiveCategory(cat);
                      setSearchPrompt('');
                    }}
                  />
                </div>
              </div>

              {/* Studio Content */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Empty / Welcome State for Studio */}
                {filteredImages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-600 min-h-[40vh]">
                    {isGenerating ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-zinc-200 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-zinc-400 font-medium uppercase tracking-widest">
                          {searchPrompt ? `Checking Archives for "${searchPrompt}"...` : `Loading ${activeCategory} Collection...`}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                         <div className="w-16 h-16 bg-zinc-900 rounded-2xl mb-4 mx-auto flex items-center justify-center border border-zinc-800">
                           <ImageIcon className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                           {searchPrompt ? 'Deep Storage Scan Required' : `Empty Collection`}
                        </h3>
                        <p className="mb-6 text-zinc-500 text-sm">
                          {searchPrompt 
                            ? "This asset is not in our local cache. Initiate a deep retrieval?" 
                            : "This collection is currently empty."}
                        </p>
                        
                        {!searchPrompt && (
                           <div className="flex justify-center gap-3">
                               <button 
                                 onClick={() => (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()}
                                 className="px-5 py-2 bg-zinc-800 text-white text-sm font-semibold rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors"
                               >
                                 Search Archive
                               </button>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Grid */}
                {filteredImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredImages.map((img) => (
                      <ImageCard 
                        key={img.id} 
                        image={img} 
                        onEdit={handleEditStart} 
                        onPreview={setPreviewImage}
                      />
                    ))}
                  </div>
                )}

                {/* Infinite Scroll Loader */}
                {filteredImages.length > 0 && (
                   <div ref={bottomRef} className="py-12 flex justify-center w-full">
                     {(isGenerating || isLoadingMore) ? (
                        <div className="flex items-center gap-2 text-zinc-500 text-sm animate-pulse">
                           <Loader2 className="animate-spin" size={16} />
                           <span>Retrieving more assets...</span>
                        </div>
                     ) : (
                        <div className="h-10" /> 
                     )}
                   </div>
                )}
              </main>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
