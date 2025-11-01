/*  const calculateDiscountPercent = (mrpPrice, sellingPrice) => {
    if (mrpPrice <= 0) {
        return 0;
    }
    const discount = mrpPrice - sellingPrice;
    return Math.round((discount / mrpPrice) * 100)
} */
const calculateDiscountPercent = (mrpPrice, sellingPrice) => {
  if (!Number.isFinite(mrpPrice) || mrpPrice <= 0) {
    return 0;
    // throw new Error('MRP Price should be greater than zero (0)');
  }
  if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
    sellingPrice = mrpPrice; // sellingPrice না দিলে 0% ডিসকাউন্ট
  }
  if (sellingPrice >= mrpPrice) return 0;
  const discount = mrpPrice - sellingPrice;
  return Math.max(0, Math.round((discount / mrpPrice) * 100));
};

module.exports = calculateDiscountPercent;