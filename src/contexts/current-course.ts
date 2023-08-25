import { createContext } from "react";
import type { CourseSetters, CourseState } from '../reducers/course-reducer';

export const CourseSettersContext = createContext<CourseSetters | null>(null);
export const CourseStateContext = createContext<CourseState | null>(null);
