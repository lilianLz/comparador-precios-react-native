export function formatPrice(value) {
  return `$${value.toLocaleString('es-AR')}`;
}

export function formatDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function getLowestPrice(product, businesses) {
  const entries = businesses
    .map((business) => ({
      business,
      price: product.prices[business.id]?.amount ?? null,
    }))
    .filter((entry) => entry.price !== null);

  if (entries.length === 0) return null;
  return entries.reduce((lowest, current) =>
    current.price < lowest.price ? current : lowest,
  );
}

export function getHighestPrice(product, businesses) {
  const entries = businesses
    .map((business) => ({
      business,
      price: product.prices[business.id]?.amount ?? null,
    }))
    .filter((entry) => entry.price !== null);

  if (entries.length === 0) return null;
  return entries.reduce((highest, current) =>
    current.price > highest.price ? current : highest,
  );
}

export function getCartTotals(products, businesses) {
  return businesses
    .map((business) => {
      const prices = products.map((product) => product.prices[business.id]?.amount);
      const availablePrices = prices.filter((value) => value !== undefined);

      return {
        business,
        total: availablePrices.reduce((sum, value) => sum + value, 0),
        missing: products.length - availablePrices.length,
      };
    })
    .sort((a, b) => {
      if (a.missing !== b.missing) return a.missing - b.missing;
      return a.total - b.total;
    });
}
