import { useContext } from 'react';
import { FeedbackContext } from './feedback.context';

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }

  return context;
}
