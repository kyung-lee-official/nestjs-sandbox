export const formatCurrency = (amount: number, currencyCode: string) => {
  // Handle null/undefined amounts
  if (amount == null || isNaN(amount)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(0);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount); // Medusa amounts are already in the correct unit
};
