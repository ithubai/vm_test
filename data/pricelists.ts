import { PriceList } from "@/types";

export const PRICE_LISTS: PriceList[] = [
  {
    country: "IT",
    products: [
      { codice: "IT-001", descrizione: "Profilo alluminio 2m",   unitaMisura: "pz", costoBase: 4.50 },
      { codice: "IT-002", descrizione: "Profilo PVC 2m",         unitaMisura: "pz", costoBase: 2.80 },
      { codice: "IT-003", descrizione: "Angolare 25x25",         unitaMisura: "pz", costoBase: 1.20 },
      { codice: "IT-004", descrizione: "Coprigiunto alluminio",  unitaMisura: "pz", costoBase: 0.90 },
      { codice: "IT-005", descrizione: "Battiscopa PVC 2.5m",    unitaMisura: "pz", costoBase: 3.60 },
      { codice: "IT-006", descrizione: "Profilo pavimento 2m",   unitaMisura: "pz", costoBase: 5.10 },
      { codice: "IT-007", descrizione: "Paraspigolo 30x30",      unitaMisura: "pz", costoBase: 1.80 },
      { codice: "IT-008", descrizione: "Raccordo angolare",      unitaMisura: "pz", costoBase: 0.65 },
    ],
    markupTiers: [
      { minQty: 1,  maxQty: 9,    markupPercent: 45 },
      { minQty: 10, maxQty: 19,   markupPercent: 40 },
      { minQty: 20, maxQty: 29,   markupPercent: 35 },
      { minQty: 30, maxQty: 39,   markupPercent: 30 },
      { minQty: 40, maxQty: 49,   markupPercent: 27 },
      { minQty: 50, maxQty: null, markupPercent: 25 },
    ],
  },
  {
    country: "FR",
    products: [
      { codice: "FR-001", descrizione: "Profilé aluminium 2m",    unitaMisura: "pz", costoBase: 4.80 },
      { codice: "FR-002", descrizione: "Profilé PVC 2m",          unitaMisura: "pz", costoBase: 3.00 },
      { codice: "FR-003", descrizione: "Cornière 25x25",          unitaMisura: "pz", costoBase: 1.35 },
      { codice: "FR-004", descrizione: "Couvre-joint aluminium",  unitaMisura: "pz", costoBase: 0.95 },
      { codice: "FR-005", descrizione: "Plinthe PVC 2.5m",        unitaMisura: "pz", costoBase: 3.90 },
      { codice: "FR-006", descrizione: "Profilé sol 2m",          unitaMisura: "pz", costoBase: 5.40 },
    ],
    markupTiers: [
      { minQty: 1,  maxQty: 9,    markupPercent: 50 },
      { minQty: 10, maxQty: 19,   markupPercent: 44 },
      { minQty: 20, maxQty: 29,   markupPercent: 38 },
      { minQty: 30, maxQty: 39,   markupPercent: 33 },
      { minQty: 40, maxQty: 49,   markupPercent: 29 },
      { minQty: 50, maxQty: null, markupPercent: 26 },
    ],
  },
  {
    country: "DE",
    products: [
      { codice: "DE-001", descrizione: "Aluminiumprofil 2m",       unitaMisura: "pz", costoBase: 4.60 },
      { codice: "DE-002", descrizione: "PVC-Profil 2m",            unitaMisura: "pz", costoBase: 2.90 },
      { codice: "DE-003", descrizione: "Winkelleiste 25x25",       unitaMisura: "pz", costoBase: 1.25 },
      { codice: "DE-004", descrizione: "Abdeckleiste Aluminium",   unitaMisura: "pz", costoBase: 0.92 },
      { codice: "DE-005", descrizione: "Sockelleiste PVC 2.5m",    unitaMisura: "pz", costoBase: 3.70 },
      { codice: "DE-006", descrizione: "Bodenprofil 2m",           unitaMisura: "pz", costoBase: 5.20 },
      { codice: "DE-007", descrizione: "Kantenschutz 30x30",       unitaMisura: "pz", costoBase: 1.85 },
    ],
    markupTiers: [
      { minQty: 1,  maxQty: 9,    markupPercent: 42 },
      { minQty: 10, maxQty: 19,   markupPercent: 37 },
      { minQty: 20, maxQty: 29,   markupPercent: 32 },
      { minQty: 30, maxQty: 39,   markupPercent: 28 },
      { minQty: 40, maxQty: 49,   markupPercent: 25 },
      { minQty: 50, maxQty: null, markupPercent: 22 },
    ],
  },
];

export function getPriceList(country: string): PriceList | undefined {
  return PRICE_LISTS.find((pl) => pl.country === country);
}
