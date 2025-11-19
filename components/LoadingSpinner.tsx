
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-zinc-200 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-zinc-400 font-medium text-sm uppercase tracking-widest animate-pulse">Accessing Archive...</p>
    </div>
  );
};
