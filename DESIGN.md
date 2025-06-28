# Store Backend Design

## Overview

The store backend is a GraphQL server that provides an API for managing the ceramics shop's inventory. It is built with Node.js, TypeScript, and Apollo Server.

## Schema

The GraphQL schema defines the data that can be queried from the server. The current schema includes a `Product` type with the following fields:

*   `id`: The product's unique ID.
*   `name`: The product's name.
*   `inventory`: The number of items in stock.

The schema also includes a `Query` type with a single field:

*   `inventory`: Returns a list of all products in the inventory.

## Resolvers

The resolvers are responsible for fetching the data for the schema fields. The `inventory` resolver returns a hardcoded list of products.
