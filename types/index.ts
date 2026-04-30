export type Country = "IT" | "FR" | "DE";

export type UserRole = "user" | "admin";

export type User = {
  username: string;
  password: string;
  country: Country;
  fullName: string;
  role: UserRole;
};

export type Product = {
  codice: string;
  descrizione: string;
  unitaMisura: string;
  costoBase: number;
};

export type MarkupTier = {
  minQty: number;
  maxQty: number | null;
  markupPercent: number;
};

export type PriceList = {
  country: Country;
  products: Product[];
  markupTiers: MarkupTier[];
};

export type OrderLine = {
  id: string;
  product: Product;
  quantity: number;
  markupPercent: number;
  sellPrice: number;
  lineTotal: number;
};

export type Order = {
  user: User;
  lines: OrderLine[];
  total: number;
  date: string;
};

export type AppData = {
  users: User[];
  priceLists: PriceList[];
};
