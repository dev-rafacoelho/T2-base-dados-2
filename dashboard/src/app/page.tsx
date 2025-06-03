"use client";

import { useState, useEffect } from "react";
import CardTable from "@/components/CardTable";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cards");
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setCards(data.cards);
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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Dashboard de Cartões
        </h1>

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-transparent"></div>
          </div>
        ) : (
          <CardTable cards={cards} />
        )}
      </div>
    </div>
  );
}
