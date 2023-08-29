import { SyntheticEvent, useCallback, useContext } from "react";
import { ChallengeDispatchContext } from "../contexts/challenge";

export default function Checkbox(props: any) {
  const { toggleOption } = useContext(ChallengeDispatchContext) || {};
  const changed = useCallback((evt: SyntheticEvent<HTMLInputElement>) => {
    toggleOption?.(evt.currentTarget.name);
  }, []);

  return (<input {...props} type="checkbox" onChange={changed} />);
}