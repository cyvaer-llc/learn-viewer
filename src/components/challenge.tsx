import { useEffect, type ReactNode, useContext } from "react";
import { ChallengeDispatchContext, ChallengeStateContext } from "../contexts/challenge";
import { ChallengeInfo } from "../remark-plugins/remark-challenge-plugin";
import '../remark-plugins/remark-challenge-plugin.css';
import './challenge.css';

const UNSUPPORTED_CHALLENGE_TYPES = [
  'code-snippet',
  'checkbox',
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

type ChallengeProps = ChallengeInfo &{
  children: ReactNode[]
};

export default function Challenge(props: ChallengeProps) {
  const { id, title, challengeType, children, options } = props;

  const isSupported = !UNSUPPORTED_CHALLENGE_TYPES.includes(challengeType);

  // If the options passed in is a string, remark has probably separated each array item with a space.
  const optsArray = typeof options === 'string' ? options.split(' ') : options || [];
  const { setPossibilities } = useContext(ChallengeDispatchContext) || {};
  const state = useContext(ChallengeStateContext) || {};

  // Assume each entry is unique and no sle, so as long as the sets are the same size they are equal.
  const completed = state?.[id]?.possibleOptions &&
    [...state[id].possibleOptions].every(entry => state?.[id]?.selectedOptions.has(entry));
  
  useEffect(() => {
    setPossibilities?.(optsArray);
  }, [options]);
  
  return (
    <section className="challenge">
      <div className={`badge${!isSupported ? ' strike' : ''}`}>{challengeType}</div>
      <h2>{ title }</h2>
      <section>
        <code className="id-block">ID: {id}</code>
        { isSupported && children || <div className="unsupported">This challenge type is not supported</div> }
      </section>
      { completed && <div className="challenge-success">All tasks complete!</div> }
    </section>
  );
}