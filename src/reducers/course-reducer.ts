import { useReducer } from "react";
import { CourseModel } from "../models/course"

// Types for the course reducer
type CourseLoadError = string;
export type CourseState = {
  course: CourseModel | null;
  error: CourseLoadError | null;
  loading: boolean;
};
export type CourseSetters = {
  setCourse: (course: CourseModel) => void;
  setCourseError: (error: CourseLoadError) => void;
  setCourseLoading: () => void;
};

// Actions for the course reducer
interface CourseAction {
  type: string;
  payload?: CourseModel | CourseLoadError;
}

const SetCurrentCourseAction = (course: CourseModel): CourseAction => ({
  type: 'SET_CURRENT_COURSE',
  payload: course,
});

const SetCourseError = (error: CourseLoadError): CourseAction => ({
  type: 'SET_COURSE_ERROR',
  payload: error,
});

const SetCourseLoading = (): CourseAction => ({
  type: 'SET_COURSE_LOADING'
});

// The reducer itself
const INITIAL_STATE: CourseState = {
  course: null,
  error: null,
  loading: false,
};

const courseReducer = (state: CourseState, action: CourseAction): CourseState => {
  switch(action.type) {
    case 'SET_CURRENT_COURSE':
      return {
        ...state,
        course: action.payload as CourseModel,
        error: null,
        loading: false,
      };
    case 'SET_COURSE_ERROR':
      return {
        ...state,
        course: null,
        error: action.payload as CourseLoadError,
        loading: false,
      };
    case 'SET_COURSE_LOADING':
      return {
        ...state,
        error: null,
        loading: true,
      };
    default:
      return state;
  }
};

// The hook that uses the reducer
export default function useCourseReducer(): [CourseState, CourseSetters] {
  const [state, dispatch] = useReducer(courseReducer, INITIAL_STATE);

  const setCourse = (course: CourseModel) => {
    dispatch(SetCurrentCourseAction(course));
  };

  const setCourseError = (error: CourseLoadError) => {
    dispatch(SetCourseError(error));
  };

  const setCourseLoading = () => {
    dispatch(SetCourseLoading());
  };

  const courseSetters: CourseSetters = { setCourse, setCourseError, setCourseLoading };
  return [state, courseSetters];
}