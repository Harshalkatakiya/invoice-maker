import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { fetchProducts } from '@/services/api';
import { InvoiceFormInputs, Product } from '@/types/invoice';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface InvoiceFormProps {
  onAddItem: (formData: InvoiceFormInputs) => void;
}

const InvoiceForm = ({ onAddItem }: InvoiceFormProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<InvoiceFormInputs>({
    defaultValues: {
      customer: '',
      productId: '',
      rate: 0,
      unit: '',
      quantity: 1,
      discount: 0,
      netAmount: 0,
      totalAmount: 0
    }
  });
  const watchRate = watch('rate');
  const watchQuantity = watch('quantity');
  const watchDiscount = watch('discount');
  const watchProductId = watch('productId');
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        toast.error('Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);
  useEffect(() => {
    if (watchProductId) {
      const selectedProduct = products.find(
        (p) => p.productId == watchProductId
      );
      if (selectedProduct) {
        setValue('rate', selectedProduct.rate);
        setValue('unit', selectedProduct.unit);
      }
    }
  }, [watchProductId, products, setValue]);
  useEffect(() => {
    const netAmount = watchRate - (watchRate * watchDiscount) / 100;
    setValue('netAmount', parseFloat(netAmount.toFixed(2)));
    const totalAmount = netAmount * watchQuantity;
    setValue('totalAmount', parseFloat(totalAmount.toFixed(2)));
  }, [watchRate, watchDiscount, watchQuantity, setValue]);
  const onSubmit = (data: InvoiceFormInputs) => {
    const selectedProduct = products.find((p) => p.productId == data.productId);
    if (!selectedProduct) {
      toast.error('Please select a valid product.');
      return;
    }
    const itemToAdd = {
      ...data,
      productName: selectedProduct.productName
    };
    onAddItem(itemToAdd);
    const customerName = data.customer;
    reset({
      customer: customerName,
      productId: '',
      rate: 0,
      unit: '',
      quantity: 1,
      discount: 0,
      netAmount: 0,
      totalAmount: 0
    });
    toast.success('Item added to invoice!');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='mx-auto w-full max-w-4xl'>
      <Card className='border-t-4 border-invoice-primary bg-white shadow-lg'>
        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label
                  htmlFor='customer'
                  className='font-medium text-invoice-text'>
                  Customer Name
                </Label>
                <Input
                  id='customer'
                  placeholder='Enter customer name'
                  className='border-gray-300 focus:border-invoice-primary focus:ring focus:ring-invoice-secondary focus:ring-opacity-50'
                  {...register('customer', {
                    required: 'Customer name is required'
                  })}
                />
                {errors.customer && (
                  <p className='text-sm text-red-500'>
                    {errors.customer.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='productId'
                  className='font-medium text-invoice-text'>
                  Product Name
                </Label>
                <Select
                  value={watchProductId}
                  onValueChange={(value) => setValue('productId', value)}
                  disabled={isLoading}>
                  <SelectTrigger className='border-gray-300 focus:border-invoice-primary'>
                    <SelectValue placeholder='Select a product' />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.productId}
                        value={String(product.productId)}>
                        {product.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className='text-sm text-red-500'>
                    {errors.productId.message}
                  </p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <div className='space-y-2'>
                <Label htmlFor='rate' className='font-medium text-invoice-text'>
                  Rate
                </Label>
                <Input
                  id='rate'
                  type='number'
                  step='0.01'
                  min='0'
                  className='border-gray-300 focus:border-invoice-primary focus:ring focus:ring-invoice-secondary focus:ring-opacity-50'
                  {...register('rate', {
                    required: 'Rate is required',
                    min: { value: 0, message: 'Rate must be positive' }
                  })}
                />
                {errors.rate && (
                  <p className='text-sm text-red-500'>{errors.rate.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='unit' className='font-medium text-invoice-text'>
                  Unit
                </Label>
                <Input
                  id='unit'
                  readOnly
                  className='border-gray-300 bg-gray-50'
                  {...register('unit')}
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='quantity'
                  className='font-medium text-invoice-text'>
                  Quantity
                </Label>
                <Input
                  id='quantity'
                  type='number'
                  step='1'
                  min='1'
                  className='border-gray-300 focus:border-invoice-primary focus:ring focus:ring-invoice-secondary focus:ring-opacity-50'
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Quantity must be at least 1' }
                  })}
                />
                {errors.quantity && (
                  <p className='text-sm text-red-500'>
                    {errors.quantity.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='discount'
                  className='font-medium text-invoice-text'>
                  Discount (%)
                </Label>
                <Input
                  id='discount'
                  type='number'
                  step='0.01'
                  min='0'
                  max='100'
                  className='border-gray-300 focus:border-invoice-primary focus:ring focus:ring-invoice-secondary focus:ring-opacity-50'
                  {...register('discount', {
                    min: { value: 0, message: 'Discount cannot be negative' },
                    max: { value: 100, message: 'Discount cannot exceed 100%' }
                  })}
                />
                {errors.discount && (
                  <p className='text-sm text-red-500'>
                    {errors.discount.message}
                  </p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label
                  htmlFor='netAmount'
                  className='font-medium text-invoice-text'>
                  Net Amount
                </Label>
                <Input
                  id='netAmount'
                  readOnly
                  className='border-gray-300 bg-gray-50'
                  value={watch('netAmount').toFixed(2)}
                  {...register('netAmount')}
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='totalAmount'
                  className='font-medium text-invoice-text'>
                  Total Amount
                </Label>
                <Input
                  id='totalAmount'
                  readOnly
                  className='border-gray-300 bg-gray-50'
                  value={watch('totalAmount').toFixed(2)}
                  {...register('totalAmount')}
                />
              </div>
            </div>
            <div className='flex justify-center'>
              <Button
                type='submit'
                className='flex w-full items-center justify-center gap-2 rounded-md bg-invoice-primary px-8 py-2 text-white transition-colors duration-200 hover:bg-invoice-accent sm:w-auto'>
                <Plus className='h-4 w-4' />
                <span>Add</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceForm;
