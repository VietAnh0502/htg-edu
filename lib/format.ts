export const money = (value: number | string) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value));
export const duration = (seconds: number) => `${Math.floor(seconds / 3600)} giờ ${Math.round((seconds % 3600) / 60)} phút`;
