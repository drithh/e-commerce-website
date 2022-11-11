export const roundDecimal = (num: number) => Math.round(num * 100) / 100;

export const convertToCurrency = (num: number) => {
  return num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
};
