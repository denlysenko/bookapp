import { FileSelectorActionTypes, FileSelectorAction } from './actions';

interface State {
  loading: boolean;
  file: File | null;
  error?: string;
}

export const initialState: State = {
  loading: false,
  file: null,
  error: undefined,
};

export const reducer = (state = initialState, action: FileSelectorAction) => {
  switch (action.type) {
    case FileSelectorActionTypes.START_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }

    case FileSelectorActionTypes.STOP_LOADING: {
      return {
        ...state,
        loading: false,
      };
    }

    case FileSelectorActionTypes.SELECT_FILE: {
      return {
        ...state,
        error: null,
        file: action.payload,
      };
    }

    case FileSelectorActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }

    case FileSelectorActionTypes.RESET: {
      return {
        ...state,
        file: null,
        error: null,
      };
    }

    default: {
      return state;
    }
  }
};
