import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function initializeDatabase() {
  const db = await open({
    filename: './src/database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      inventory INTEGER,
      image TEXT,
      price REAL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      paymentIntentId TEXT UNIQUE,
      totalAmount REAL,
      shipping TEXT,
      status TEXT,
      items TEXT,
      createdAt INTEGER
    );
  `);

  const products = [
    { id: '1', name: 'Ceramic Mug', inventory: 10, image: 'https://placehold.co/600x400', price: 25 },
    { id: '2', name: 'Ceramic Bowl', inventory: 5, image: 'https://placehold.co/600x400', price: 35 },
    { id: '3', name: 'Ceramic Plate', inventory: 0, image: 'https://placehold.co/600x400', price: 45 },
  ];

  for (const product of products) {
    await db.run(
      `INSERT OR IGNORE INTO products (id, name, inventory, image, price) VALUES (?, ?, ?, ?, ?)`, 
      product.id, product.name, product.inventory, product.image, product.price
    );
  }

  return db;
}
