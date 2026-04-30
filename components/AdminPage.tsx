"use client";

import { useState } from "react";
import { User, PriceList, Country, MarkupTier, Product } from "@/types";
import { euroFormat } from "@/lib/pricing";

type Tab = "users" | "pricelists";
const COUNTRIES: Country[] = ["IT", "FR", "DE"];

const COUNTRY_NAMES: Record<Country, string> = { IT: "Italia 🇮🇹", FR: "Francia 🇫🇷", DE: "Germania 🇩🇪" };

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── User form modal ────────────────────────────────────────────────────────

type UserFormProps = {
  initial?: User;
  onSave: (u: User) => void;
  onClose: () => void;
};

function UserForm({ initial, onSave, onClose }: UserFormProps) {
  const [form, setForm] = useState<User>(
    initial ?? { username: "", password: "", country: "IT", fullName: "", role: "user" }
  );
  const [error, setError] = useState("");

  function set<K extends keyof User>(key: K, val: User[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSave() {
    if (!form.username.trim()) { setError("Username obbligatorio"); return; }
    if (!form.password.trim()) { setError("Password obbligatoria"); return; }
    if (!form.fullName.trim()) { setError("Nome completo obbligatorio"); return; }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-5">
          {initial ? "Modifica utente" : "Nuovo utente"}
        </h3>
        <div className="space-y-4">
          <Field label="Nome completo">
            <input className={inputCls} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </Field>
          <Field label="Username">
            <input className={inputCls} value={form.username} onChange={(e) => set("username", e.target.value.toLowerCase().trim())} disabled={!!initial} />
          </Field>
          <Field label="Password">
            <input className={inputCls} type="text" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Paese">
              <select className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value as Country)}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Ruolo">
              <select className={inputCls} value={form.role} onChange={(e) => set("role", e.target.value as User["role"])}>
                <option value="user">Utente</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onClose} className={btnSecondary}>Annulla</button>
          <button onClick={handleSave} className={btnPrimary}>Salva</button>
        </div>
      </div>
    </div>
  );
}

// ─── Users tab ───────────────────────────────────────────────────────────────

type UsersTabProps = { users: User[]; onSave: (users: User[]) => void };

