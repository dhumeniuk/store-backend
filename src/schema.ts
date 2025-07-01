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

  input ItemInput {
    id: ID!
    quantity: Int!
  }

  type Mutation {
    createPaymentIntent(items: [ItemInput!]!, shipping: String!): PaymentIntent
  }

  type PaymentIntent {
    id: ID!
    clientSecret: String!
  }
`;