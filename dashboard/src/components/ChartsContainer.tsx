"use client";

import { useState, useEffect } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import StackedBarChart from "./StackedBarChart";

interface StatsData {
  cardsByType: Array<{ cartao: string; count: number }>;
  cardsByClub: Array<{ clube: string; count: number }>;
  cardsByPosition: Array<{ posicao: string; count: number }>;
  cardsByTime: Array<{ periodo: string; count: number }>;
  cardsByRound: Array<{ rodata: string; count: number }>;
  cardsTypeByPosition: Array<{ posicao: string; cartao: string; count: number }>;
  topPlayer: { atleta: string; count: number; amarelos: number; vermelhos: number } | null;
  totalPlayers: number;
  avgCardsPerMatch: number;
}

export default function ChartsContainer() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cards/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
      setError("");
    } catch (err) {
      setError("Error loading statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-10">
      {/* Hero Stats Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">⚽ Análise Estatística do Campeonato</h2>
          <p className="text-slate-300">Dados completos sobre disciplina e comportamento em campo</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats.cardsByType.find(item => item.cartao === 'Amarelo')?.count || 0}
                </div>
                <div className="text-sm opacity-90 font-medium">Cartões Amarelos</div>
              </div>
              <div className="text-4xl">🟨</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats.cardsByType.find(item => item.cartao === 'Vermelho')?.count || 0}
                </div>
                <div className="text-sm opacity-90 font-medium">Cartões Vermelhos</div>
              </div>
              <div className="text-4xl">🟥</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats.totalPlayers}
                </div>
                <div className="text-sm opacity-90 font-medium">Jogadores Únicos</div>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats.avgCardsPerMatch}
                </div>
                <div className="text-sm opacity-90 font-medium">Média por Partida</div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Top Player Section */}
        {stats.topPlayer && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🏆 Jogador Mais Indisciplinado</h3>
                <p className="text-2xl font-bold">{stats.topPlayer.atleta}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="bg-yellow-500 px-3 py-1 rounded-full">
                    🟨 {stats.topPlayer.amarelos} Amarelos
                  </span>
                  <span className="bg-red-500 px-3 py-1 rounded-full">
                    🟥 {stats.topPlayer.vermelhos} Vermelhos
                  </span>
                  <span className="bg-slate-600 px-3 py-1 rounded-full">
                    📝 {stats.topPlayer.count} Total
                  </span>
                </div>
              </div>
              <div className="text-6xl">⚠️</div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid - Seção 1: Visão Geral */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">📈 Distribuição Geral</h2>
          <p className="text-slate-600">Análise da distribuição de cartões por diferentes categorias</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform hover:scale-[1.02] transition-all duration-200">
            <PieChart
              title="Distribuição de Cartões por Tipo"
              labels={stats.cardsByType.map(item => item.cartao)}
              data={stats.cardsByType.map(item => item.count)}
              colors={['#eab308', '#ef4444']}
            />
          </div>
          
          <div className="transform hover:scale-[1.02] transition-all duration-200">
            <PieChart
              title="Cartões por Posição"
              labels={stats.cardsByPosition.map(item => item.posicao)}
              data={stats.cardsByPosition.map(item => item.count)}
            />
          </div>
        </div>
      </div>

      {/* Charts Grid - Seção 2: Análise por Clube e Tempo */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">🏟️ Análise por Clube e Tempo</h2>
          <p className="text-slate-600">Padrões de comportamento por equipe e momentos do jogo</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform hover:scale-[1.02] transition-all duration-200">
            <BarChart
              title="Top 10 Clubes com Mais Cartões"
              labels={stats.cardsByClub.map(item => item.clube)}
              data={stats.cardsByClub.map(item => item.count)}
              color="#3b82f6"
              horizontal={true}
            />
          </div>
          
          <div className="transform hover:scale-[1.02] transition-all duration-200">
            <BarChart
              title="Distribuição de Cartões por Período do Jogo"
              labels={stats.cardsByTime.map(item => item.periodo)}
              data={stats.cardsByTime.map(item => item.count)}
              color="#22c55e"
            />
          </div>
        </div>
      </div>

      {/* Charts Grid - Seção 3: Tendências e Comparações */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">📊 Tendências e Comparações</h2>
          <p className="text-slate-600">Evolução ao longo do campeonato e análises cruzadas</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform hover:scale-[1.02] transition-all duration-200">
            <LineChart
              title="Cartões por Rodada (Top 15)"
              labels={stats.cardsByRound.map(item => `Rodada ${item.rodata}`)}
              data={stats.cardsByRound.map(item => item.count)}
              color="#8b5cf6"
            />
          </div>
          
          <div className="transform hover:scale-[1.02] transition-all duration-200">
            <StackedBarChart
              title="Cartões por Posição e Tipo"
              data={stats.cardsTypeByPosition}
            />
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
        <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">💡 Insights do Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-2xl mb-2">⚖️</div>
            <h4 className="font-bold text-slate-800 mb-2">Proporção de Cartões</h4>
            <p className="text-sm text-slate-600">
              {stats.cardsByType.find(item => item.cartao === 'Amarelo')?.count > stats.cardsByType.find(item => item.cartao === 'Vermelho')?.count 
                ? "Maior incidência de cartões amarelos indica advertências preventivas efetivas."
                : "Alto número de cartões vermelhos sugere jogos mais intensos."}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-2xl mb-2">⏱️</div>
            <h4 className="font-bold text-slate-800 mb-2">Momento Crítico</h4>
            <p className="text-sm text-slate-600">
              Os períodos com mais cartões revelam momentos de maior tensão durante as partidas.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-bold text-slate-800 mb-2">Disciplina por Posição</h4>
            <p className="text-sm text-slate-600">
              Diferentes posições mostram padrões únicos de comportamento em campo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 