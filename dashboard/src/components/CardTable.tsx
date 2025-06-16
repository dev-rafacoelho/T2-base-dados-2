import { useState, useCallback } from "react";

interface Card {
  id: number;
  cartao?: string;
  atleta?: string;
  clube?: string;
  posicao?: string;
  minuto?: number;
  rodata?: number;
  partida_id?: number;
  num_camisa?: number;
  [key: string]: any;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FilterOptions {
  cartoes: string[];
  clubes: string[];
  posicoes: string[];
  rodadas: number[];
}

interface CardTableProps {
  cards: Card[];
  pagination: PaginationInfo;
  filterOptions: FilterOptions;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onFilterChange: (
    page?: number,
    limit?: number,
    filters?: Record<string, string>
  ) => void;
}

interface Filters {
  cartao: string;
  clube: string;
  posicao: string;
  atleta: string;
  minutoMin: string;
  minutoMax: string;
  rodata: string;
}

export default function CardTable({
  cards,
  pagination,
  filterOptions,
  onPageChange,
  onLimitChange,
  onFilterChange,
}: CardTableProps) {
  const [filters, setFilters] = useState<Filters>({
    cartao: "",
    clube: "",
    posicao: "",
    atleta: "",
    minutoMin: "",
    minutoMax: "",
    rodata: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback(
    (field: keyof Filters, value: string) => {
      const newFilters = { ...filters, [field]: value };
      setFilters(newFilters);

      // Chamar a API com os novos filtros
      const cleanFilters = Object.fromEntries(
        Object.entries(newFilters).filter(([, val]) => val !== "")
      );
      onFilterChange(1, pagination.limit, cleanFilters);
    },
    [filters, pagination.limit, onFilterChange]
  );

  const clearFilters = useCallback(() => {
    const emptyFilters = {
      cartao: "",
      clube: "",
      posicao: "",
      atleta: "",
      minutoMin: "",
      minutoMax: "",
      rodata: "",
    };
    setFilters(emptyFilters);
    onFilterChange(1, pagination.limit, {});
  }, [pagination.limit, onFilterChange]);

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  if (!cards.length && !hasActiveFilters) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 p-4 text-center text-slate-700">
        No data available
      </div>
    );
  }

  const columnKeys =
    cards.length > 0 ? Object.keys(cards[0]).filter((key) => key !== "id") : [];

  // Componente de Paginação
  const PaginationControls = () => {
    const startRecord = (pagination.currentPage - 1) * pagination.limit + 1;
    const endRecord = Math.min(
      pagination.currentPage * pagination.limit,
      pagination.totalRecords
    );

    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      let startPage = Math.max(
        1,
        pagination.currentPage - Math.floor(maxPagesToShow / 2)
      );
      let endPage = Math.min(
        pagination.totalPages,
        startPage + maxPagesToShow - 1
      );

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Informações de registros */}
          <div className="text-sm text-slate-600">
            Mostrando {startRecord} a {endRecord} de{" "}
            {pagination.totalRecords.toLocaleString()} registros
          </div>

          {/* Controles de itens por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Itens por página:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange(parseInt(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          {/* Navegação de páginas */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                pagination.hasPreviousPage
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              ← Anterior
            </button>

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  pageNum === pagination.currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-300"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                pagination.hasNextPage
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Próxima →
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header da Tabela */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              📋 Dados Detalhados dos Cartões
            </h2>
            <p className="text-slate-300">
              {pagination.totalRecords.toLocaleString()} registros encontrados
              {hasActiveFilters && " (filtrados)"}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showFilters
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-slate-800 hover:bg-blue-50"
            }`}
          >
            <span className="text-lg">🔍</span>
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>
        </div>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 border-b border-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {/* Filtro de Tipo de Cartão */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🃏 Tipo de Cartão
              </label>
              <select
                value={filters.cartao}
                onChange={(e) => handleFilterChange("cartao", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {filterOptions.cartoes.map((cartao) => (
                  <option key={cartao} value={cartao}>
                    {cartao}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Clube */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🏟️ Clube
              </label>
              <select
                value={filters.clube}
                onChange={(e) => handleFilterChange("clube", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {filterOptions.clubes.map((clube) => (
                  <option key={clube} value={clube}>
                    {clube}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Posição */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📍 Posição
              </label>
              <select
                value={filters.posicao}
                onChange={(e) => handleFilterChange("posicao", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                {filterOptions.posicoes.map((posicao) => (
                  <option key={posicao} value={posicao}>
                    {posicao}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Rodada */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🔄 Rodada
              </label>
              <select
                value={filters.rodata}
                onChange={(e) => handleFilterChange("rodata", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                {filterOptions.rodadas.map((rodata) => (
                  <option key={rodata} value={rodata.toString()}>
                    Rodada {rodata}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Atleta */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                👤 Atleta
              </label>
              <input
                type="text"
                value={filters.atleta}
                onChange={(e) => handleFilterChange("atleta", e.target.value)}
                placeholder="Nome do atleta..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro de Minuto Mínimo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ⏱️ Minuto Mín.
              </label>
              <input
                type="number"
                value={filters.minutoMin}
                onChange={(e) =>
                  handleFilterChange("minutoMin", e.target.value)
                }
                placeholder="0"
                min="0"
                max="120"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro de Minuto Máximo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ⏱️ Minuto Máx.
              </label>
              <input
                type="number"
                value={filters.minutoMax}
                onChange={(e) =>
                  handleFilterChange("minutoMax", e.target.value)
                }
                placeholder="120"
                min="0"
                max="120"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                hasActiveFilters
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              🗑️ Limpar Filtros
            </button>
            <div
              className={`px-4 py-2 rounded-lg font-medium ${
                hasActiveFilters
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              📊 {pagination.totalRecords.toLocaleString()} resultado(s)
              encontrado(s)
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800">
            <tr>
              {columnKeys.map((key) => (
                <th
                  key={`header-${key}`}
                  className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
                >
                  {key === "cartao" && "🃏 "}
                  {key === "atleta" && "👤 "}
                  {key === "clube" && "🏟️ "}
                  {key === "posicao" && "📍 "}
                  {key === "minuto" && "⏱️ "}
                  {key === "rodata" && "🔄 "}
                  {key === "partida_id" && "🎯 "}
                  {key === "num_camisa" && "👕 "}
                  {key.replace("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {cards.length > 0 ? (
              cards.map((card, rowIndex) => (
                <tr
                  key={card.id ?? `row-${rowIndex}`}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                >
                  {columnKeys.map((key, colIndex) => (
                    <td
                      key={`${card.id}-${key}-${colIndex}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        key === "cartao"
                          ? card[key] === "Amarelo"
                            ? "text-yellow-600 bg-yellow-50"
                            : "text-red-600 bg-red-50"
                          : "text-slate-700"
                      }`}
                    >
                      {key === "cartao" && (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            card[key] === "Amarelo"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {card[key] === "Amarelo" ? "🟨" : "🟥"} {card[key]}
                        </span>
                      )}
                      {key !== "cartao" && card[key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columnKeys.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">🔍</span>
                    <p className="text-lg font-medium text-slate-600">
                      Nenhum resultado encontrado
                    </p>
                    <p className="text-sm text-slate-500">
                      Tente ajustar os filtros para ver mais resultados
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      <PaginationControls />
    </div>
  );
}
