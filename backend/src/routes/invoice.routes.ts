import { createInvoice } from 'controllers/invoice.controller';
import express from 'express';

const router = express.Router();

router.post('/', createInvoice);

export default router;
