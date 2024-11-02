import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const phoneRegex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);

export const colorMap: { [key: string]: string } = {
  red: "#FF0000",
  blue: "#0000FF",
  black: "#000000",
  white: "#FFFFFF",
  silver: "#C0C0C0",
  gray: "#808080",
  green: "#008000",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  gold: "#FFD700",
  beige: "#F5F5DC",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  maroon: "#800000",
  navy: "#000080",
  teal: "#008080",
  violet: "#EE82EE",
  turquoise: "#40E0D0",
  olive: "#808000",
  lime: "#00FF00",
  indigo: "#4B0082",
  coral: "#FF7F50",
  bronze: "#CD7F32",
  pearl: "#EAE0C8",
  charcoal: "#36454F",
  burgundy: "#800020",
  mint: "#98FF98",
  lavender: "#E6E6FA",
  champagne: "#F7E7CE",
  cream: "#FFFDD0",
  other: "#CCCCCC",
};

export const createChartConfig = (enumType: z.ZodEnum<[string, ...string[]]>) => {
  return Object.fromEntries(
    enumType.options.map((type, index) => [
      type,
      {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        color: `hsl(var(--chart-${index + 1}))`,
      },
    ])
  );
};

export const isDateBetweenRange = (date: Timestamp, range: { from: Timestamp; to: Timestamp }): boolean => {
  const dateToCheck = date.toDate();
  const fromDate = range.from.toDate();
  const toDate = range.to.toDate();

  return dateToCheck >= fromDate && dateToCheck <= toDate;
};
