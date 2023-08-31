import { useEffect, type ReactNode, useContext } from "react";
import { ChallengeDispatchContext, ChallengeStateContext } from "../../contexts/challenge";
import { ChallengeInfo } from "../../remark-plugins/remark-challenge-plugin";
import '../../remark-plugins/remark-challenge-plugin.css';
import './challenge.css';
import { type ChallengeState } from "../../reducers/challenge-reducer";
import AnswerCheck from "./answer-check";

const UNSUPPORTED_CHALLENGE_TYPES = [
  'code-snippet',
  'number',
  'ordering',
  'paragraph',
  'project',
  'testable-project',
  'short-answer'
];
// SUPPORTED:
// 'tasklist'
// 'checkbox'
// 'multiple-choice'

type ChallengeProps = ChallengeInfo &{
  children: ReactNode[]
};

export default function Challenge(props: ChallengeProps) {
  const { id, title, challengeType, children, options, answer } = props;

  const isSupported = !UNSUPPORTED_CHALLENGE_TYPES.includes(challengeType);

  // If the options passed in is a string, remark has probably separated each array item with a space.
  const optsArray = typeof options === 'string' ? options.split(' ') : options || [];
  const answerArray = typeof answer === 'string' ? answer.split(' ') : answer || [];

  const { setPossibilities, setCorrectAnswer } = useContext(ChallengeDispatchContext) || {};
  const [state] = useContext(ChallengeStateContext) || [{} as ChallengeState];

  // Task List:
  // If every one of the possible options is in the selected options, then the task list is complete.
  const isTaskList = challengeType === 'tasklist';
  const completed = state?.[id]?.possibleOptions &&
    [...state[id].possibleOptions].every(entry => state?.[id]?.selectedOptions.has(entry));

  // checkbox and multiple-choice:
  const isAnswerCheckable = ['checkbox', 'multiple-choice'].includes(challengeType);
  
  useEffect(() => {
    setPossibilities?.(optsArray);
    setCorrectAnswer?.(answerArray);
  }, [options, answer]);

  return (
    <section className="challenge">
      <div className={`badge ${!isSupported ? 'strike' : ''}`}>challenge ({challengeType})</div>
      <h2>{ title }</h2>
      <section>
        <code className="id-block">ID: {id}</code>
        { isSupported || <div className="unsupported">Interaction on this challenge type is not currently supported.</div> }
        { children }
      </section>
      { isTaskList && completed && <div className="challenge-success">All tasks complete!</div> }
      { isAnswerCheckable && <AnswerCheck challengeId={id} /> }
    </section>
  );
}