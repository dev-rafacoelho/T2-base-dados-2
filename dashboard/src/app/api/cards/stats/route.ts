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

    // Estatística 1: Distribuição de cartões por tipo
    const [cardsByType] = await connection.execute(`
      SELECT cartao, COUNT(*) as count 
      FROM cartoes 
      GROUP BY cartao
    `);

    // Estatística 2: Top 10 clubes com mais cartões
    const [cardsByClub] = await connection.execute(`
      SELECT clube, COUNT(*) as count 
      FROM cartoes 
      GROUP BY clube 
      ORDER BY count DESC 
      LIMIT 10
    `);

    // Estatística 3: Cartões por posição
    const [cardsByPosition] = await connection.execute(`
      SELECT posicao, COUNT(*) as count 
      FROM cartoes 
      GROUP BY posicao 
      ORDER BY count DESC
    `);

    // Estatística 4: Distribuição de cartões por períodos de tempo (intervalos de 15 minutos)
    const [cardsByTime] = await connection.execute(`
      SELECT 
        CASE 
          WHEN CAST(minuto AS UNSIGNED) BETWEEN 0 AND 15 THEN '0-15min'
          WHEN CAST(minuto AS UNSIGNED) BETWEEN 16 AND 30 THEN '16-30min'
          WHEN CAST(minuto AS UNSIGNED) BETWEEN 31 AND 45 THEN '31-45min'
          WHEN CAST(minuto AS UNSIGNED) BETWEEN 46 AND 60 THEN '46-60min'
          WHEN CAST(minuto AS UNSIGNED) BETWEEN 61 AND 75 THEN '61-75min'
          WHEN CAST(minuto AS UNSIGNED) BETWEEN 76 AND 90 THEN '76-90min'
          WHEN CAST(minuto AS UNSIGNED) > 90 THEN '90+min'
          ELSE 'Outros'
        END as periodo,
        COUNT(*) as count
      FROM cartoes 
      WHERE minuto REGEXP '^[0-9]+$'
      GROUP BY periodo
      ORDER BY 
        CASE 
          WHEN periodo = '0-15min' THEN 1
          WHEN periodo = '16-30min' THEN 2
          WHEN periodo = '31-45min' THEN 3
          WHEN periodo = '46-60min' THEN 4
          WHEN periodo = '61-75min' THEN 5
          WHEN periodo = '76-90min' THEN 6
          WHEN periodo = '90+min' THEN 7
          ELSE 8
        END
    `);

    // Estatística 5: Cartões por rodada (top 10 rodadas com mais cartões)
    const [cardsByRound] = await connection.execute(`
      SELECT rodata, COUNT(*) as count 
      FROM cartoes 
      GROUP BY rodata 
      ORDER BY count DESC 
      LIMIT 15
    `);

    // Estatística 6: Proporção de cartões por tipo e posição
    const [cardsTypeByPosition] = await connection.execute(`
      SELECT posicao, cartao, COUNT(*) as count 
      FROM cartoes 
      GROUP BY posicao, cartao 
      ORDER BY posicao, cartao
    `);

    // Estatística 7: Jogador que mais tomou cartão
    const [topPlayer] = await connection.execute(`
      SELECT atleta, COUNT(*) as count,
             SUM(CASE WHEN cartao = 'Amarelo' THEN 1 ELSE 0 END) as amarelos,
             SUM(CASE WHEN cartao = 'Vermelho' THEN 1 ELSE 0 END) as vermelhos
      FROM cartoes 
      GROUP BY atleta 
      ORDER BY count DESC 
      LIMIT 1
    `);

    // Estatística 8: Total de jogadores únicos
    const [totalPlayers] = await connection.execute(`
      SELECT COUNT(DISTINCT atleta) as total_players
      FROM cartoes
    `);

    // Estatística 9: Média de cartões por partida
    const [avgCardsPerMatch] = await connection.execute(`
      SELECT AVG(cards_per_match) as avg_cards
      FROM (
        SELECT partida_id, COUNT(*) as cards_per_match
        FROM cartoes
        GROUP BY partida_id
      ) as subquery
    `);

    return NextResponse.json({ 
      cardsByType,
      cardsByClub,
      cardsByPosition,
      cardsByTime,
      cardsByRound,
      cardsTypeByPosition,
      topPlayer: topPlayer[0] || null,
      totalPlayers: totalPlayers[0]?.total_players || 0,
      avgCardsPerMatch: Math.round((avgCardsPerMatch[0]?.avg_cards || 0) * 100) / 100
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