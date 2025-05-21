import { Request, Response } from 'express';
import { AddProductDTO } from 'types/invoice';
import { db } from '../db/index';
import { productMaster } from '../db/schema/schema';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.select().from(productMaster);
    res.json(products);
  } catch (error: unknown) {
    console.error('Error fetching products: ', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const addProduct = async (
  req: Request<{}, {}, AddProductDTO>,
  res: Response
): Promise<void> => {
  try {
    const { productName, rate, unit } = req.body;
    const [newProduct] = await db
      .insert(productMaster)
      .values({
        productName,
        rate: rate.toFixed(2),
        unit
      })
      .returning();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res
      .status(500)
      .json({
        error: (error as Error).message || 'Internal Server Error'
      } as any);
  }
};
