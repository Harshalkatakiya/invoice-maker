import { Button } from '@/components/ui/button';
import { useInvoiceItems } from '@/hooks/useInvoiceItems';
import { fetchProducts, saveInvoiceItems } from '@/services/api';
import { InvoiceFormInputs, Product } from '@/types/invoice';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InvoiceForm from './InvoiceForm';
import InvoiceItemsModal from './InvoiceItemsModal';

const InvoiceApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const {
    invoiceItems,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    clearInvoiceItems
  } = useInvoiceItems();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        toast.error('Failed to fetch products.');
      }
    };
    getProducts();
  }, []);
  const handleAddItem = (formData: InvoiceFormInputs) => {
    if (!formData.productId) {
      toast.error('Please select a product.');
      return;
    }
    const selectedProduct = products.find(
      (p) => p.productId == formData.productId
    );
    if (!selectedProduct) {
      toast.error('Selected product not found.');
      return;
    }
    addInvoiceItem({
      ...formData,
      productName: selectedProduct.productName,
      customer: formData.customer
    });
    if (invoiceItems.length === 0) {
      setIsModalOpen(true);
    }
  };
  const handleSubmitInvoice = async () => {
    if (invoiceItems.length === 0) {
      toast.error('No items to submit.');
      return;
    }
    try {
      await saveInvoiceItems(invoiceItems);
      clearInvoiceItems();
      toast.success('Invoice submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit invoice.');
      console.error('Error submitting invoice:', error);
      throw error;
    }
  };
  return (
    <div className='min-h-screen bg-invoice-background p-4 md:p-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mx-auto mb-8 max-w-7xl'>
        <h1 className='mb-2 text-center text-3xl font-bold text-invoice-text md:text-4xl'>
          Invoice Generator
        </h1>
        <p className='mb-8 text-center text-gray-600'>
          Create and manage your invoice items
        </p>
      </motion.div>
      <InvoiceForm onAddItem={handleAddItem} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className='mt-8 flex justify-center gap-4'>
        <Button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 rounded-md bg-invoice-primary px-6 py-2 text-white transition-colors duration-200 hover:bg-invoice-accent'>
          <Eye size={18} />
          View Data
        </Button>
        {invoiceItems.length > 0 && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className='rounded-md bg-invoice-accent px-6 py-2 text-white transition-colors duration-200 hover:bg-invoice-primary'>
            View {invoiceItems.length} Invoice Items
          </Button>
        )}
      </motion.div>
      <InvoiceItemsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceItems={invoiceItems}
        products={products}
        onUpdateItem={updateInvoiceItem}
        onRemoveItem={removeInvoiceItem}
        onSubmitInvoice={handleSubmitInvoice}
      />
    </div>
  );
};

export default InvoiceApp;
