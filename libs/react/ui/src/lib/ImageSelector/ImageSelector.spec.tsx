import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { HTTP_STATUS } from '@bookapp/shared/constants';

import ImageSelector from './ImageSelector';

jest.mock('@bookapp/utils', () => ({
  getCroppedImg: jest.fn(() => Promise.resolve('userAvatar')),
}));

const onClose = jest.fn();
const onImageUpload = jest.fn();
const publicUrl = 'publicUrl';

function mockFetch(status: number, data: any) {
  const xhrMockObj = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    readyState: 4,
    status,
    response: JSON.stringify(data),
  };

  const xhrMockClass = () => xhrMockObj;

  // @ts-ignore
  window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

  setTimeout(() => {
    // @ts-ignore
    xhrMockObj['onreadystatechange']();
  }, 0);
}

describe('ImageSelector', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <ImageSelector open={true} onClose={onClose} onImageUpload={onImageUpload} />
    );
    expect(baseElement).toBeTruthy();
  });

  describe('close', () => {
    it('should call onClose prop', () => {
      render(<ImageSelector open={true} onClose={onClose} onImageUpload={onImageUpload} />);

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toBeCalledTimes(1);
    });
  });

  describe('upload', () => {
    it('should upload file', async () => {
      render(<ImageSelector open={true} onClose={onClose} onImageUpload={onImageUpload} />);

      const file = new File(['userAvatar'], 'avatar.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/click to select/i);

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      fireEvent.change(fileInput);

      await waitFor(() => screen.getByAltText('image'));

      fireEvent.click(screen.getByRole('button', { name: /upload/i }));

      mockFetch(HTTP_STATUS.OK, { publicUrl });

      await waitFor(() => {
        expect(onImageUpload).toBeCalledWith(publicUrl);
      });

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
