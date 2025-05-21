export interface Product {
  productId: string;
  productName: string;
  rate: number;
  unit: string;
}

export interface InvoiceItem {
  id: string;
  customer: string;
  productId: string;
  productName: string;
  rate: number;
  unit: string;
  quantity: number;
  discount: number;
  netAmount: number;
  totalAmount: number;
}

export interface InvoiceFormInputs {
  customer: string;
  productId: string;
  rate: number;
  unit: string;
  quantity: number;
  discount: number;
  netAmount: number;
  totalAmount: number;
}
