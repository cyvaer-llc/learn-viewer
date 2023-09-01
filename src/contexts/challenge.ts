import { createContext } from "react";
import { createNullCheckUseContext } from "./null-check-use-context";
import type { ChallengeMutators, ChallengeState, ChallengeSelectors } from '../reducers/challenge-reducer';

const ChallengeDispatchContext = createContext<ChallengeMutators | null>(null);
const ChallengeStateContext = createContext<[ChallengeState, ChallengeSelectors] | null>(null);

export const ChallengeDispatchProvider = ChallengeDispatchContext.Provider;
export const ChallengeStateProvider = ChallengeStateContext.Provider;

export const useChallengeDispatch = createNullCheckUseContext(ChallengeDispatchContext);
export const useChallengeState = createNullCheckUseContext(ChallengeStateContext);
