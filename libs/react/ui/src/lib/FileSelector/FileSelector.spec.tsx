import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { HTTP_STATUS } from '@bookapp/shared/constants';

import FileSelector from './FileSelector';

const onClose = jest.fn();
const onFileUpload = jest.fn();
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

  const xhrMockClass = () => xhrMockObj;

  // @ts-expect-error mock XMLHttpRequest
  window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

  setTimeout(() => {
    xhrMockObj['onreadystatechange']();
  }, 0);
}

describe('FileSelector', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <FileSelector open={true} onClose={onClose} onFileUpload={onFileUpload} />
    );
    expect(baseElement).toBeTruthy();
  });

  describe('close', () => {
    it('should call onClose prop', () => {
      render(<FileSelector open={true} onClose={onClose} onFileUpload={onFileUpload} />);

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toBeCalledTimes(1);
    });
  });

  describe('upload', () => {
    it('should upload file', async () => {
      render(<FileSelector open={true} onClose={onClose} onFileUpload={onFileUpload} />);

      const file = new File(['bookEpub'], 'book.epub', { type: 'application/epub+zip' });
      const fileInput = screen.getByLabelText(/click to select/i);

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      fireEvent.change(fileInput);

      mockFetch(HTTP_STATUS.OK, { publicUrl });

      fireEvent.click(screen.getByRole('button', { name: /upload/i }));

      await waitFor(() => {
        expect(onFileUpload).toBeCalledWith(publicUrl);
      });

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
