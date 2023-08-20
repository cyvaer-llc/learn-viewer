import { Dispatch, createContext } from "react";
import type { Action } from '../actions/current-markdown-reducer';

export const CurrentMarkdownDispatchContext = createContext<Dispatch<Action> | null>(null);