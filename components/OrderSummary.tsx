"use client";

import { User, OrderLine } from "@/types";
import { euroFormat } from "@/lib/pricing";

type Props = {
  user: User;
  lines: OrderLine[];
  total: number;
  date: string;
  onBack: () => void;
};

function countryName(country: string) {
  const names: Record<string, string> = { IT: "Italia", FR: "Francia", DE: "Germania" };
  return names[country] ?? country;
}

export default function OrderSummary({ user, lines, total, date, onBack }: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar — hidden in print */}
      <div className="no-print bg-slate-800 text-white px-6 py-3 flex items-center gap-4 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna all&apos;ordine
        </button>
        <div className="flex-1" />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Stampa / PDF
        </button>
      </div>

      {/* Document */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Intestazione */}
        <div className="flex items-start justify-between mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Riepilogo Ordine</h1>
            <div className="mt-2 space-y-0.5 text-sm text-slate-600">
              <p><span className="font-medium">Cliente:</span> {user.fullName}</p>
              <p><span className="font-medium">Paese:</span> {countryName(user.country)} ({user.country})</p>
              <p><span className="font-medium">Data:</span> {date}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-teal-800">{euroFormat.format(total)}</div>
            <div className="text-sm text-slate-500 mt-1">Totale ordine</div>
          </div>
        </div>

        {/* Tabella ordine */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-300 text-slate-600 text-xs uppercase tracking-wide">
              <th className="py-2 text-left w-6">#</th>
              <th className="py-2 text-left">Codice</th>
              <th className="py-2 text-left">Descrizione</th>
              <th className="py-2 text-center">UM</th>
              <th className="py-2 text-right">Qtà</th>
              <th className="py-2 text-right">Costo base</th>
              <th className="py-2 text-right">Markup %</th>
              <th className="py-2 text-right">Pr. vendita</th>
              <th className="py-2 text-right">Totale riga</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={line.id} className="border-b border-slate-100">
                <td className="py-2.5 text-slate-400 text-xs">{idx + 1}</td>
                <td className="py-2.5 font-mono text-xs text-slate-600">{line.product.codice}</td>
                <td className="py-2.5 text-slate-800">{line.product.descrizione}</td>
                <td className="py-2.5 text-center text-slate-500">{line.product.unitaMisura}</td>
                <td className="py-2.5 text-right font-mono">{line.quantity}</td>
                <td className="py-2.5 text-right font-mono text-slate-600">
                  {euroFormat.format(line.product.costoBase)}
                </td>
                <td className="py-2.5 text-right">
                  <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {line.markupPercent}%
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono">{euroFormat.format(line.sellPrice)}</td>
                <td className="py-2.5 text-right font-mono font-semibold text-slate-900">
                  {euroFormat.format(line.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300">
              <td colSpan={8} className="py-3 text-right font-semibold text-slate-700">
                Totale ordine
              </td>
              <td className="py-3 text-right font-mono font-bold text-xl text-teal-800">
                {euroFormat.format(total)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="text-xs text-slate-400 mt-8 text-center">
          Documento generato il {date} — Configuratore Prodotto B2B
        </p>
      </div>
    </div>
  );
}
