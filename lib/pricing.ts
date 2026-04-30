import { Country, MarkupTier, OrderLine, Product } from "@/types";
import { getPriceList } from "@/data/pricelists";

export function getMarkupTier(country: Country, quantity: number): MarkupTier | null {
  const priceList = getPriceList(country);
  if (!priceList) return null;
  return (
    priceList.markupTiers.find(
      (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
    ) ?? null
  );
}

export function getMarkupPercent(country: Country, quantity: number): number {
  return getMarkupTier(country, quantity)?.markupPercent ?? 0;
}

export function calcOrderLine(
  product: Product,
  quantity: number,
  country: Country,
  id: string
): OrderLine {
  const markupPercent = getMarkupPercent(country, quantity);
  const sellPrice = product.costoBase * (1 + markupPercent / 100);
  const lineTotal = sellPrice * quantity;
  return { id, product, quantity, markupPercent, sellPrice, lineTotal };
}

export function formatTierLabel(tier: MarkupTier): string {
  if (tier.maxQty === null) return `${tier.minQty}+ pz → ${tier.markupPercent}%`;
  return `${tier.minQty}–${tier.maxQty} pz → ${tier.markupPercent}%`;
}

export const euroFormat = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export const numberFormat = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
