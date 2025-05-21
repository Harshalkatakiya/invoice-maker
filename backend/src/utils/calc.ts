export function calculateNetAndTotal(
  rate: number,
  quantity: number,
  disc: number
) {
  const net = rate - (disc / 100) * rate;
  const total = net * quantity;
  return {
    netAmount: parseFloat(net.toFixed(2)),
    totalAmount: parseFloat(total.toFixed(2))
  };
}
