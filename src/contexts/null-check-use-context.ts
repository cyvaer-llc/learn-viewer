import { useContext } from "react";

export function createNullCheckUseContext<T>(context: React.Context<T | null>): () => T {
  return () => {
    const res = useContext<T | null>(context);
  if (res === null) {
    throw new Error('Context value cannot be null!');
  }
  return res as T;
  }
}