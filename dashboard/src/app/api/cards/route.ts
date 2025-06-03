import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';

  try {
    const connection = await mysql.createConnection({
      host: 'easypanel.rafaelcoelho.shop',
      port: 3307,
      user: 'mysql',
      password: 'b0a0b7fe2d93e4e5c1b6',
      database: 'projeto_wellynton',
    });

    let query = 'SELECT * FROM cartoes';
    const queryParams: any[] = [];

    if (searchTerm) {
      // Adjust the WHERE clause based on your table structure
      query += ' WHERE id LIKE ? OR column_name LIKE ?';
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    query += ' LIMIT 100'; // Add a reasonable limit

    const [rows] = await connection.execute(query, queryParams);
    await connection.end();

    return NextResponse.json({ cards: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
} 