import { User } from "@/types";

export const USERS: User[] = [
  { username: "admin",  password: "admin123", country: "IT", fullName: "Amministratore", role: "admin" },
  { username: "mario",  password: "1234",     country: "IT", fullName: "Mario Rossi",    role: "user" },
  { username: "jean",   password: "1234",     country: "FR", fullName: "Jean Dupont",    role: "user" },
  { username: "hans",   password: "1234",     country: "DE", fullName: "Hans Müller",    role: "user" },
];
