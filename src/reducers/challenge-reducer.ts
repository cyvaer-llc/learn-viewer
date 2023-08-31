import { useMemo, useReducer } from "react";

// Challenge options should be of the form <challengeId>-option-<optionIndex>
type ChallengeOption = string;
export type ChallengeOptionConfiguration = {
  possibleOptions: Set<ChallengeOption>;
  selectedOptions: Set<ChallengeOption>;
  correctOptions?: Set<ChallengeOption>;
  lastAttempt: 'unanswered' | 'correct' | 'wrong';
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
  setCorrectAnswer: (options: ChallengeOption[]) => void;
  checkAnswer: (challengeId: string) => void;
}

const challengeIdFromOptionId = (optionId: ChallengeOption): string => {
  const [challengeId, _] = optionId.split('-option-');  
  return challengeId;
}

const set = (options: ChallengeOption[]): ChallengeAction => {
  if (options.length < 1) {
    throw new Error('setPossibilities requires at least one option');
  }

  const challengeId = challengeIdFromOptionId(options[0]);
  if (options.some(option => challengeIdFromOptionId(option) !== challengeId)) {
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

const setAnswers = (options: ChallengeOption[]): ChallengeAction => {
  if (options.length < 1) {
    throw new Error('setAnswers requires at least one option');
  }

  const challengeId = challengeIdFromOptionId(options[0]);
  if (options.some(option => challengeIdFromOptionId(option) !== challengeId)) {
    throw new Error('All answers must be for the same challenge');
  }

  return {
    type: 'SET_ANSWERS',
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

const check = (challengeId: string): ChallengeAction => {
  return {
    type: 'CHECK_ANSWER',
    payload: {
      challengeId
    }
  }
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
          lastAttempt: 'unanswered'
        }
      };
    }
    case 'SET_POSSIBILITIES': {
      const { challengeId, options } = action.payload;
      // TODO: Support persisting challenge state. As-is, we'll reset
      //       challenges on every re-render.
      return {
        ...state,
        [challengeId]: {
          possibleOptions: new Set<ChallengeOption>(options),
          selectedOptions: new Set<ChallengeOption>(),
          lastAttempt: 'unanswered'
        }
      };
    }
    case 'SET_ANSWERS': {
      const { challengeId, options } = action.payload;
      return {
        ...state,
        [challengeId]: {
          ...state[challengeId],
          correctOptions: new Set<ChallengeOption>(options)
        }
      }
    }
    case 'CHECK_ANSWER': {
      const { challengeId } = action.payload;
      const challenge = state[challengeId];
      const correctOptions = challenge.correctOptions;
      if (!correctOptions) {
        throw new Error('Cannot check answers for a challenge without a list of correct options.');
      }

      const selectedOptions = challenge.selectedOptions;
      const isCorrect = correctOptions && selectedOptions.size === correctOptions.size && [...selectedOptions].every(option => correctOptions.has(option));
      return {
        ...state,
        [challengeId]: {
          ...challenge,
          lastAttempt: isCorrect ? 'correct' : 'wrong'
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
      },
      setCorrectAnswer: (options: ChallengeOption[]) => {
        if (options?.length < 1) {
          console.log('No options provided to setCorrectAnswer; skipping');
          return;
        }
        dispatch(setAnswers(options));
      },
      checkAnswer: (challengeId: string) => {
        dispatch(check(challengeId));
      },
    };
    return mutators;
  }, []);

  return [state, mutators];
}