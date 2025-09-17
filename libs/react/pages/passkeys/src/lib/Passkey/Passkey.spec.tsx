import { fireEvent, render, screen } from '@testing-library/react';

import { Passkey as IPasskey, PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';
import { passkey } from '@bookapp/testing/react';

import Passkey from './Passkey';

const onEdit = jest.fn();
const onDelete = jest.fn();

const mockPasskey: IPasskey = {
  ...passkey,
  publicKey: new Uint8Array([1, 2, 3]),
  userId: 'user1',
  deviceType: 'platform',
  backedUp: true,
  aaguid: 'test-aaguid',
  lastUsedAt: 1757960272049,
};

const mockProvidersMetadata: Record<string, PasskeyProvidersMetadata> = {
  'test-aaguid': {
    name: 'Test Provider',
    icon_light: 'https://example.com/icon-light.png',
    icon_dark: 'https://example.com/icon-dark.png',
  },
};

describe('Passkey', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Passkey
        loading={false}
        passkey={mockPasskey}
        passkeyProvidersMetadata={mockProvidersMetadata}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  describe('Label Display', () => {
    it('should display the correct passkey label', () => {
      render(
        <Passkey
          loading={false}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      expect(screen.getByText(mockPasskey.label)).toBeInTheDocument();
    });

    it('should display passkey label when no metadata is provided', () => {
      render(<Passkey loading={false} passkey={mockPasskey} onEdit={onEdit} onDelete={onDelete} />);

      expect(screen.getByText(mockPasskey.label)).toBeInTheDocument();
    });
  });

  describe('Provider Metadata', () => {
    it('should display provider name when metadata is available', () => {
      render(
        <Passkey
          loading={false}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      expect(screen.getByText('Test Provider')).toBeInTheDocument();
    });

    it('should display provider icon when metadata is available', () => {
      render(
        <Passkey
          loading={false}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      const icon = screen.getByAltText('Test Provider');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', 'https://example.com/icon-light.png');
    });

    it('should not display provider name when metadata is not available', () => {
      render(<Passkey loading={false} passkey={mockPasskey} onEdit={onEdit} onDelete={onDelete} />);

      expect(screen.queryByText('Test Provider')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render edit and delete buttons', () => {
      render(
        <Passkey
          loading={false}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      expect(screen.getByTestId('edit')).toBeInTheDocument();
      expect(screen.getByTestId('delete')).toBeInTheDocument();
    });

    it('should call onEdit with passkey when edit button is clicked', () => {
      render(
        <Passkey
          loading={false}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      fireEvent.click(screen.getByTestId('edit'));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(mockPasskey);
    });

    it('should call onDelete with passkey when delete button is clicked', () => {
      render(
        <Passkey
          loading={false}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      fireEvent.click(screen.getByTestId('delete'));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(mockPasskey);
    });
  });

  describe('Loading State', () => {
    it('should disable action buttons when loading is true', () => {
      render(
        <Passkey
          loading={true}
          passkey={mockPasskey}
          passkeyProvidersMetadata={mockProvidersMetadata}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      expect(screen.getByTestId('edit')).toBeDisabled();
      expect(screen.getByTestId('delete')).toBeDisabled();
    });
  });
});
