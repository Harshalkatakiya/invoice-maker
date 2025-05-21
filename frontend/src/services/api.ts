import { InvoiceItem, Product } from '@/types/invoice';
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const saveInvoiceItems = async (
  invoiceItems: InvoiceItem[]
): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post('/invoices', invoiceItems);
    return response.data;
  } catch (error) {
    console.error('Error saving invoice items:', error);
    throw error;
  }
};
