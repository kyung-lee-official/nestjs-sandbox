/**
 * Set certain keys of a type T as optional
 * @template T - The original type
 * @template K - The keys of T to set as optional
 * @returns A new type with the specified keys set as optional
 */

export type SetOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
