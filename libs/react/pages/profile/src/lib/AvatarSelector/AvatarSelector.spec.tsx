import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { user } from '@bookapp/testing/react';

import AvatarSelector from './AvatarSelector';

const onSave = jest.fn();

describe('AvatarSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AvatarSelector user={user} onSave={onSave} />);
    expect(baseElement).toBeTruthy();
  });

  it('should open ImageSelector', async () => {
    render(<AvatarSelector user={user} onSave={onSave} />);
    fireEvent.click(screen.getByRole('button', { name: /change avatar/i }));
    await waitFor(() => {
      expect(screen.getByText(/select file/i)).toBeInTheDocument();
    });
  });
});
