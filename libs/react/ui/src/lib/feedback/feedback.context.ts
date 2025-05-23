import { createContext } from 'react';

type FeedbackContextProps = { showFeedback: (msg: string) => void };

export const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);
