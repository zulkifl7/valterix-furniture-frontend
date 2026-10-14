export function formatLkr(amount: number) {
  const negative = amount < 0;
  const digits = Math.round(Math.abs(amount)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}LKR ${grouped}`;
}
