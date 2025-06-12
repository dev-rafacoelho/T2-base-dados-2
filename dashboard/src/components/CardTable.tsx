import { useState } from "react";

interface Card {
  id: number;
  // Add other fields based on your database schema
  [key: string]: any;
}

interface CardTableProps {
  cards: Card[];
}

export default function CardTable({ cards }: CardTableProps) {
  if (!cards.length) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 p-4 text-center text-slate-700">
        No data available
      </div>
    );
  }

  const columnKeys = Object.keys(cards[0]).filter((key) => key !== "id");

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header da Tabela */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">📋 Dados Detalhados dos Cartões</h2>
        <p className="text-slate-300">Últimos 50 registros do banco de dados</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800">
            <tr>
              {columnKeys.map((key) => (
                <th
                  key={`header-${key}`}
                  className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
                >
                  {key === 'cartao' && '🃏 '}
                  {key === 'atleta' && '👤 '}
                  {key === 'clube' && '🏟️ '}
                  {key === 'posicao' && '📍 '}
                  {key === 'minuto' && '⏱️ '}
                  {key === 'rodata' && '🔄 '}
                  {key === 'partida_id' && '🎯 '}
                  {key === 'num_camisa' && '👕 '}
                  {key.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {cards.map((card, rowIndex) => (
              <tr
                key={card.id ?? `row-${rowIndex}`}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              >
                {columnKeys.map((key, colIndex) => (
                  <td
                    key={`${card.id}-${key}-${colIndex}`}
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      key === 'cartao' 
                        ? card[key] === 'Amarelo' 
                          ? 'text-yellow-600 bg-yellow-50' 
                          : 'text-red-600 bg-red-50'
                        : 'text-slate-700'
                    }`}
                  >
                    {key === 'cartao' && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        card[key] === 'Amarelo' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {card[key] === 'Amarelo' ? '🟨' : '🟥'} {card[key]}
                      </span>
                    )}
                    {key !== 'cartao' && card[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer da Tabela */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-600 text-center">
          Mostrando {cards.length} registros • Dados atualizados em tempo real
        </p>
      </div>
    </div>
  );
}
