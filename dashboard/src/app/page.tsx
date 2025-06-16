"use client";

import { useState, useEffect } from "react";
import CardTable from "@/components/CardTable";
import DynamicChartsContainer from "@/components/DynamicChartsContainer";

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

export default function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("charts");
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 50,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cartoes: [],
    clubes: [],
    posicoes: [],
    rodadas: [],
  });

  const fetchCards = async (
    page: number = 1,
    limit: number = 50,
    filters: Record<string, string> = {}
  ) => {
    try {
      setLoading(true);

      // Construir URL com parâmetros
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== "")
        ),
      });

      const response = await fetch(`/api/cards?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setCards(data.cards);
      setPagination(data.pagination);

      // Só atualizar filterOptions se não houver filtros aplicados
      if (data.filterOptions && Object.keys(filters).length === 0) {
        setFilterOptions(data.filterOptions);
      }

      setError("");
    } catch (err) {
      setError("Error loading data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchCards(newPage, pagination.limit);
  };

  const handleLimitChange = (newLimit: number) => {
    fetchCards(1, newLimit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6 shadow-2xl">
            <span className="text-3xl">⚽</span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Dashboard de Cartões
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Análise completa e interativa dos dados de disciplina do campeonato
            brasileiro
          </p>
        </div>

        {/* Navegação por Abas */}
        <div className="mb-10">
          <nav className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex space-x-2">
              <button
                onClick={() => setActiveTab("charts")}
                className={`py-4 px-8 text-base font-semibold rounded-xl transition-all duration-300 transform ${
                  activeTab === "charts"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-102"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  Gráficos e Estatísticas
                </span>
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`py-4 px-8 text-base font-semibold rounded-xl transition-all duration-300 transform ${
                  activeTab === "table"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-102"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">📋</span>
                  Dados Tabulares
                </span>
              </button>
            </div>
          </nav>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === "charts" && <DynamicChartsContainer />}

        {activeTab === "table" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-transparent"></div>
              </div>
            ) : (
              <CardTable
                cards={cards}
                pagination={pagination}
                filterOptions={filterOptions}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onFilterChange={fetchCards}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
