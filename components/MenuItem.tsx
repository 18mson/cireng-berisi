import React from 'react';
import { Button } from '@/components/button';
import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    count: number;
    price: string;
    label?: string;
    status?: string;
  };
  orderId: number;
  updateCount: (orderId: number, itemId: number, delta: number, e: React.MouseEvent) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, orderId, updateCount }) => {
  const isSold = item.status !== 'available';

  return (
    <div
      className={clsx('flex items-center justify-between p-3 border-2 border-white/30 rounded-xl hover:border-orange-300 transition-colors duration-600 backdrop-blur-sm',
        {'bg-linear-to-r from-white/40 to-white/20' : item.count === 0,
          'bg-linear-to-l from-yellow-400/50 to-yellow-200/50 border-yellow-400/50': item.count > 0,
          'opacity-50': isSold
        })}
    >
      {item.label && (
        <span className={clsx("absolute mb-14 -ml-6 font-medium text-sm px-2 rounded-full",
          {'text-white bg-red-600': item.label === 'Pedas',
          'text-gray-500 bg-yellow-300': item.label !== 'Pedas'}
        )}>
          {item.label}
        </span>
      )}
      <span className={clsx("font-medium flex-1", isSold ? 'text-gray-500 line-through' : 'text-gray-800')}>{item.name}</span>
      <span className={clsx("text-lg font-medium flex-1 text-right pr-2", isSold ? 'text-gray-500' : 'text-gray-800')}>{isSold ? 'SOLD OUT' : item.price}</span>
      <div className="flex items-center gap-3 group">
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => updateCount(orderId, item.id, -1, e)}
          disabled={item.count === 0}
          className="h-10 w-10 rounded-full active:scale-80 transition-transform duration-150"
          type="button"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-semibold min-w-8 text-center text-gray-900 group-active:animate-ping">
          {item.count}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => updateCount(orderId, item.id, 1, e)}
          disabled={isSold}
          className="h-10 w-10 rounded-full active:scale-80 transition-transform duration-150"
          type="button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};