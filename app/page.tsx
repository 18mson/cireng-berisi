"use client";

import { useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Minus, Plus, Send, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

interface MenuItem {
  name: string;
  count: number;
}

interface Order {
  id: number;
  customerName: string;
  menuItems: MenuItem[];
}

const initialMenuItems: MenuItem[] = [
  { name: 'Keju', count: 0 },
  { name: 'Jando', count: 0 },
  { name: 'Ati', count: 0 },
  { name: 'Ayam', count: 0 },
  { name: 'Seblak', count: 0 },
];

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customerName: '', menuItems: [...initialMenuItems] }
  ]);

  const updateCount = (
    orderId: number,
    itemIndex: number,
    delta: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          menuItems: order.menuItems.map((item, idx) =>
            idx === itemIndex
              ? { ...item, count: Math.max(0, item.count + delta) }
              : item
          ),
        };
      })
    );

  };


  const updateCustomerName = (orderId: number, name: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, customerName: name } : order
    ));
  };

  const addNewOrder = () => {
    const newId = Math.max(...orders.map(o => o.id)) + 1;
    setOrders(prev => [...prev, {
      id: newId,
      customerName: '',
      menuItems: [...initialMenuItems]
    }]);
  };

  const handleSubmit = () => {
    const validOrders = orders.filter(order => {
      const hasName = order.customerName.trim();
      const hasItems = order.menuItems.some(item => item.count > 0);
      return hasName && hasItems;
    });

    if (validOrders.length === 0) {
      alert('Tolong isi minimal satu pesanan dengan nama dan item yang dipilih.');
      return;
    }

    const orderText = validOrders.map(order => {
      const orderItems = order.menuItems.filter(item => item.count > 0);
      return `*Halo saya:* ${order.customerName}\n*Mau Pesan:*\n${orderItems
        .map(item => `${item.name}: ${item.count}`)
        .join('\n')}`;
    }).join('\n\n---\n\n');

    const whatsappUrl = `https://wa.me/6282318000199?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {orders.map((order, orderIndex) => (
          <Card key={order.id} className="shadow-xl">
            <CardHeader className="bg-blue-400 text-white">
              <CardTitle className="text-2xl font-bold text-center">
                Cireng Berisi - Order #{orderIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor={`name-${order.id}`} className="text-sm font-medium text-gray-700">
                  Nama
                </label>
                <Input
                  id={`name-${order.id}`}
                  type="text"
                  placeholder="Pesanan atas nama..."
                  value={order.customerName}
                  onChange={(e) => updateCustomerName(order.id, e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Menu</h3>
                {order.menuItems.map((item, index) => (
                  <div
                    key={item.name}
                    className={clsx('flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-colors',
                      {'bg-gray-200' : item.count === 0,
                        'bg-white': item.count > 0
                      }
                    )}
                  >
                    <span className="text-lg font-medium text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => updateCount(order.id, index, -1, e)}
                        disabled={item.count === 0}
                        className="h-10 w-10 rounded-full"
                        type="button"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold min-w-8 text-center text-gray-900">
                        {item.count}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => updateCount(order.id, index, 1, e)}
                        className="h-10 w-10 rounded-full"
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addNewOrder}
          variant="outline"
          className="hidden w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 text-lg py-6"
          type="button"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Another Order
        </Button>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:from-orange-600 hover:bg-blue-600 text-white text-lg py-6 shadow-lg"
        >
          <Send className="mr-2 h-5 w-5" />
          Kirim Pesanan ke WhatsApp
        </Button>
      </div>
    </div>
  );
}
