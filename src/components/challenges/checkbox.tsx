import { SyntheticEvent, useCallback, useContext } from "react";
import { ChallengeDispatchContext, ChallengeStateContext } from "../../contexts/challenge";
import { type ChallengeState, type ChallengeSelectors } from "../../reducers/challenge-reducer";

export default function Checkbox(props: any) {
  const { name } = props;

  const [ _, selectors ] = useContext(ChallengeStateContext) || [{} as ChallengeState, { isSelected: () => false } as ChallengeSelectors];

  const { toggleOption } = useContext(ChallengeDispatchContext) || {};
  const changed = useCallback((evt: SyntheticEvent<HTMLInputElement>) => {
    toggleOption?.(evt.currentTarget.name);
  }, []);

  return (<input {...props} value={ selectors.isSelected(name) } type="checkbox" onChange={changed} />);
}