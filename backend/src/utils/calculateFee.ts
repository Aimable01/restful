export const calculateFee = (
  entryDate: Date,
  exitDate: Date,
  feePerHour: number,
) => {
  const hours = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60);

  return Math.ceil(hours) * feePerHour;
};
