export interface InvoiceItemDTO {
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

export interface CreateInvoiceResponse {
  message: 'Invoice created';
  invoiceId: number;
}

export interface AddProductDTO {
  productName: string;
  rate: number;
  unit: string;
}
