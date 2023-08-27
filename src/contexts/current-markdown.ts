import { Dispatch, createContext } from "react";
import type { MarkdownAction, MarkdownPayload } from '../reducers/markdown-actions';

export const CurrentMarkdownDispatchContext = createContext<Dispatch<MarkdownAction> | null>(null);
export const CurrentMarkdownStateContext = createContext<MarkdownPayload | null>(null);