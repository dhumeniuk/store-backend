import { resolvers } from '../resolvers';

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
