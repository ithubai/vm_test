"use client";

import { useState } from "react";
import { User } from "@/types";

type Props = { users: User[]; onLogin: (user: User) => void };

export default function LoginPage({ users, onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = users.find((u) => u.username === username.trim().toLowerCase() && u.password === password);
    if (user) {
      setError("");
      onLogin(user);
    } else {
      setError("Credenziali non valide. Riprova.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-700 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Configuratore Prodotto</h1>
          <p className="text-slate-500 text-sm mt-1">Accedi con le tue credenziali aziendali</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="es. mario"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
