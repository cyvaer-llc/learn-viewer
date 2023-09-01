import { type SyntheticEvent } from "react";
import { useChallengeDispatch, useChallengeState } from "../../contexts/challenge";
import './answer-check.css';

export type AnswerCheckProps = {
  challengeId: string
};

export default function AnswerCheck(props: AnswerCheckProps) {
  const { challengeId } = props;

  const { checkAnswer } = useChallengeDispatch();
  const [ state ] = useChallengeState();

  const answerState = state[challengeId]?.lastAttempt;

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
