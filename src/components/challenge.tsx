import { useEffect, type ReactNode, useContext, type SyntheticEvent } from "react";
import { ChallengeDispatchContext, ChallengeStateContext } from "../contexts/challenge";
import { ChallengeInfo } from "../remark-plugins/remark-challenge-plugin";
import '../remark-plugins/remark-challenge-plugin.css';
import './challenge.css';

const UNSUPPORTED_CHALLENGE_TYPES = [
  'code-snippet',
  'multiple-choice',
  'number',
  'ordering',
  'paragraph',
  'project',
  'testable-project',
  'short-answer'
];
// SUPPORTED:
// tasklist
// checkbox

type ChallengeProps = ChallengeInfo &{
  children: ReactNode[]
};

export default function Challenge(props: ChallengeProps) {
  const { id, title, challengeType, children, options } = props;

  const isSupported = !UNSUPPORTED_CHALLENGE_TYPES.includes(challengeType);

  // If the options passed in is a string, remark has probably separated each array item with a space.
  const optsArray = typeof options === 'string' ? options.split(' ') : options || [];
  const { setPossibilities, checkAnswer } = useContext(ChallengeDispatchContext) || {};
  const state = useContext(ChallengeStateContext) || {};

  // Task List:
  // Assume each entry is unique and all possible/selected options match,
  // so as long as the sets are the same size they are equal.
  const isTaskList = challengeType === 'tasklist';
  const completed = state?.[id]?.possibleOptions &&
    [...state[id].possibleOptions].every(entry => state?.[id]?.selectedOptions.has(entry));

  // Checkbox (multiple choice):
  const isCheckbox = challengeType === 'checkbox';
  const answerState = state?.[id]?.lastAttempt;
  
  useEffect(() => {
    setPossibilities?.(optsArray);
  }, [options]);

  const onCheckClicked = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    checkAnswer?.(id);
  }
  
  return (
    <section className="challenge">
      <div className={`badge${!isSupported ? ' strike' : ''}`}>{challengeType}</div>
      <h2>{ title }</h2>
      <section>
        <code className="id-block">ID: {id}</code>
        { isSupported && children || <div className="unsupported">This challenge type is not supported</div> }
      </section>
      { isTaskList && completed && <div className="challenge-success">All tasks complete!</div> }
      { isCheckbox && answerState === 'unanswered' && <div>Press "Check" to check your answer.</div>}
      { isCheckbox && answerState === 'correct' && <div className="challenge-success">Correct!</div> }
      { isCheckbox && answerState === 'wrong' && <div className="challenge-fail">Not quite! Try again.</div> }
      { isCheckbox && <button onClick={onCheckClicked}>Check</button>}
    </section>
  );
}