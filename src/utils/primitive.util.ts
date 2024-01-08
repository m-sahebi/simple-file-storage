import { customAlphabet } from "nanoid";

export function invariant(value: boolean, message?: string): asserts value;
export function invariant<T>(value: T | null | undefined, message?: string): asserts value is T;
export function invariant(value: unknown, message?: string) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}

export function nonNullable<T>(value: T, errorMsg?: string) {
  if (value == null) throw new Error(errorMsg || "value is null or undefined");
  return value;
}

export function clamp(number: number, min?: number | null, max?: number | null) {
  return Math.max(
    min ?? Number.NEGATIVE_INFINITY,
    Math.min(number, max ?? Number.POSITIVE_INFINITY),
  );
}

export const generateRandomId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 20);
