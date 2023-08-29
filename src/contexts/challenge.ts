import { createContext } from "react";
import type { ChallengeMutators, ChallengeState } from '../reducers/challenge-reducer';

export const ChallengeDispatchContext = createContext<ChallengeMutators | null>(null);
export const ChallengeStateContext = createContext<ChallengeState | null>(null);