"use client";

import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import ConfiguratorPage from "@/components/ConfiguratorPage";
import { User } from "@/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <LoginPage onLogin={setUser} />;
  return <ConfiguratorPage user={user} onLogout={() => setUser(null)} />;
}
