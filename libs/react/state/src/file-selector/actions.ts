export enum FileSelectorActionTypes {
  START_LOADING = 'START_LOADING',
  STOP_LOADING = 'STOP_LOADING',
  SELECT_FILE = 'SELECT_FILE',
  SET_ERROR = 'SET_ERROR',
  RESET = 'RESET',
}

interface StartLoadingAction {
  type: FileSelectorActionTypes.START_LOADING;
}

interface StopLoadingAction {
  type: FileSelectorActionTypes.STOP_LOADING;
}

interface SelectFileAction {
  type: FileSelectorActionTypes.SELECT_FILE;
  payload: File;
}

interface SetErrorAction {
  type: FileSelectorActionTypes.SET_ERROR;
  payload: string;
}

interface ResetAction {
  type: FileSelectorActionTypes.RESET;
}

export type FileSelectorAction =
  | StartLoadingAction
  | StopLoadingAction
  | SelectFileAction
  | SetErrorAction
  | ResetAction;
