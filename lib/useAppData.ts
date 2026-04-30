"use client";

import { useState, useEffect, useCallback } from "react";
import { AppData, User, PriceList } from "@/types";
import { USERS } from "@/data/users";
import { PRICE_LISTS } from "@/data/pricelists";

const STORAGE_KEY = "configuratore_app_data";

function loadFromStorage(): AppData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useAppData() {
  const [data, setData] = useState<AppData>({ users: USERS, priceLists: PRICE_LISTS });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) setData(stored);
    setReady(true);
  }, []);

  const update = useCallback((next: AppData) => {
    setData(next);
    saveToStorage(next);
  }, []);

  const saveUsers = useCallback((users: User[]) => {
    setData((prev) => {
      const next = { ...prev, users };
      saveToStorage(next);
      return next;
    });
  }, []);

  const savePriceLists = useCallback((priceLists: PriceList[]) => {
    setData((prev) => {
      const next = { ...prev, priceLists };
      saveToStorage(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults: AppData = { users: USERS, priceLists: PRICE_LISTS };
    localStorage.removeItem(STORAGE_KEY);
    setData(defaults);
  }, []);

  return { data, ready, saveUsers, savePriceLists, resetToDefaults };
}
