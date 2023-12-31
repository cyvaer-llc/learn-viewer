import { useMemo, useReducer } from "react";
import { ChallengeInfo } from "../remark-plugins/remark-challenge-plugin";

// Challenge options should be of the form <challengeId>-option-<optionIndex>
type ChallengeOption = string;
export type ChallengeOptionConfiguration = {
  possibleOptions: Set<ChallengeOption>;
  selectedOptions: Set<ChallengeOption>;
  correctOptions?: Set<ChallengeOption>;
  lastAttempt: 'unanswered' | 'correct' | 'wrong';
  textAnswer?: string;
  challengeType: string;
  placeholder?: string;
}

export type ChallengeState = {
  [key: string]: ChallengeOptionConfiguration;
}

const INITIAL_STATE: ChallengeState = {};

type ToggleAction = {
  type: 'TOGGLE_OPTION';
  payload: {
    challengeId: string;
    optionId: ChallengeOption;
  }
};

type CheckAction = {
  type: 'CHECK_ANSWER';
  payload: {
    challengeId: string;
  }
};

type InitializeAction = {
  type: 'SET_POSSIBILITIES';
  payload: {
    challenge: ChallengeInfo
  }
};

type AnswerAction = {
  type: 'SET_ANSWER';
  payload: {
    challengeId: string;
    answer: string;
  }
};

type ChallengeAction = InitializeAction | ToggleAction | CheckAction | AnswerAction;

export type ChallengeSelectors = {
  isSelected: (optionId: ChallengeOption) => boolean;
  getTextAnswer: (challengeId: string) => string;
}

export type ChallengeMutators = {
  toggleOption: (optionId: ChallengeOption) => void;
  setPossibilities: (challengeInfo: ChallengeInfo) => void;
  checkAnswer: (challengeId: string) => void;
  setTextAnswer: (challengeId: string, textAnswer: string) => void;
}

const challengeIdFromOptionId = (optionId: ChallengeOption): string => {
  const [challengeId, _] = optionId.split('-option-');  
  return challengeId;
}

const set = (challenge: ChallengeInfo): InitializeAction => {
  const { options, answer } = challenge;

  // If the options passed in is a string, remark has probably separated each array item with a space.
  const optsArray = typeof options === 'string' ? options.split(' ') : options || [];
  const answerArray = typeof answer === 'string' ? answer.split(' ') : answer || [];

  if (optsArray.length < 1) {
    throw new Error('setPossibilities requires at least one option');
  }

  if (answerArray.length < 1) {
    throw new Error('setAnswers requires at least one option');
  }

  return {
    type: 'SET_POSSIBILITIES',
    payload: {
      challenge: {
        ...challenge,
        options: optsArray,
        answer: answerArray
      }
    }
  };
};

const toggle = (optionId: ChallengeOption): ToggleAction => {
  const [challengeId, _] = optionId.split('-option-');
  return {
    type: 'TOGGLE_OPTION',
    payload: {
      challengeId,
      optionId
    }
  };
};

const check = (challengeId: string): CheckAction => {
  return {
    type: 'CHECK_ANSWER',
    payload: {
      challengeId
    }
  };
};

const answer = (challengeId: string, textAnswer: string): AnswerAction => {
  return {
    type: 'SET_ANSWER',
    payload: {
      challengeId,
      answer: textAnswer
    }
  };
};

function reducer(state: ChallengeState = INITIAL_STATE, action: ChallengeAction): ChallengeState {
  switch (action.type) {
    case 'TOGGLE_OPTION': {
      const { challengeId, optionId: option } = action.payload;
      const challengeOptions = new Set<ChallengeOption>(state[challengeId].selectedOptions);
      if (challengeOptions.has(option)) {
        challengeOptions.delete(option);
      } else {
        if (state[challengeId].challengeType === 'multiple-choice') {
          // multiple-choice type challenges should only have one option selected at a time
          challengeOptions.clear();
        }
        challengeOptions.add(option);
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
      const { challenge: { id: challengeId, options, answer, challengeType, placeholder } } = action.payload;
      // TODO: Support persisting challenge state. As-is, we'll reset
      //       challenges on every re-render.
      return {
        ...state,
        [challengeId]: {
          possibleOptions: new Set<ChallengeOption>(options),
          selectedOptions: new Set<ChallengeOption>(),
          correctOptions: new Set<ChallengeOption>(answer),
          lastAttempt: 'unanswered',
          challengeType,
          placeholder
        }
      };
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
    case 'SET_ANSWER': {
      const { challengeId, answer: textAnswer } = action.payload;
      const challenge = state[challengeId];
      return {
        ...state,
        [challengeId]: {
          ...challenge,
          textAnswer
        }
      };
    }
    default:
      return state;
  }
}

export function useChallengeReducer(): [ChallengeState, ChallengeMutators, ChallengeSelectors] {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const mutators = useMemo(() => {
    const mutators: ChallengeMutators = {
      toggleOption: (optionId: ChallengeOption) => {
        dispatch(toggle(optionId));
      },
      setPossibilities: (challenge: ChallengeInfo) => {
        dispatch(set(challenge));
      },
      checkAnswer: (challengeId: string) => {
        dispatch(check(challengeId));
      },
      setTextAnswer: (challengeId: string, textAnswer: string) => {
        dispatch(answer(challengeId, textAnswer));
      }
    };
    return mutators;
  }, []);

  const selectors = useMemo(() => {
    const selectors: ChallengeSelectors = {
      isSelected: (optionId: ChallengeOption): boolean => {
        const challengeId = challengeIdFromOptionId(optionId);
        const challenge = state[challengeId];
        return challenge?.selectedOptions.has(optionId);
      },
      getTextAnswer: (challengeId: string): string => {
        const challenge = state[challengeId];
        return challenge?.textAnswer || '';
      }
    };
    return selectors;
  }, [state]);

  return [state, mutators, selectors];
}