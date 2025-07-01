const products = [
  { id: '1', name: 'Ceramic Mug', inventory: 10, image: 'https://placehold.co/600x400', price: 25 },
  { id: '2', name: 'Ceramic Bowl', inventory: 5, image: 'https://placehold.co/600x400', price: 35 },
  { id: '3', name: 'Ceramic Plate', inventory: 0, image: 'https://placehold.co/600x400', price: 45 },
];

import Stripe from 'stripe';

const stripe = new Stripe('sk_test_YOUR_STRIPE_SECRET_KEY', { // Replace with your actual Stripe secret key
  apiVersion: '2020-08-27',
});

const products = [
  { id: '1', name: 'Ceramic Mug', inventory: 10, image: 'https://placehold.co/600x400', price: 25 },
  { id: '2', name: 'Ceramic Bowl', inventory: 5, image: 'https://placehold.co/600x400', price: 35 },
  { id: '3', name: 'Ceramic Plate', inventory: 0, image: 'https://placehold.co/600x400', price: 45 },
];

export const resolvers = {
  Query: {
    inventory: () => products,
    productsByIds: (parent: any, { ids }: { ids: string[] }) => {
      return products.filter((product) => ids.includes(product.id));
    },
  },
  Mutation: {
    createPaymentIntent: async (parent: any, { items, shipping }: { items: { id: string, quantity: number }[], shipping: string }) => {
      let subtotal = 0;
      for (const item of items) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          subtotal += product.price * item.quantity;
        }
      }
      const shippingFee = shipping === 'delivery' ? 20 : 0;
      const totalAmount = subtotal + shippingFee;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount * 100, // Stripe expects amount in cents
          currency: 'usd',
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
        });
        return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id };
      } catch (error) {
        console.error("Error creating payment intent:", error);
        throw new Error("Unable to create payment intent.");
      }
    },
  },
};