import { Dispatch, createContext } from "react";
import type { MarkdownAction } from '../reducers/markdown-actions';

export const CurrentMarkdownDispatchContext = createContext<Dispatch<MarkdownAction> | null>(null);