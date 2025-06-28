import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    inventory: Int!
  }

  type Query {
    inventory: [Product]
  }
`;

const products = [
  { id: '1', name: 'Ceramic Mug', inventory: 10 },
  { id: '2', name: 'Ceramic Bowl', inventory: 5 },
  { id: '3', name: 'Ceramic Plate', inventory: 0 },
];

// Resolvers define how to fetch the types defined in your schema.
export const resolvers = {
  Query: {
    inventory: () => products,
  },
};

interface MyContext {
  token?: String;
}

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  const PORT = process.env.PORT || 4000;

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer();
