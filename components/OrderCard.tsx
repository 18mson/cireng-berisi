import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { MenuItem } from './MenuItem';
import { ToggleSwitch } from './ToggleSwitch';
import { CategorySection } from './CategorySection';

interface MenuItemType {
  id: number;
  name: string;
  count: number;
  price: string;
  label?: string;
  category: string;
}

interface Order {
  id: number;
  customerName: string;
  menuItems: MenuItemType[];
  isMentah?: boolean;
  isBojot?: boolean;
}

interface OrderCardProps {
  order: Order;
  orderIndex: number;
  updateCount: (orderId: number, itemId: number, delta: number, e: React.MouseEvent) => void;
  updateCustomerName: (orderId: number, name: string) => void;
  removeOrder: (orderId: number) => void;
  toggleMentah: (orderId: number) => void;
  toggleBojot: (orderId: number) => void;
  isCollapsed: Record<string, boolean>;
  toggleCategory: (category: string) => void;
  categories: string[];
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  orderIndex,
  updateCount,
  updateCustomerName,
  removeOrder,
  toggleMentah,
  toggleBojot,
  isCollapsed,
  toggleCategory,
  categories
}) => {
  const totalItems = order.menuItems.reduce((sum, item) => item.name === 'Kuah Keju' ? sum : sum + item.count, 0);

  return (
    <Card key={order.id} className="shadow-2xl backdrop-blur-xl bg-white/40 border-white/50 border">
      <CardHeader className="bg-white/40 backdrop-blur-xl text-gray-800 rounded-t-lg px-6 py-4 border-b border-white/50">
        <CardTitle className="text-xl font-bold text-center">
          <div className="flex items-center justify-between w-full">
            <span>Cireng Berisi - Order #{orderIndex + 1}</span>
            {orderIndex > 0 && (
              <button
                onClick={() => removeOrder(order.id)}
                className="hover:text-red-700 font-bold active:scale-80 h-10 w-10 transition-transform duration-150 bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 rounded-full p-1"
                aria-label="Remove order"
              >
                ✕
              </button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 py-4 space-y-6">
        <div className="space-y-2">
          <label htmlFor={`name-${order.id}`} className="text-lg font-medium text-gray-700">
            Nama
          </label>
          <Input
            id={`name-${order.id}`}
            type="text"
            clearable
            placeholder="Pesanan atas nama..."
            value={order.customerName}
            onChange={(e) => updateCustomerName(order.id, e.target.value)}
            className="text-lg"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Menu</h3>
            <h3 className="text-xl font-semibold text-gray-800">
              Total: {totalItems} 🥟
            </h3>
          </div>
          <div className="flex w-full justify-between gap-x-4">
            <ToggleSwitch
              isActive={order.isMentah || false}
              onToggle={() => toggleMentah(order.id)}
              activeText="Mentah"
              inactiveText="Matang"
              activeColor="#91FEEA"
              inactiveColor="#FF5656"
            />
            <ToggleSwitch
              isActive={order.isBojot || false}
              onToggle={() => toggleBojot(order.id)}
              activeText="Bojot"
              inactiveText="Original"
              activeColor="#BF1A1A"
              inactiveColor="#FF5656"
              warningText="Minimal 5 cireng / cibay"
            />
          </div>

          {categories.map((category, categoryIndex) => {
            const categoryCollapsed = isCollapsed[category] ?? false;
            const categoryItems = order.menuItems.filter(item => item.category === category);

            return (
              <CategorySection
                key={categoryIndex}
                category={category}
                items={categoryItems}
                isCollapsed={categoryCollapsed}
                isBojot={order.isBojot || false}
                toggleCollapse={() => toggleCategory(category)}
                renderItems={(item) => (
                  <MenuItem
                    key={`${order.id}-${item.id}`}
                    item={item}
                    orderId={order.id}
                    updateCount={updateCount}
                  />
                )}
                orderIndex={orderIndex}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};