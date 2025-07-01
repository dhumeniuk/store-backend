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
};