import type { ReactNode } from "react";
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
  const optsArray = typeof options === 'string' ? options.split(' ') : options;
  console.log(optsArray);
  
  return (
    <section className="challenge">
      <div className={`badge${!isSupported ? ' strike' : ''}`}>{challengeType}</div>
      <h2>{ title }</h2>
      <section>
        <code className="id-block">ID: {id}</code>
        { isSupported && children || <div className="unsupported">This challenge type is not supported</div> }
      </section>
    </section>
  );
}