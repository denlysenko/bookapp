import { createContext } from 'react';

// tslint:disable-next-line: interface-over-type-literal
type FeedbackContextProps = { showFeedback: (msg: string) => void };

export const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);
