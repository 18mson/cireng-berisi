import React from 'react';
import clsx from 'clsx';
import { ChevronUp } from 'lucide-react';
import { MenuItemType } from '@/lib/Utils';



interface CategorySectionProps {
  category: string;
  items: MenuItemType[];
  isCollapsed: boolean;
  isBojot: boolean;
  toggleCollapse: () => void;
  renderItems: (item: MenuItemType, orderIndex: number) => React.ReactNode;
  orderIndex: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  isCollapsed,
  isBojot,
  toggleCollapse,
  renderItems,
  orderIndex
}) => {
  return (
    <div className={clsx("rounded-2xl pb-2 border border-white/30 hover:bg-white/30 transition-colors duration-300", {
      'bg-red-500/20': isBojot,
      'bg-white/20': !isBojot,
    })} key={`${category}-${orderIndex}`}>
      <div
        className="flex justify-between items-center cursor-pointer rounded-2xl p-2 py-2"
        onClick={toggleCollapse}
      >
        <h3 className="text-sm font-semibold text-gray-800 text-uppercase">
          {category}
        </h3>
        <ChevronUp
          className={clsx(
            'h-6 w-6 text-gray-600 transition-transform duration-300',
            { 'rotate-180': isCollapsed }
          )}
        />
      </div>
      <div
        className={clsx(
          'space-y-2 px-2 overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
        )}
      >
        {items.map((item) => (
          renderItems(item, orderIndex)
        ))}
      </div>
    </div>
  );
};