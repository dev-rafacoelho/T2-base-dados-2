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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-800">
            <tr>
              {columnKeys.map((key) => (
                <th
                  key={`header-${key}`}
                  className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {cards.map((card, rowIndex) => (
              <tr
                key={card.id ?? `row-${rowIndex}`}
                className="hover:bg-slate-50"
              >
                {columnKeys.map((key, colIndex) => (
                  <td
                    key={`${card.id}-${key}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                  >
                    {card[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
