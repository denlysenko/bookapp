import * as React from 'react';

// tslint:disable-next-line: interface-over-type-literal
type FeedbackContextProps = { showFeedback: (msg: string) => void };

export const FeedbackContext = React.createContext<FeedbackContextProps | undefined>(undefined);
