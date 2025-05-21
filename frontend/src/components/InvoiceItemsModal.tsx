import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { InvoiceItem, Product } from '@/types/invoice';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

interface InvoiceItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceItems: InvoiceItem[];
  products: Product[];
  onUpdateItem: (id: string, updatedItem: Partial<InvoiceItem>) => void;
  onRemoveItem: (id: string) => void;
  onSubmitInvoice: () => Promise<void>;
}

const InvoiceItemsModal: React.FC<InvoiceItemsModalProps> = ({
  isOpen,
  onClose,
  invoiceItems,
  products,
  onUpdateItem,
  onRemoveItem,
  onSubmitInvoice
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const calculateNetAmount = (rate: number, discount: number) => {
    return rate - (rate * discount) / 100;
  };
  const calculateTotalAmount = (netAmount: number, quantity: number) => {
    return netAmount * quantity;
  };
  const handleProductChange = (itemId: string, productId: string) => {
    const selectedProduct = products.find((p) => p.productId === productId);
    if (selectedProduct) {
      const updatedValues = {
        productId,
        productName: selectedProduct.productName,
        rate: selectedProduct.rate,
        unit: selectedProduct.unit
      };
      const currentItem = invoiceItems.find((item) => item.id === itemId);
      if (currentItem) {
        const netAmount = calculateNetAmount(
          selectedProduct.rate,
          currentItem.discount
        );
        const totalAmount = calculateTotalAmount(
          netAmount,
          currentItem.quantity
        );
        onUpdateItem(itemId, {
          ...updatedValues,
          netAmount,
          totalAmount
        });
      }
    }
  };
  const handleQuantityChange = (itemId: string, quantityStr: string) => {
    const quantity = parseFloat(quantityStr) || 0;
    if (quantity <= 0) return;
    const currentItem = invoiceItems.find((item) => item.id === itemId);
    if (currentItem) {
      const totalAmount = calculateTotalAmount(currentItem.netAmount, quantity);
      onUpdateItem(itemId, { quantity, totalAmount });
    }
  };
  const handleDiscountChange = (itemId: string, discountStr: string) => {
    const discount = parseFloat(discountStr) || 0;
    if (discount < 0 || discount > 100) return;
    const currentItem = invoiceItems.find((item) => item.id === itemId);
    if (currentItem) {
      const netAmount = calculateNetAmount(currentItem.rate, discount);
      const totalAmount = calculateTotalAmount(netAmount, currentItem.quantity);
      onUpdateItem(itemId, { discount, netAmount, totalAmount });
    }
  };
  const handleSubmit = async () => {
    if (invoiceItems.length === 0) {
      toast.error('No items to submit. Please add at least one item.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitInvoice();
      toast.success('Invoice submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit invoice. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatNumber = (value: string | number): string => {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    return !isNaN(numValue) ? numValue.toFixed(2) : '0.00';
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='flex max-h-[90vh] flex-col overflow-hidden sm:max-w-[90vw]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-invoice-text'>
            Invoice Items
          </DialogTitle>
        </DialogHeader>
        <div
          ref={tableRef}
          className='my-4 flex-grow overflow-auto rounded-md border border-gray-200'>
          <Table className='min-w-[800px]'>
            <TableHeader className='sticky top-0 z-10 bg-invoice-secondary'>
              <TableRow>
                <TableHead className='w-1/6'>Product</TableHead>
                <TableHead className='w-1/12 text-right'>Rate</TableHead>
                <TableHead className='w-1/12'>Unit</TableHead>
                <TableHead className='w-1/12 text-right'>Qty</TableHead>
                <TableHead className='w-1/12 text-right'>Disc%</TableHead>
                <TableHead className='w-1/12 text-right'>Net Amt.</TableHead>
                <TableHead className='w-1/6 text-right'>Total Amt.</TableHead>
                <TableHead className='w-1/12 text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {invoiceItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='border-b hover:bg-gray-50'
                    layout>
                    <TableCell>
                      <Select
                        value={item.productId}
                        onValueChange={(value) =>
                          handleProductChange(item.id, value)
                        }>
                        <SelectTrigger className='border-gray-300 focus:border-invoice-primary'>
                          <SelectValue>{item.productName}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.productId}
                              value={product.productId}>
                              {product.productName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(item.rate)}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        min='1'
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className='w-full p-1 text-right'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        min='0'
                        max='100'
                        value={item.discount}
                        onChange={(e) =>
                          handleDiscountChange(item.id, e.target.value)
                        }
                        className='w-full p-1 text-right'
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(item.netAmount)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatNumber(item.totalAmount)}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Button
                        variant='ghost'
                        className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                        onClick={() => onRemoveItem(item.id)}>
                        <Trash size={16} />
                        <span className='sr-only'>Remove</span>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          {invoiceItems.length === 0 && (
            <div className='flex items-center justify-center p-8 text-gray-500'>
              No invoice items added yet.
            </div>
          )}
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <div className='font-medium text-invoice-text'>
            Total Items: {invoiceItems.length}
          </div>
          <div className='font-medium text-invoice-text'>
            Grand Total:{' '}
            {formatNumber(
              invoiceItems.reduce((sum, item) => sum + item.totalAmount, 0)
            )}
          </div>
        </div>
        <div className='mt-4 flex justify-end gap-4'>
          <Button
            variant='outline'
            onClick={onClose}
            className='border-gray-300 text-gray-700 hover:bg-gray-100'
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className='bg-invoice-primary text-white hover:bg-invoice-accent'
            disabled={invoiceItems.length === 0 || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Invoice'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceItemsModal;
