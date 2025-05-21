import { InvoiceItem } from '@/types/invoice';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useInvoiceItems = () => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  useEffect(() => {
    const storedItems = localStorage.getItem('invoiceItems');
    if (storedItems) {
      try {
        setInvoiceItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Error parsing stored invoice items:', error);
        localStorage.removeItem('invoiceItems');
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
  }, [invoiceItems]);
  const addInvoiceItem = (item: Omit<InvoiceItem, 'id'>) => {
    const newItem = {
      ...item,
      id: uuidv4()
    };
    setInvoiceItems((prev) => [...prev, newItem]);
    return newItem;
  };
  const updateInvoiceItem = (id: string, updatedItem: Partial<InvoiceItem>) => {
    setInvoiceItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };
  const removeInvoiceItem = (id: string) => {
    setInvoiceItems((prev) => prev.filter((item) => item.id !== id));
  };
  const clearInvoiceItems = () => {
    setInvoiceItems([]);
    localStorage.removeItem('invoiceItems');
  };
  return {
    invoiceItems,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    clearInvoiceItems
  };
};
