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
  isMentah?: boolean;
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

    // Scroll to bottom after new order is added
    setTimeout(() => {
      window.scrollBy({ top: 300, behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(window.location.search);
    const byParam = params.get('by'); 

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
      const totalItems = orderItems.reduce((sum, item) => sum + item.count, 0);
      const matangMentahText = order.isMentah ? 'Mentah' : 'Matang';

      return (
        `saya: *${order.customerName}* ✨\n` +
        `Mau Cireng: *${matangMentahText}*\n` +
        `${orderItems.map(item => `• ${item.name}: ${item.count}`).join('\n')}\n` +
        `Total: *${totalItems}* 🥟`
      );
    }).join('\n\n-----\n\n');


    const grandTotals = validOrders.reduce<Record<string, number>>((acc, order) => {
      order.menuItems.forEach(item => {
        acc[item.name] = (acc[item.name] || 0) + item.count;
      });
      return acc;
    }, {});

    const grandTotalItems = Object.values(grandTotals).reduce((sum, c) => sum + c, 0);

    const matangTotals = validOrders
      .filter(o => !o.isMentah)
      .reduce<Record<string, number>>((acc, order) => {
        order.menuItems.forEach(item => {
          if (item.count > 0) acc[item.name] = (acc[item.name] || 0) + item.count;
        });
        return acc;
      }, {});

    const mentahTotals = validOrders
      .filter(o => o.isMentah)
      .reduce<Record<string, number>>((acc, order) => {
        order.menuItems.forEach(item => {
          if (item.count > 0) acc[item.name] = (acc[item.name] || 0) + item.count;
        });
        return acc;
      }, {});

    const summaryText =
      validOrders.length > 1
        ? `\n\n----------------\n✨*Total Keseluruhan:*✨\n` +
          (Object.keys(matangTotals).length > 0
            ? `*Matang:🍽*\n${Object.entries(matangTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +
          (Object.keys(mentahTotals).length > 0
            ? `*Mentah:🍳*\n${Object.entries(mentahTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +
          `*Total Semua:* *${grandTotalItems} cireng* 🥟`
        : '';

    const byText = byParam ? `\n\nTitip: ${byParam}` : '';

    const whatsappUrl = `https://wa.me/6282318000199?text=${encodeURIComponent('Halo \n' + orderText + summaryText + byText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {orders.map((order, orderIndex) => {
          const totalItems = order.menuItems.reduce((sum, item) => sum + item.count, 0);

          return (
            <Card key={order.id} className="shadow-xl">
              <CardHeader className="bg-blue-300 text-white">
                <CardTitle className="text-xl font-bold text-center">
                  <div className="flex items-center justify-between w-full">
                    <span>Cireng Berisi - Order #{orderIndex + 1}</span>
                    {orders.length > 1 && (
                      <button
                        onClick={() =>
                          setOrders((prev) => prev.filter((o) => o.id !== order.id))
                        }
                        className="hover:text-red-700 font-bold active:scale-80 h-10 w-10 transition-transform duration-150 bg-gray-500 text-white rounded-full p-1"
                        aria-label="Remove order"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor={`name-${order.id}`} className="text-lg font-medium text-gray-700">
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
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">Menu</h3>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Total: {totalItems} 🥟
                    </h3>
                  </div>
                  {order.menuItems.map((item, index) => (
                    <div
                      key={item.name}
                      className={clsx('flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors',
                        {'bg-gray-200' : item.count === 0,
                          'bg-white': item.count > 0
                        }
                      )}
                    >
                      <span className="text-lg font-medium text-gray-800">{item.name}</span>
                      <div className="flex items-center gap-3 group">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => updateCount(order.id, index, -1, e)}
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
                          onClick={(e) => updateCount(order.id, index, 1, e)}
                          className="h-10 w-10 rounded-full active:scale-80 transition-transform duration-150"
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-center mt-4">
                    <div
                      className={clsx(
                        'flex items-center w-60 h-10 rounded-full cursor-pointer transition-colors',
                        order.isMentah ? 'bg-red-400' : 'bg-green-400'
                      )}
                      onClick={() =>
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o.id === order.id ? { ...o, isMentah: !o.isMentah } : o
                          )
                        )
                      }
                    >
                      <div
                        className={clsx(
                          'w-1/2 h-full flex items-center justify-center text-white font-bold rounded-full transition-transform active:scale-80',
                          order.isMentah ? 'translate-x-0 bg-red-600' : 'translate-x-full bg-green-600'
                        )}
                      >
                        {order.isMentah ? 'Mentah' : 'Matang'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button
          onClick={addNewOrder}
          variant="outline"
          className="w-full border-2 border-blue-500 text-blue-600 bg-gray-200 hover:bg-orange-50 text-lg py-6 active:scale-80 transition-transform duration-150"
          type="button"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Tambah Pesanan Baru
        </Button>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:from-orange-600 hover:bg-blue-600 text-white text-lg py-6 shadow-lg fixed bottom-0 left-0 rounded-none"
        >
          <Send className="mr-2 h-5 w-5" />
          Kirim Pesanan ke WhatsApp
        </Button>
      </div>
    </div>
  );
}
