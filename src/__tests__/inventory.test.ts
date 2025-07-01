import { resolvers } from '../resolvers';

// Mock the stripe module
jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: {
      create: jest.fn(() =>
        Promise.resolve({
          id: 'pi_test_123',
          client_secret: 'client_secret_test_123',
        }),
      ),
    },
  }));
});

describe('Query.inventory', () => {
  it('returns the list of products with their inventory, image, and price', () => {
    const products = resolvers.Query.inventory();
    expect(products).toEqual([
      { id: '1', name: 'Ceramic Mug', inventory: 10, image: 'https://placehold.co/600x400', price: 25 },
      { id: '2', name: 'Ceramic Bowl', inventory: 5, image: 'https://placehold.co/600x400', price: 35 },
      { id: '3', name: 'Ceramic Plate', inventory: 0, image: 'https://placehold.co/600x400', price: 45 },
    ]);
  });
});

describe('Query.productsByIds', () => {
  it('returns products filtered by their IDs', () => {
    const idsToFetch = ['1', '3'];
    const filteredProducts = resolvers.Query.productsByIds(null, { ids: idsToFetch });
    expect(filteredProducts).toEqual([
      { id: '1', name: 'Ceramic Mug', inventory: 10, image: 'https://placehold.co/600x400', price: 25 },
      { id: '3', name: 'Ceramic Plate', inventory: 0, image: 'https://placehold.co/600x400', price: 45 },
    ]);
  });
});

describe('Mutation.createPaymentIntent', () => {
  it('creates a payment intent with the correct amount and currency', async () => {
    const items = [
      { id: '1', quantity: 2 },
      { id: '2', quantity: 1 },
    ];
    const shipping = 'delivery';

    const result = await resolvers.Mutation.createPaymentIntent(null, { items, shipping });

    expect(result).toEqual({
      id: 'pi_test_123',
      clientSecret: 'client_secret_test_123',
    });
  });

  it('calculates the correct amount for pickup shipping', async () => {
    const items = [
      { id: '1', quantity: 1 },
      { id: '3', quantity: 1 },
    ];
    const shipping = 'pickup';

    const result = await resolvers.Mutation.createPaymentIntent(null, { items, shipping });

    expect(result).toEqual({
      id: 'pi_test_123',
      clientSecret: 'client_secret_test_123',
    });
  });
});
