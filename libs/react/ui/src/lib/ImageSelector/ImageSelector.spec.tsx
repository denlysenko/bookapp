import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { HTTP_STATUS } from '@bookapp/shared/constants';
import ImageSelector from './ImageSelector';

jest.mock('@bookapp/utils/react', () => ({
  getCroppedImg: jest.fn(() => Promise.resolve('userAvatar')),
}));

const onClose = jest.fn();
const onImageUpload = jest.fn();
const publicUrl = 'publicUrl';

function mockFetch(status: number, data: unknown) {
  const xhrMockObj = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    readyState: 4,
    status,
    response: JSON.stringify(data),
  };

  // @ts-expect-error mock XMLHttpRequest
  window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMockObj);

  setTimeout(() => {
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

      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });

      // await waitFor(() => expect(screen.getByAltText('selected-image')).toBeVisible());

      await act(async () => {
        const img = screen.getByAltText('selected-image');
        fireEvent.load(img);
      });

      fireEvent.click(screen.getByRole('button', { name: /upload/i }));

      mockFetch(HTTP_STATUS.OK, { publicUrl });

      await waitFor(() => {
        expect(onImageUpload).toBeCalledWith(publicUrl);
      });

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
