import { type ChangeEvent } from "react";
import { useChallengeDispatch, useChallengeState } from "../../contexts/challenge";

type ParagraphEntryProps = {
  challengeId: string
};

export default function ParagraphEntry(props: ParagraphEntryProps) {
  const { challengeId } = props;

  const [ state, selectors ] = useChallengeState();
  const { setTextAnswer } = useChallengeDispatch();

  const text = selectors.getTextAnswer(challengeId);

  const changeText = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAnswer(challengeId, evt.target.value);
  }

  return (
    <textarea
      placeholder={ state[challengeId]?.placeholder }
      className="multiline-entry"
      onChange={ changeText }
      value={ text }
    />
  )
}