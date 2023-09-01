import { createContext } from "react";
import { createNullCheckUseContext } from "./null-check-use-context";
import type { CourseSetters, CourseState } from '../reducers/course-reducer';

const CourseSettersContext = createContext<CourseSetters | null>(null);
const CourseStateContext = createContext<CourseState | null>(null);

export const CourseSettersProvider = CourseSettersContext.Provider;
export const CourseStateProvider = CourseStateContext.Provider;

export const useCourseSetters = createNullCheckUseContext(CourseSettersContext);
export const useCourseState = createNullCheckUseContext(CourseStateContext);