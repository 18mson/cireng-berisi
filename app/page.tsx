"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Minus, Plus, Send, PlusCircle, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';

interface MenuItem {
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
  menuItems: MenuItem[];
  isMentah?: boolean;
}

export default function Home() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<Record<string, boolean>>({});

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = ['cireng', 'cibay', 'lainnya'];

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const params = new URLSearchParams(window.location.search);
    const byParam = params.get('by');
    const kuahKejuPrice = byParam === 'salma' ? '3k' : '5k';

    const initialItems = [
      { id: 1, name: 'Keju', count: 0, price: '1k', category: 'cireng' },
      { id: 2, name: 'Jando', count: 0, price: '1k', label:'Pedas', category: 'cireng' },
      { id: 3, name: 'Ati', count: 0, price: '1k', label:'Pedas', category: 'cireng' },
      { id: 4, name: 'Ayam', count: 0, price: '1k', category: 'cireng' },
      { id: 5, name: 'Seblak', count: 0, price: '1k', label:'Pedas', category: 'cireng' },
      { id: 6, name: 'Cibay lumer', count: 0, price: '1k', label:'Baru', category: 'cibay' },
      { id: 7, name: 'Cibay ayam', count: 0, price: '1k', label:'Baru', category: 'cibay' },
      { id: 8, name: 'Kuah Keju', count: 0, price: kuahKejuPrice, label: 'Baru', category: 'lainnya' }
    ];

    return [{ id: 1, customerName: '', menuItems: initialItems }];
  });


    useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      setIsScrolling(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 100);

      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      setIsBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateCount = (
    orderId: number,
    itemId: number,
    delta: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id !== orderId) return order;
        console.log(orderId);
        
        return {
          ...order,
          menuItems: order.menuItems.map(item =>
            item.id === itemId
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
    const params = new URLSearchParams(window.location.search);
    const byParam = params.get('by');
    const kuahKejuPrice = byParam === 'salma' ? '3k' : '5k';
    
    const initialItems = [
      { id: 1, name: 'Keju', count: 0, price: '1k', category: 'cireng' },
      { id: 2, name: 'Jando', count: 0, price: '1k', label:'Pedas', category: 'cireng' },
      { id: 3, name: 'Ati', count: 0, price: '1k', label:'Pedas', category: 'cireng' },
      { id: 4, name: 'Ayam', count: 0, price: '1k', category: 'cireng' },
      { id: 5, name: 'Seblak', count: 0, price: '1k', label:'Pedas', category: 'cireng' },
      { id: 6, name: 'Cibay lumer', count: 0, price: '1k', label:'Baru', category: 'cibay' },
      { id: 7, name: 'Cibay ayam', count: 0, price: '1k', label:'Baru', category: 'cibay' },
      { id: 8, name: 'Kuah Keju', count: 0, price: kuahKejuPrice, label: 'Baru', category: 'lainnya' }
    ];
    
    setOrders(prev => [...prev, {
      id: newId,
      customerName: '',
      menuItems: initialItems
    }]);

    // Scroll to bottom after new order is added
    setTimeout(() => {
      window.scrollBy({ top: 500, behavior: 'smooth' });
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
      toast.error('Tolong isi minimal satu pesanan dengan nama dan item yang dipilih.');
      return;
    }

    const orderText = validOrders.map(order => {
      const orderItems = order.menuItems.filter(item => item.count > 0);
      const totalItems = orderItems.filter(item => item.name !== 'Kuah Keju').reduce((sum, item) => sum + item.count, 0);
      const matangMentahText = order.isMentah ? 'Mentah' : 'Matang';
      const totalKeju = orderItems.filter(item => item.name === 'Kuah Keju').reduce((sum, item) => sum + item.count, 0);

      return (
        `saya: *${order.customerName}* ✨\n` +
        `Mau Cireng: *${matangMentahText}*\n` +
        `${orderItems.map(item => `• ${item.name}: ${item.count}`).join('\n')}\n` +
        `Total: *${totalItems}* 🥟` +
        (totalKeju > 0 ? `\nKuah Keju: *${totalKeju} cup* 🥣🍵` : '')
      );
    }).join('\n\n-----\n\n');


    const grandTotals = validOrders.reduce<Record<string, number>>((acc, order) => {
      order.menuItems.forEach(item => {
        acc[item.name] = (acc[item.name] || 0) + item.count;
      });
      return acc;
    }, {});

    // Sum everything except "Kuah Keju"
    const grandTotalItems = Object.entries(grandTotals)
      .filter(([name]) => name !== 'Kuah Keju')
      .reduce((sum, [, count]) => sum + count, 0);

    const matangTotals = validOrders
      .filter(o => !o.isMentah)
      .reduce<Record<string, number>>((acc, order) => {
        order.menuItems.forEach(item => {
          if (item.count > 0 && item.name !== 'Kuah Keju') {
            acc[item.name] = (acc[item.name] || 0) + item.count;
          }
        });
        return acc;
      }, {});

    const mentahTotals = validOrders
      .filter(o => o.isMentah)
      .reduce<Record<string, number>>((acc, order) => {
        order.menuItems.forEach(item => {
          if (item.count > 0 && item.name !== 'Kuah Keju') {
            acc[item.name] = (acc[item.name] || 0) + item.count;
          }
        });
        return acc;
      }, {});

    const totalKuah = grandTotals['Kuah Keju'] || 0;

    const summaryText =
      validOrders.length > 1
        ? `\n\n----------------\n✨*Total Keseluruhan:*✨\n` +
          (Object.keys(matangTotals).length > 0
            ? `*Matang:*🍽\n${Object.entries(matangTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +
          (Object.keys(mentahTotals).length > 0
            ? `*Mentah:*🍳\n${Object.entries(mentahTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +
          `*Total Semua:* *${grandTotalItems}* 🥟 ` +
          (totalKuah > 0 ? `\n*Kuah Keju:* *${totalKuah} cup* 🍽` : '')
        : '';

    const byText = byParam ? `\n\nTitip: ${byParam}` : '';

    const whatsappUrl = `https://wa.me/6282318000199?text=${encodeURIComponent('Halo \n' + orderText + summaryText + byText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderItems = (item: MenuItem, orderIndex: number) => (
    <div
      key={item.name}
      className={clsx('flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors duration-600',
        {'bg-linear-to-r from-gray-300 to-gray-200' : item.count === 0,
          'bg-linear-to-l from-yellow-400 to-yellow-200': item.count > 0
        }
      )}
    >
      {item.label && (
        <span className={clsx("absolute mb-14 -ml-6 font-medium text-sm px-2 rounded-full", {
          'text-white bg-red-600': item.label === 'Pedas',
          'text-gray-500 bg-yellow-300': item.label !== 'Pedas'
        })}>
          {item.label}
        </span>
      )}
      <span className="font-medium text-gray-800 flex-1">{item.name}</span>
      <span className="text-lg font-medium text-gray-800 flex-1 text-right pr-2">{item.price}</span>
      <div className="flex items-center gap-3 group">
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => updateCount(orders[orderIndex].id, item.id, -1, e)}
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
          onClick={(e) => updateCount(orders[orderIndex].id, item.id, 1, e)}
          className="h-10 w-10 rounded-full active:scale-80 transition-transform duration-150"
          type="button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 py-6 md:px-4 px-2">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl mx-auto space-y-6">
        {orders.map((order, orderIndex) => {
          const totalItems = order.menuItems.reduce((sum, item) => item.name === 'Kuah Keju' ? sum : sum + item.count, 0);

          return (
            <Card key={order.id} className="shadow-xl">
              <CardHeader className="bg-blue-300 text-white rounded-t-lg px-6 py-4">
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
              <CardContent className="p-2 py-4 space-y-6">
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
                  {categories.map((category) => {
                    const categoryCollapsed = isCollapsed[category] ?? false;
                    return (
                      <div className="bg-gray-100 rounded-2xl pb-2 border hover:bg-gray-200" key={category}>
                        <div
                          className="flex justify-between items-center cursor-pointer rounded-2xl p-2 py-2"
                          onClick={() =>
                            setIsCollapsed((prev) => ({
                              ...prev,
                              [category]: !categoryCollapsed,
                            }))
                          }
                        >
                          <h3 className="text-sm font-semibold text-gray-800 text-uppercase">
                            {category}
                          </h3>
                          <ChevronUp
                            className={clsx(
                              'h-6 w-6 text-gray-600 transition-transform duration-300',
                              { 'rotate-180': categoryCollapsed }
                            )}
                          />
                        </div>
                        <div
                          className={clsx(
                            'space-y-2 px-2 overflow-hidden transition-all duration-300 ease-in-out',
                            categoryCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
                          )}
                        >
                          {order.menuItems.filter(item => item.category === category).map((item) => (
                            renderItems(item, orderIndex)
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
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
          className="w-full border-2 border-blue-500 text-blue-600 bg-gray-200 hover:bg-orange-50 text-lg py-6 active:scale-80 transition-transform duration-150 mb-14"
          type="button"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Tambah Pesanan Baru
        </Button>
        <Button
          onClick={handleSubmit}
          className={clsx(
            ' hover:from-orange-600 hover:bg-blue-600 text-white text-lg py-6 shadow-lg left-0 fixed rounded-none transition-all duration-300',
            isBottom && !isScrolling ? 'translate-x-0 w-full h-16 bottom-0 bg-blue-500' : 'bg-blue-500/50 backdrop-blur-md translate-x-1/2 w-1/2 rounded-4xl bottom-1 ml-20 md:ml-0 shadow-2xl'
          )}
        >
          <Send className="mr-2 h-5 w-5" />
          {isBottom && !isScrolling ? 'Kirim Pesanan -- Total: ' : ''}Rp{orders.reduce((sum, order) => 
            sum + order.menuItems.reduce((orderSum, item) => 
              orderSum + (item.count * (item.price === '1k' ? 1 : item.price === '3k' ? 3 : 5)), 0
            ), 0
          )}K
        </Button>
      </div>
    </div>
  );
}
