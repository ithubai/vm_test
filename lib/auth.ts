import { USERS } from "@/data/users";
import { User } from "@/types";

export function authenticate(username: string, password: string): User | null {
  return USERS.find((u) => u.username === username && u.password === password) ?? null;
}
