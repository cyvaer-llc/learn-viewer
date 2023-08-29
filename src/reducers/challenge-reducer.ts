import { useMemo, useReducer } from "react";

// Challenge options should be of the form <challengeId>-option-<optionIndex>
type ChallengeOption = string;
export type ChallengeOptionConfiguration = {
  possibleOptions: Set<ChallengeOption>;
  selectedOptions: Set<ChallengeOption>;
}

export type ChallengeState = {
  [key: string]: ChallengeOptionConfiguration;
}

const INITIAL_STATE: ChallengeState = {};

export type ChallengeAction = {
  type: string;
  payload: {
    challengeId: string;
    optionId?: ChallengeOption;
    options?: ChallengeOption[];
  }
};

export type ChallengeMutators = {
  toggleOption: (optionId: ChallengeOption) => void;
  setPossibilities: (options: ChallengeOption[]) => void;
}

const set = (options: ChallengeOption[]): ChallengeAction => {
  if (options.length < 1) {
    throw new Error('setPossibilities requires at least one option');
  }

  const [challengeId, _] = options[0].split('-option-');
  if (options.some(option => option.split('-option-')[0] !== challengeId)) {
    throw new Error('All options must be for the same challenge');
  }

  return {
    type: 'SET_POSSIBILITIES',
    payload: {
      challengeId,
      options
    }
  };
}

const toggle = (optionId: ChallengeOption): ChallengeAction => {
  const [challengeId, _] = optionId.split('-option-');
  return {
    type: 'TOGGLE_OPTION',
    payload: {
      challengeId,
      optionId
    }
  };
};

function reducer(state: ChallengeState = INITIAL_STATE, action: ChallengeAction): ChallengeState {
  switch (action.type) {
    case 'TOGGLE_OPTION': {
      const { challengeId, optionId: option } = action.payload;
      const challengeOptions = new Set<ChallengeOption>(state[challengeId].selectedOptions);
      if (challengeOptions.has(option!)) {
        challengeOptions.delete(option!);
      } else {
        challengeOptions.add(option!);
      }
      return {
        ...state,
        [challengeId]: {
          ...state[challengeId],
          selectedOptions: challengeOptions,
        }
      };
    }
    case 'SET_POSSIBILITIES': {
      const { challengeId, options } = action.payload;
      return {
        ...state,
        [challengeId]: {
          possibleOptions: new Set<ChallengeOption>(options),
          selectedOptions: new Set<ChallengeOption>(),
        }
      };
    }
    default:
      return state;
  }
}

export function useChallengeReducer(): [ChallengeState, ChallengeMutators] {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const mutators = useMemo(() => {
    const mutators: ChallengeMutators = {
      toggleOption: (optionId: ChallengeOption) => {
        dispatch(toggle(optionId));
      },
      setPossibilities: (options: ChallengeOption[]) => {
        dispatch(set(options));
      }
    };
    return mutators;
  }, []);

  return [state, mutators];
}