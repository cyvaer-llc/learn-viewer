import { type SyntheticEvent, useContext } from "react";
import { ChallengeDispatchContext, ChallengeStateContext } from "../../contexts/challenge";
import { type ChallengeState } from "../../reducers/challenge-reducer";
import './answer-check.css';

export type AnswerCheckProps = {
  challengeId: string
};

export default function AnswerCheck(props: AnswerCheckProps) {
  const { challengeId } = props;

  const { checkAnswer } = useContext(ChallengeDispatchContext) || {};
  const [ state ] = useContext(ChallengeStateContext) || [{} as ChallengeState ];

  const answerState = state?.[challengeId]?.lastAttempt;

  const onCheckClicked = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    checkAnswer?.(challengeId);
  }

  return (
    <div className="answer-check">
      { <button onClick={onCheckClicked}>Check</button>}
      { answerState === 'unanswered' && <div>Press "Check" to check your answer.</div>}
      { answerState === 'correct' && <div className="challenge-success">Correct!</div> }
      { answerState === 'wrong' && <div className="challenge-fail">Not quite! Try again.</div> }
    </div>
  );
};
