import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MenuItemType {
  id: number;
  name: string;
  count: number;
  price: string;
  label?: string;
  category: string;
  status?: string;
}

export interface SheetRow {
  id: string;
  name: string;
  count: string;
  price: string;
  label: string;
  category: string;
  status: string;
}

export function sheetToObjects(sheetData: string[][]): MenuItemType[] {
  if (sheetData.length < 2) return [];

  const headers = sheetData[0];
  const rows = sheetData.slice(1);

  return rows.map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });

    return {
      id: parseInt(obj.id) || 0,
      name: obj.name,
      count: parseInt(obj.count) || 0,
      price: obj.price,
      label: obj.label || undefined,
      category: obj.category,
      status: obj.status || undefined,
    };
  });
}

export interface Order {
  id: number;
  customerName: string;
  menuItems: MenuItemType[];
  isMentah?: boolean;
  isBojot?: boolean;
}

export function calculateTotalPrice(orders: Order[]): number {
  return orders.reduce((sum, order) =>
    sum + order.menuItems.reduce((orderSum, item) =>
      orderSum + (item.count * parseInt(item.price.replace('k', ''))), 0
    ), 0
  );
}
