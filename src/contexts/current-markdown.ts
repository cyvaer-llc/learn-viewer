import { Dispatch, createContext } from "react";
import type { MarkdownAction, MarkdownPayload } from '../reducers/markdown-actions';
import { createNullCheckUseContext } from "./null-check-use-context";

const CurrentMarkdownDispatchContext = createContext<Dispatch<MarkdownAction> | null>(null);
const CurrentMarkdownStateContext = createContext<MarkdownPayload | null>(null);

export const CurrentMarkdownDispatchProvider = CurrentMarkdownDispatchContext.Provider;
export const CurrentMarkdownStateProvider = CurrentMarkdownStateContext.Provider;

export const useCurrentMarkdownDispatch = createNullCheckUseContext(CurrentMarkdownDispatchContext);
export const useCurrentMarkdownState = createNullCheckUseContext(CurrentMarkdownStateContext);