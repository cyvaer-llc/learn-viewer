import { Dispatch, createContext } from "react";
import type { Action } from '../reducers/current-markdown-reducer';

export const CurrentMarkdownDispatchContext = createContext<Dispatch<Action> | null>(null);