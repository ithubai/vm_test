export type Country = "IT" | "FR" | "DE";

export type User = {
  username: string;
  password: string;
  country: Country;
  fullName: string;
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
