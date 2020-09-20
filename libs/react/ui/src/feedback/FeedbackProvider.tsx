import React, { useCallback, useMemo, useState } from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import { FeedbackContext } from './feedback.context';

// tslint:disable-next-line: interface-over-type-literal
type FeedbackProviderProps = { children: React.ReactNode };

const config = {
  position: {
    vertical: 'top' as 'top',
    horizontal: 'right' as 'right',
  },
  autoHideDuration: 3000,
};

export const FeedbackProvider = ({ children }: FeedbackProviderProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showFeedback = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setMessage('');
    setOpen(false);
  };

  const value = useMemo(() => ({ showFeedback }), [showFeedback]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: config.position.vertical,
          horizontal: config.position.horizontal,
        }}
        autoHideDuration={config.autoHideDuration}
        open={open}
        onClose={handleClose}
        message={message}
      />
    </FeedbackContext.Provider>
  );
};
