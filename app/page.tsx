"use client";

import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import ConfiguratorPage from "@/components/ConfiguratorPage";
import AdminPage from "@/components/AdminPage";
import { User } from "@/types";
import { useAppData } from "@/lib/useAppData";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const { data, ready, saveUsers, savePriceLists, resetToDefaults } = useAppData();

  if (!ready) return null;

  if (!user) {
    return <LoginPage users={data.users} onLogin={setUser} />;
  }

  if (user.role === "admin") {
    return (
      <AdminPage
        currentUser={user}
        users={data.users}
        priceLists={data.priceLists}
        onSaveUsers={saveUsers}
        onSavePriceLists={savePriceLists}
        onLogout={() => setUser(null)}
        onReset={() => { resetToDefaults(); setUser(null); }}
      />
    );
  }

  const priceList = data.priceLists.find((pl) => pl.country === user.country);
  if (!priceList) return <LoginPage users={data.users} onLogin={setUser} />;

  return (
    <ConfiguratorPage
      user={user}
      priceList={priceList}
      onLogout={() => setUser(null)}
    />
  );
}
