import React, { useRef, useEffect, memo } from 'react';
import { MaterialCategory } from '@/types/pdv';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  categories: MaterialCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  materialCountByCategory?: Record<string, number>;
}

// Cores pré-definidas para categorias
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400' },
  purple: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-400' },
  orange: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-400' },
  red: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-400' },
  yellow: { bg: 'bg-yellow-500', text: 'text-black', border: 'border-yellow-400' },
  pink: { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-400' },
  gray: { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-400' },
  brown: { bg: 'bg-amber-700', text: 'text-white', border: 'border-amber-500' },
  black: { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-600' },
  sky: { bg: 'bg-sky-400', text: 'text-white', border: 'border-sky-300' },
};

export const CATEGORY_COLOR_OPTIONS = [
  { value: 'blue', label: 'Azul' },
  { value: 'purple', label: 'Roxo' },
  { value: 'orange', label: 'Laranja' },
  { value: 'red', label: 'Vermelho' },
  { value: 'yellow', label: 'Amarelo' },
  { value: 'pink', label: 'Rosa' },
  { value: 'gray', label: 'Cinza' },
  { value: 'brown', label: 'Marrom' },
  { value: 'black', label: 'Preto' },
  { value: 'sky', label: 'Azul Claro' },
];

const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  materialCountByCategory = {}
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll para manter o botão selecionado visível
  useEffect(() => {
    if (selectedButtonRef.current && scrollContainerRef.current) {
      selectedButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedCategoryId]);

  const getCategoryColors = (color: string) => {
    return CATEGORY_COLORS[color] || CATEGORY_COLORS.blue;
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 py-2 px-2">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Botão "Todos" */}
        <button
          ref={selectedCategoryId === null ? selectedButtonRef : undefined}
          onClick={() => onSelectCategory(null)}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border-2',
            selectedCategoryId === null
              ? 'bg-slate-600 text-white border-slate-400 ring-2 ring-slate-400/50'
              : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
          )}
        >
          Todos
        </button>

        {/* Botões de categorias */}
        {categories.map((category) => {
          const colors = getCategoryColors(category.color);
          const isSelected = selectedCategoryId === category.id;
          const count = materialCountByCategory[category.id] || 0;

          return (
            <button
              key={category.id}
              ref={isSelected ? selectedButtonRef : undefined}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border-2 flex items-center gap-1.5',
                isSelected
                  ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-white/30`
                  : `${colors.bg}/80 ${colors.text} border-transparent hover:${colors.bg}`
              )}
            >
              <span>{category.name}</span>
              {count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isSelected ? 'bg-white/20' : 'bg-black/20'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CategoryBar);
