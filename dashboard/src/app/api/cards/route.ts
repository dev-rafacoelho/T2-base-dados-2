import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'easypanel.rafaelcoelho.shop',
      port: 3307,
      user: 'mysql',
      password: 'b0a0b7fe2d93e4e5c1b6',
      database: 'projeto_wellynton',
      connectTimeout: 10000,
    });

    await connection.ping();

    const [cards] = await connection.execute('SELECT * FROM cartoes LIMIT 5');

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Database error:', error);
    let errorMessage = 'Erro ao conectar com o banco de dados';
    
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Tempo limite de conexão excedido. Verifique se o banco de dados está acessível.';
      } else if (error.message.includes('ER_ACCESS_DENIED_ERROR')) {
        errorMessage = 'Acesso negado ao banco de dados. Verifique as credenciais.';
      } else if (error.message.includes('ER_BAD_DB_ERROR')) {
        errorMessage = 'Banco de dados não encontrado.';
      } else {
        errorMessage = `Erro: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.error('Erro ao fechar conexão:', error);
      }
    }
  }
} 