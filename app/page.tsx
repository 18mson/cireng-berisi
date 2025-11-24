"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/button';
import { Send, PlusCircle } from 'lucide-react';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import { OrderCard } from '@/components/OrderCard';

export interface MenuItemType {
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
      { id: 8, name: 'Kuah Keju', count: 0, price: kuahKejuPrice, label: 'Kuah aja', category: 'lainnya' }
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
      customerName: `${orders?.length ? orders[0].customerName : 'Pesanan'} ${newId}`,
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
      const cirengCount = order.menuItems
        .filter(item => item.category === 'cireng' || item.category === 'cibay')
        .reduce((sum, item) => sum + item.count, 0);
      const isBojot = order.isBojot && cirengCount > 0;
      return hasName && hasItems && (!isBojot || cirengCount >= 5);
    });

    if (validOrders.length === 0) {
      const anyBojotUnder5 = orders.some(order => {
        const cirengCount = order.menuItems
          .filter(item => item.category === 'cireng' || item.category === 'cibay')
          .reduce((sum, item) => sum + item.count, 0);
        return order.isBojot && cirengCount > 0 && cirengCount < 5;
      });
      toast.error(
        anyBojotUnder5
          ? 'Pesanan Bojot minimal 5 cireng / cibay.'
          : 'Tolong isi minimal satu pesanan dengan nama dan item yang dipilih.'
      );
      return;
    }

    const orderText = validOrders.map(order => {
      const orderItems = order.menuItems.filter(item => item.count > 0);
      const totalItems = orderItems.filter(item => item.name !== 'Kuah Keju').reduce((sum, item) => sum + item.count, 0);
      const matangMentahText = order.isMentah ? 'Mentah' : 'Matang';
      const totalKeju = orderItems.filter(item => item.name === 'Kuah Keju').reduce((sum, item) => sum + item.count, 0);
      const bojotText = order.isBojot ? '*di Bojot ♨️*' : '';

      return (
        `saya: *${order.customerName}* ✨\n` +
        `Mau Cireng: *${matangMentahText }* ${bojotText}\n` +
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

      const bojotTotals = validOrders
      .filter(o => o.isBojot)
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
            ? `*Matang:* *${Object.values(matangTotals).reduce((a, b) => a + b, 0)}*🍽 \n${Object.entries(matangTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +
          (Object.keys(mentahTotals).length > 0
            ? `*Mentah:* *${Object.values(mentahTotals).reduce((a, b) => a + b, 0)}*🍳\n${Object.entries(mentahTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +
          (Object.keys(bojotTotals).length > 0
            ? `*Bojot:*🍽\n${Object.entries(bojotTotals)
                .map(([name, count]) => `> ${name}: ${count}`)
                .join('\n')}\n`
            : '') +

          `*Total Semua:* *${grandTotalItems} Cireng* 🥟 ` +
          (totalKuah > 0 ? `\n*Kuah Keju:* *${totalKuah} cup* 🍽` : '')
        : '';

    const byText = byParam ? `\n\nTitip: ${byParam}` : '';

    const whatsappUrl = `https://wa.me/6282318000199?text=${encodeURIComponent('Halo \n' + orderText + summaryText + byText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleMentah = (orderId: number) => {
    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId ? { ...o, isMentah: !o.isMentah } : o
      )
    );
  };

  const toggleBojot = (orderId: number) => {
    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId ? { ...o, isBojot: !o.isBojot } : o
      )
    );
  };

  const toggleCategory = (category: string) => {
    setIsCollapsed(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const removeOrder = (orderId: number) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 py-6 md:px-4 px-2">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl mx-auto space-y-6">
        {orders.map((order, orderIndex) => (
          <OrderCard
            key={order.id}
            order={order}
            orderIndex={orderIndex}
            updateCount={updateCount}
            updateCustomerName={updateCustomerName}
            removeOrder={removeOrder}
            toggleMentah={toggleMentah}
            toggleBojot={toggleBojot}
            isCollapsed={isCollapsed}
            toggleCategory={toggleCategory}
            categories={categories}
          />
        ))}

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
