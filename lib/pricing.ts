import { MarkupTier, OrderLine, PriceList, Product } from "@/types";

export function getMarkupTierFromList(priceList: PriceList, quantity: number): MarkupTier | null {
  return (
    priceList.markupTiers.find(
      (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
    ) ?? null
  );
}

export function calcOrderLine(
  product: Product,
  quantity: number,
  priceList: PriceList,
  id: string
): OrderLine {
  const markupPercent = getMarkupTierFromList(priceList, quantity)?.markupPercent ?? 0;
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
