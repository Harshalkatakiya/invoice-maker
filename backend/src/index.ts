import cors from 'cors';
import express from 'express';
import env from 'utils/env';
import invoiceRoutes from './routes/invoice.routes';
import productRoutes from './routes/product.routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello');
})
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

app.listen(env.PORT, () => {
  console.log(`🚀 Server listening on ${env.HOST_NAME}:${env.PORT}`);
});
