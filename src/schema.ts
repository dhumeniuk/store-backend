export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    inventory: Int!
    image: String!
    price: Int!
  }

  type Query {
    inventory: [Product]
    productsByIds(ids: [ID!]!): [Product]
  }
`;