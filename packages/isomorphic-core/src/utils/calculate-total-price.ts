export function calculateTotalPrice(
  basePrice: number,
  shippingCost: number,
  taxPercentage: number
): number {
  const taxAmount = (basePrice * taxPercentage) / 100;
  const total = Number(basePrice) + Number(shippingCost) + Number(taxAmount);
  return total;
}
