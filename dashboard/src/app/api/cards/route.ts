import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const limit = Math.max(1, Math.min(500, parseInt(searchParams.get('limit') || '50') || 50));
    const offset = (page - 1) * limit;

    // Filtros
    const cartao = searchParams.get('cartao');
    const clube = searchParams.get('clube');
    const posicao = searchParams.get('posicao');
    const atleta = searchParams.get('atleta');
    const minutoMin = searchParams.get('minutoMin');
    const minutoMax = searchParams.get('minutoMax');
    const rodata = searchParams.get('rodata');

    connection = await mysql.createConnection({
      host: 'easypanel.rafaelcoelho.shop',
      port: 3307,
      user: 'mysql',
      password: 'b0a0b7fe2d93e4e5c1b6',
      database: 'projeto_wellynton',
      connectTimeout: 10000,
    });

    await connection.ping();

    // Construir WHERE clause baseado nos filtros
    const whereConditions: string[] = [];
    const queryParams: (string | number)[] = [];

    if (cartao) {
      whereConditions.push('cartao = ?');
      queryParams.push(cartao);
    }
    if (clube) {
      whereConditions.push('clube LIKE ?');
      queryParams.push(`%${clube}%`);
    }
    if (posicao) {
      whereConditions.push('posicao = ?');
      queryParams.push(posicao);
    }
    if (atleta) {
      whereConditions.push('atleta LIKE ?');
      queryParams.push(`%${atleta}%`);
    }
    if (minutoMin) {
      whereConditions.push('minuto >= ?');
      queryParams.push(parseInt(minutoMin));
    }
    if (minutoMax) {
      whereConditions.push('minuto <= ?');
      queryParams.push(parseInt(minutoMax));
    }
    if (rodata) {
      whereConditions.push('rodata = ?');
      queryParams.push(parseInt(rodata));
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Garantir que limit e offset são números válidos
    const safeLimit = Math.max(1, Math.min(500, limit)); // Entre 1 e 500
    const safeOffset = Math.max(0, offset);

    // Contar total de registros (para paginação)
    const countQuery = `SELECT COUNT(*) as total FROM cartoes ${whereClause}`;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const totalRecords = (countResult as { total: number }[])[0].total;

    // Buscar registros com paginação - usando interpolação segura para LIMIT/OFFSET
    const dataQuery = `SELECT * FROM cartoes ${whereClause} ORDER BY partida_id DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    const [cards] = await connection.execute(dataQuery, queryParams);

    // Buscar dados únicos para filtros (apenas se não houver filtros aplicados)
    let filterOptions = {};
    if (whereConditions.length === 0) {
      const [cartoes] = await connection.execute('SELECT DISTINCT cartao FROM cartoes WHERE cartao IS NOT NULL ORDER BY cartao');
      const [clubes] = await connection.execute('SELECT DISTINCT clube FROM cartoes WHERE clube IS NOT NULL ORDER BY clube');
      const [posicoes] = await connection.execute('SELECT DISTINCT posicao FROM cartoes WHERE posicao IS NOT NULL ORDER BY posicao');
      const [rodadas] = await connection.execute('SELECT DISTINCT rodata FROM cartoes WHERE rodata IS NOT NULL ORDER BY rodata');

      filterOptions = {
        cartoes: (cartoes as { cartao: string }[]).map(row => row.cartao),
        clubes: (clubes as { clube: string }[]).map(row => row.clube),
        posicoes: (posicoes as { posicao: string }[]).map(row => row.posicao),
        rodadas: (rodadas as { rodata: number }[]).map(row => row.rodata)
      };
    }

    const totalPages = Math.ceil(totalRecords / safeLimit);

    return NextResponse.json({ 
      cards,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit: safeLimit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      filterOptions
    });
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