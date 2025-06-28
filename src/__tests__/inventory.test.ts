import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from '../index';

describe('inventory query', () => {
  it('returns the list of products with their inventory', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const response = await testServer.executeOperation({
      query: `
        query GetInventory {
          inventory {
            id
            name
            inventory
          }
        }
      `,
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.inventory).toEqual([
        { id: '1', name: 'Ceramic Mug', inventory: 10 },
        { id: '2', name: 'Ceramic Bowl', inventory: 5 },
        { id: '3', name: 'Ceramic Plate', inventory: 0 },
      ]);
    }
  });
});
