import { useEffect, type ReactNode } from "react";
import { useChallengeDispatch, useChallengeState } from "../../contexts/challenge";
import { ChallengeInfo } from "../../remark-plugins/remark-challenge-plugin";
import '../../remark-plugins/remark-challenge-plugin.css';
import './challenge.css';
import AnswerCheck from "./answer-check";
import ParagraphEntry from "./paragraph-entry";

const UNSUPPORTED_CHALLENGE_TYPES = [
  'code-snippet',
  'number',
  'ordering',
  'project',
  'testable-project',
  'short-answer'
];
// SUPPORTED:
// 'checkbox'
// 'multiple-choice'
// 'paragraph'
// 'tasklist'

type ChallengeProps = ChallengeInfo & {
  children: ReactNode[]
};

export default function Challenge(props: ChallengeProps) {
  const { children, ...challengeInfo } = props;
  const { id, title, challengeType, options, answer } = challengeInfo;

  const isSupported = !UNSUPPORTED_CHALLENGE_TYPES.includes(challengeType);

  const { setPossibilities } = useChallengeDispatch();
  const [ state ] = useChallengeState();

  // Task List:
  // If every one of the possible options is in the selected options, then the task list is complete.
  const isTaskList = challengeType === 'tasklist';
  const completed = state[id]?.possibleOptions &&
    [...state[id].possibleOptions].every(entry => state[id]?.selectedOptions.has(entry));

  // Checkbox and Multiple Choice:
  const isAnswerCheckable = ['checkbox', 'multiple-choice'].includes(challengeType);

  // Paragraph:
  const isMultilineEntry = challengeType === 'paragraph';
  
  useEffect(() => {
    setPossibilities(challengeInfo);
  }, [options, answer, challengeType]);

  return (
    <section className="challenge">
      <div className={`badge ${!isSupported ? 'strike' : ''}`}>challenge ({challengeType})</div>
      <h2>{ title }</h2>
      <section className="challenge-content">
        <code className="id-block">ID: {id}</code>
        { isSupported || <div className="unsupported">Interaction on this challenge type is not currently supported.</div> }
        { children }
        { isMultilineEntry && <ParagraphEntry challengeId={id} /> }
      </section>
      { isTaskList && completed && <div className="challenge-success">All tasks complete!</div> }
      { isAnswerCheckable && <AnswerCheck challengeId={id} /> }
    </section>
  );
}