import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  text
} from 'drizzle-orm/pg-core';

export const productMaster = pgTable('Product_Master', {
  productId: serial('Product_ID').primaryKey(),
  productName: text('Product_Name').notNull(),
  rate: numeric('Rate', { precision: 12, scale: 2 }).notNull(),
  unit: text('Unit').notNull()
});

export const invoiceMaster = pgTable('Invoice_Master', {
  invoiceId: serial('Invoice_Id').primaryKey(),
  invoiceNo: integer('Invoice_no').notNull().unique(),
  invoiceDate: date('Invoice_Date').defaultNow().notNull(),
  customerName: text('CustomerName').notNull(),
  totalAmount: numeric('TotalAmount', { precision: 14, scale: 2 })
    .default('0')
    .notNull()
});

export const invoiceDetail = pgTable('Invoice_Detail', {
  invoiceDetailId: serial('InvoiceDetail_id').primaryKey(),
  invoiceId: integer('Invoice_Id')
    .references(() => invoiceMaster.invoiceId, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('Product_Id')
    .references(() => productMaster.productId)
    .notNull(),
  rate: numeric('Rate', { precision: 12, scale: 2 }).notNull(),
  unit: text('Unit').notNull(),
  quantity: integer('Qty').notNull(),
  discount: numeric('Disc_Percentage', { precision: 5, scale: 2 })
    .default('0')
    .notNull(),
  netAmount: numeric('NetAmount', { precision: 14, scale: 2 }).notNull(),
  totalAmount: numeric('TotalAmount', { precision: 16, scale: 2 }).notNull()
});