function UsersTab({ users, onSave }: UsersTabProps) {
  const [editing, setEditing] = useState<User | null>(null);
  const [adding, setAdding] = useState(false);

  function handleSave(u: User) {
    if (editing) {
      onSave(users.map((x) => (x.username === u.username ? u : x)));
    } else {
      if (users.find((x) => x.username === u.username)) return;
      onSave([...users, u]);
    }
    setEditing(null);
    setAdding(false);
  }

  function handleDelete(username: string) {
    if (username === "admin") return;
    onSave(users.filter((u) => u.username !== username));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{users.length} utenti configurati</p>
        <button onClick={() => setAdding(true)} className={btnPrimary}>
          + Nuovo utente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Password</th>
              <th className="px-4 py-3 text-center">Paese</th>
              <th className="px-4 py-3 text-center">Ruolo</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.username} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{u.fullName}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{u.username}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{u.password}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">{u.country}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"}`}>
                    {u.role === "admin" ? "Admin" : "Utente"}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing(u)} className="text-slate-400 hover:text-teal-700 transition-colors" title="Modifica">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  {u.username !== "admin" && (
                    <button onClick={() => handleDelete(u.username)} className="text-slate-400 hover:text-red-500 transition-colors" title="Elimina">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <UserForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setEditing(null); setAdding(false); }}
        />
      )}
    </div>
  );
}

// ─── Price lists tab ─────────────────────────────────────────────────────────

type PriceListsTabProps = { priceLists: PriceList[]; onSave: (pl: PriceList[]) => void };

function PriceListsTab({ priceLists, onSave }: PriceListsTabProps) {
  const [country, setCountry] = useState<Country>("IT");
  const pl = priceLists.find((p) => p.country === country)!;

  function updatePl(updated: PriceList) {
    onSave(priceLists.map((p) => (p.country === country ? updated : p)));
  }

  // Products
  function updateProduct(idx: number, field: keyof Product, value: string | number) {
    const products = pl.products.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    updatePl({ ...pl, products });
  }

  function addProduct() {
    updatePl({ ...pl, products: [...pl.products, { codice: `${country}-${generateId().slice(0,3).toUpperCase()}`, descrizione: "", unitaMisura: "pz", costoBase: 0 }] });
  }

  function removeProduct(idx: number) {
    updatePl({ ...pl, products: pl.products.filter((_, i) => i !== idx) });
  }

  // Markup tiers
  function updateTier(idx: number, field: keyof MarkupTier, value: number | null) {
    const markupTiers = pl.markupTiers.map((t, i) => i === idx ? { ...t, [field]: value } : t);
    updatePl({ ...pl, markupTiers });
  }

  return (
    <div className="space-y-8">
      {/* Country selector */}
      <div className="flex gap-2">
        {COUNTRIES.map((c) => (
          <button key={c} onClick={() => setCountry(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${country === c ? "bg-teal-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-teal-500"}`}>
            {COUNTRY_NAMES[c]}
          </button>
        ))}
      </div>

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700">Listino prodotti — {country}</h3>
          <button onClick={addProduct} className={btnPrimary}>+ Prodotto</button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 text-left">Codice</th>
                <th className="px-3 py-3 text-left">Descrizione</th>
                <th className="px-3 py-3 text-center">UM</th>
                <th className="px-3 py-3 text-right">Costo base (€)</th>
                <th className="px-3 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {pl.products.map((p, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2">
                    <input className={inlineInput} value={p.codice} onChange={(e) => updateProduct(i, "codice", e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className={`${inlineInput} w-full`} value={p.descrizione} onChange={(e) => updateProduct(i, "descrizione", e.target.value)} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input className={`${inlineInput} w-14 text-center`} value={p.unitaMisura} onChange={(e) => updateProduct(i, "unitaMisura", e.target.value)} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input type="number" step="0.01" className={`${inlineInput} w-24 text-right`} value={p.costoBase} onChange={(e) => updateProduct(i, "costoBase", parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => removeProduct(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Markup tiers */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-3">Scaglioni markup — {country}</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-left">Scaglione</th>
                <th className="px-4 py-3 text-right">Qtà minima</th>
                <th className="px-4 py-3 text-right">Qtà massima</th>
                <th className="px-4 py-3 text-right">Markup %</th>
              </tr>
            </thead>
            <tbody>
              {pl.markupTiers.map((t, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 text-slate-500 text-xs">
                    Scaglione {i + 1}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input type="number" min={1} className={`${inlineInput} w-20 text-right`} value={t.minQty} onChange={(e) => updateTier(i, "minQty", parseInt(e.target.value) || 1)} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {t.maxQty === null ? (
                      <span className="text-slate-400 text-xs italic">nessun limite</span>
                    ) : (
                      <input type="number" min={1} className={`${inlineInput} w-20 text-right`} value={t.maxQty} onChange={(e) => updateTier(i, "maxQty", parseInt(e.target.value) || null)} />
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input type="number" min={0} max={200} className={`${inlineInput} w-20 text-right`} value={t.markupPercent} onChange={(e) => updateTier(i, "markupPercent", parseFloat(e.target.value) || 0)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">Le modifiche vengono salvate automaticamente nel browser.</p>
      </div>
    </div>
  );
}

// ─── Admin page root ──────────────────────────────────────────────────────────

type Props = {
  currentUser: User;
  users: User[];
  priceLists: PriceList[];
  onSaveUsers: (users: User[]) => void;
  onSavePriceLists: (pl: PriceList[]) => void;
  onLogout: () => void;
  onReset: () => void;
};

export default function AdminPage({ currentUser, users, priceLists, onSaveUsers, onSavePriceLists, onLogout, onReset }: Props) {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-amber-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-bold text-lg tracking-tight">Pannello Amministrazione</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-80">{currentUser.fullName}</span>
            <button onClick={onReset} className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium" title="Ripristina dati predefiniti">
              Reset dati
            </button>
            <button onClick={onLogout} className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium">
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex gap-1 mb-6 border-b border-slate-200">
          {([["users", "Utenti"], ["pricelists", "Listini & Markup"]] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === key ? "border-amber-600 text-amber-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "users" && <UsersTab users={users} onSave={onSaveUsers} />}
        {tab === "pricelists" && <PriceListsTab priceLists={priceLists} onSave={onSavePriceLists} />}
      </main>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent";
const inlineInput = "border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500";
const btnPrimary = "bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors";
const btnSecondary = "border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors";
