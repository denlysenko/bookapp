import { useState } from 'react';

export const useImageSelector = () => {
  const [open, setOpen] = useState(false);

  const showImageSelector = () => {
    setOpen(true);
  };

  const hideImageSelector = () => {
    setOpen(false);
  };

  return {
    isImageSelectorOpened: open,
    showImageSelector,
    hideImageSelector,
  };
};
