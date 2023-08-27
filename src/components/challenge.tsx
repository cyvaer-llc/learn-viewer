import type { ReactNode } from "react";
import { ChallengeInfo } from "../remark-plugins/remark-challenge-plugin";
import './challenge.css';

type ChallengeProps = ChallengeInfo &{
  children: ReactNode[]
};

export default function Challenge(props: ChallengeProps) {
  const { id, title, challengeType, children } = props;

  const isSupported = challengeType !== 'code-snippet';
  
  return (
    <section className="challenge">
      <div className={`badge${!isSupported ? ' strike' : ''}`}>{challengeType}</div>
      <h2>{ title }</h2>
      <section>
        <code className="id-block">{id}</code>
        { isSupported && children || <div className="unsupported">This challenge type is not supported</div> }
      </section>
    </section>
  );
}