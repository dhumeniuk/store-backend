import Stripe from 'stripe';
import { Database } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

interface Product {
  id: string;
  name: string;
  inventory: number;
  image: string;
  price: number;
}

export const resolvers = {
  Query: {
    inventory: async (parent: any, args: any, context: { db: Database }) => {
      return await context.db.all<Product[]>('SELECT * FROM products');
    },
    productsByIds: async (parent: any, { ids }: { ids: string[] }, context: { db: Database }) => {
      const placeholders = ids.map(() => '?').join(',');
      return await context.db.all<Product[]>(`SELECT * FROM products WHERE id IN (${placeholders})`, ...ids);
    },
  },
  Mutation: {
    createPaymentIntent: async (parent: any, { items, shipping }: { items: { id: string, quantity: number }[], shipping: string }, context: { db: Database }) => {
      let subtotal = 0;
      const productUpdates = [];

      for (const item of items) {
        const product = await context.db.get<Product>('SELECT * FROM products WHERE id = ?', item.id);
        if (product) {
          if (product.inventory < item.quantity) {
            throw new Error(`Not enough ${product.name} in stock.`);
          }
          subtotal += product.price * item.quantity;
          productUpdates.push({ id: item.id, newInventory: product.inventory - item.quantity });
        } else {
          throw new Error(`Product with ID ${item.id} not found.`);
        }
      }

      const shippingFee = shipping === 'delivery' ? 20 : 0;
      const totalAmount = subtotal + shippingFee;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount * 100, // Stripe expects amount in cents
          currency: 'usd',
        });

        // Decrement inventory only after successful payment intent creation
        for (const update of productUpdates) {
          await context.db.run('UPDATE products SET inventory = ? WHERE id = ?', update.newInventory, update.id);
        }

        return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id };
      } catch (error: any) {
        console.error("Error creating payment intent:", error);
        throw new Error("Unable to create payment intent.");
      }
    },
  },
};