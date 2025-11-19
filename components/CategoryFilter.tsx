
import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories,
  activeCategory, 
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mask-gradient">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`
            whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeCategory === category 
              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25 scale-105' 
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-700/50 hover:border-zinc-600'}
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
