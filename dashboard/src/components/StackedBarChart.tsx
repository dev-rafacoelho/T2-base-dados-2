"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StackedBarChartData {
  posicao: string;
  cartao: string;
  count: number;
}

interface StackedBarChartProps {
  title: string;
  data: StackedBarChartData[];
}

export default function StackedBarChart({ title, data }: StackedBarChartProps) {
  // Processar dados para o formato do Chart.js
  const positions = [...new Set(data.map(item => item.posicao))];
  const cardTypes = [...new Set(data.map(item => item.cartao))];
  
  const datasets = cardTypes.map((cardType, index) => {
    const color = cardType === 'Amarelo' ? '#eab308' : '#ef4444';
    return {
      label: cardType,
      data: positions.map(position => {
        const item = data.find(d => d.posicao === position && d.cartao === cardType);
        return item ? item.count : 0;
      }),
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    };
  });

  const chartData = {
    labels: positions,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          color: '#f1f5f9',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          display: true,
          color: '#f1f5f9',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mx-auto"></div>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
} 