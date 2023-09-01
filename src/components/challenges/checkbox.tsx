import { SyntheticEvent, useCallback } from "react";
import { useChallengeDispatch, useChallengeState } from "../../contexts/challenge";

export default function Checkbox(props: any) {
  const { name } = props;

  const [ _, selectors ] = useChallengeState();
  const { toggleOption } = useChallengeDispatch();

  const changed = useCallback((evt: SyntheticEvent<HTMLInputElement>) => {
    toggleOption(evt.currentTarget.name);
  }, []);

  return (<input {...props} checked={ selectors.isSelected(name) } type="checkbox" onChange={changed} />);
}