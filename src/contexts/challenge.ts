import { createContext, useContext } from "react";
import type { ChallengeMutators, ChallengeState, ChallengeSelectors } from '../reducers/challenge-reducer';

export const ChallengeDispatchContext = createContext<ChallengeMutators | null>(null);
export const ChallengeStateContext = createContext<[ChallengeState, ChallengeSelectors] | null>(null);

export const useChallengeDispatch = createNullCheckUseContext(ChallengeDispatchContext);
export const useChallengeState = createNullCheckUseContext(ChallengeStateContext);

function createNullCheckUseContext<T>(context: React.Context<T | null>): () => T {
  return () => {
    const res = useContext<T | null>(context);
  if (res === null) {
    throw new Error('Context value cannot be null!');
  }
  return res as T;
  }
}