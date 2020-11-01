import { useState } from 'react';

export const useFileSelector = () => {
  const [open, setOpen] = useState(false);

  const showFileSelector = () => {
    setOpen(true);
  };

  const hideFileSelector = () => {
    setOpen(false);
  };

  return {
    isFileSelectorOpened: open,
    showFileSelector,
    hideFileSelector,
  };
};
