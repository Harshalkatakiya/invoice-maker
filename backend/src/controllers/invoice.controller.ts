import { desc, eq, inArray } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db/index';
import {
  invoiceDetail,
  invoiceMaster,
  productMaster
} from '../db/schema/schema';
import { CreateInvoiceResponse, InvoiceItemDTO } from '../types/invoice';
import { calculateNetAndTotal } from '../utils/calc';

export const createInvoice = async (
  req: Request<{}, CreateInvoiceResponse, InvoiceItemDTO[]>,
  res: Response<CreateInvoiceResponse>
): Promise<void> => {
  try {
    const items = req.body;
    const productIds = items.map((i) => Number(i.productId));
    const existing = await db
      .select({ id: productMaster.productId })
      .from(productMaster)
      .where(inArray(productMaster.productId, productIds));
    const existingIds = new Set(existing.map((r) => r.id));
    const missing = productIds.filter((id) => !existingIds.has(id));
    if (missing.length) {
      res.status(400).json({
        error: `Product IDs not found: ${[...new Set(missing)].join(', ')}`
      } as any);
      return;
    }
    const [last] = await db
      .select({ invoiceNo: invoiceMaster.invoiceNo })
      .from(invoiceMaster)
      .orderBy(desc(invoiceMaster.invoiceNo))
      .limit(1);
    const nextInvoiceNo = (last?.invoiceNo ?? 0) + 1;
    const [master] = await db
      .insert(invoiceMaster)
      .values({
        invoiceNo: nextInvoiceNo,
        customerName: items[0].customer
      })
      .returning();
    let runningTotal = 0;
    const detailRows = items.map((item) => {
      const rateNum = parseFloat(String(item.rate));
      const qty = item.quantity;
      const disc = item.discount;
      const { netAmount, totalAmount } = calculateNetAndTotal(
        rateNum,
        qty,
        disc
      );
      runningTotal += totalAmount;
      return {
        invoiceId: master.invoiceId,
        productId: Number(item.productId),
        rate: rateNum.toFixed(2),
        unit: item.unit,
        quantity: qty,
        discount: disc.toFixed(2),
        netAmount: netAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      };
    });
    await db.insert(invoiceDetail).values(detailRows);
    await db
      .update(invoiceMaster)
      .set({ totalAmount: runningTotal.toFixed(2) })
      .where(eq(invoiceMaster.invoiceId, master.invoiceId));
    res.json({
      message: 'Invoice created',
      invoiceId: master.invoiceId
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      error: (error as Error).message || 'Internal Server Error'
    } as any);
  }
};
