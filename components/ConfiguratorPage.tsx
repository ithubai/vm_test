"use client";

import { useState } from "react";
import { User, OrderLine } from "@/types";
import { getPriceList } from "@/data/pricelists";
import { calcOrderLine, formatTierLabel, getMarkupTier, euroFormat } from "@/lib/pricing";
import OrderSummary from "@/components/OrderSummary";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function countryFlag(country: string) {
  const flags: Record<string, string> = { IT: "🇮🇹", FR: "🇫🇷", DE: "🇩🇪" };
  return flags[country] ?? country;
}

type Props = { user: User; onLogout: () => void };

export default function ConfiguratorPage({ user, onLogout }: Props) {
  const priceList = getPriceList(user.country)!;
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  function flash(id: string) {
    setHighlightedIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setHighlightedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 600);
  }

  function addLine() {
    const first = priceList.products[0];
    const id = generateId();
    setLines((prev) => [...prev, calcOrderLine(first, 1, user.country, id)]);
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateProduct(id: string, codice: string) {
    const product = priceList.products.find((p) => p.codice === codice);
    if (!product) return;
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? calcOrderLine(product, l.quantity, user.country, id) : l
      )
    );
    flash(id);
  }

  function updateQuantity(id: string, qty: number) {
    const safeQty = Math.max(1, isNaN(qty) ? 1 : qty);
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? calcOrderLine(l.product, safeQty, user.country, id) : l
      )
    );
    flash(id);
  }

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (showSummary) {
    return (
      <OrderSummary
        user={user}
        lines={lines}
        total={total}
        date={today}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-800 text-white shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <span className="font-bold text-lg tracking-tight">Configuratore Prodotto</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:block opacity-90">{user.fullName}</span>
            <span className="bg-teal-700 border border-teal-600 px-2.5 py-1 rounded-full font-medium">
              {countryFlag(user.country)} {user.country}
            </span>
            <button
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-4 no-print">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Composizione Ordine</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Listino {user.country} — {today}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addLine}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Aggiungi riga
            </button>
            {lines.length > 0 && (
              <>
                <button
                  onClick={() => setShowSummary(true)}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Riepilogo
                </button>
                <button
                  onClick={() => setLines([])}
                  className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Svuota
                </button>
              </>
            )}
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">Nessuna riga nell&apos;ordine</p>
            <p className="text-sm mt-1">Clicca &quot;Aggiungi riga&quot; per iniziare</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wide">
                    <th className="px-3 py-3 text-left w-8">#</th>
                    <th className="px-3 py-3 text-left">Prodotto</th>
                    <th className="px-3 py-3 text-center w-16">UM</th>
                    <th className="px-3 py-3 text-center w-24">Qtà</th>
                    <th className="px-3 py-3 text-right">Costo base</th>
                    <th className="px-3 py-3 text-center">Scaglione / Markup</th>
                    <th className="px-3 py-3 text-right">Prezzo vendita</th>
                    <th className="px-3 py-3 text-right">Totale riga</th>
                    <th className="px-3 py-3 w-10 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => {
                    const tier = getMarkupTier(user.country, line.quantity);
                    const isFlashing = highlightedIds.has(line.id);
                    return (
                      <tr
                        key={line.id}
                        className={`border-b border-slate-100 last:border-b-0 transition-colors ${
                          isFlashing ? "bg-teal-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-3 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                        <td className="px-3 py-3">
                          <select
                            value={line.product.codice}
                            onChange={(e) => updateProduct(line.id, e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                          >
                            {priceList.products.map((p) => (
                              <option key={p.codice} value={p.codice}>
                                {p.codice} — {p.descrizione}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3 text-center text-slate-500">{line.product.unitaMisura}</td>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="number"
                            min={1}
                            value={line.quantity}
                            onChange={(e) => updateQuantity(line.id, parseInt(e.target.value, 10))}
                            className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                          />
                        </td>
                        <td className="px-3 py-3 text-right text-slate-600 font-mono">
                          {euroFormat.format(line.product.costoBase)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {tier && (
                            <span
                              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                                isFlashing
                                  ? "bg-teal-600 text-white"
                                  : "bg-teal-100 text-teal-800"
                              }`}
                            >
                              {formatTierLabel(tier)}
                            </span>
                          )}
                        </td>
                        <td className={`px-3 py-3 text-right font-mono font-medium transition-colors ${isFlashing ? "text-teal-700" : "text-slate-800"}`}>
                          {euroFormat.format(line.sellPrice)}
                        </td>
                        <td className={`px-3 py-3 text-right font-mono font-semibold transition-colors ${isFlashing ? "text-teal-700" : "text-slate-900"}`}>
                          {euroFormat.format(line.lineTotal)}
                        </td>
                        <td className="px-3 py-3 no-print">
                          <button
                            onClick={() => removeLine(line.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                            title="Rimuovi riga"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan={7} className="px-3 py-3 text-right text-sm font-semibold text-slate-600">
                      Totale ordine
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-lg text-teal-800">
                      {euroFormat.format(total)}
                    </td>
                    <td className="no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
