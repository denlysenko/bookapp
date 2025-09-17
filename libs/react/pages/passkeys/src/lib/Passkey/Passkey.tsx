import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Passkey as IPasskey, PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';
import { formatDate } from '@bookapp/utils/react';

import { StyledPasskey } from './StyledPasskey';

export interface PasskeyProps {
  loading: boolean;
  passkey: IPasskey;
  passkeyProvidersMetadata?: Record<string, PasskeyProvidersMetadata>;
  onEdit: (passkey: IPasskey) => void;
  onDelete: (passkey: IPasskey) => void;
}

export function Passkey({
  loading,
  passkey,
  passkeyProvidersMetadata,
  onEdit,
  onDelete,
}: PasskeyProps) {
  const providerMetadata = passkeyProvidersMetadata?.[passkey.aaguid];

  return (
    <StyledPasskey>
      <div className="passkey-icon">
        {providerMetadata?.icon_light && (
          <img
            src={passkeyProvidersMetadata[passkey.aaguid].icon_light}
            alt={passkeyProvidersMetadata[passkey.aaguid].name}
          />
        )}
      </div>

      <div className="passkey-info">
        <p className="header">{passkey.label}</p>
        {providerMetadata?.name && <p className="cell">{providerMetadata.name}</p>}
      </div>

      <div className="passkey-info">
        <p className="header">Last Used</p>
        <p className="cell">{passkey.lastUsedAt && formatDate(passkey.lastUsedAt)}</p>
      </div>

      <div className="passkey-actions">
        <Tooltip title="Edit Passkey">
          <span>
            <IconButton
              color="default"
              disabled={loading}
              onClick={() => onEdit(passkey)}
              data-testid="edit"
            >
              <Icon color="action">edit</Icon>
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Delete Passkey">
          <span>
            <IconButton
              color="error"
              disabled={loading}
              onClick={() => onDelete(passkey)}
              data-testid="delete"
            >
              <Icon color="error">delete</Icon>
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </StyledPasskey>
  );
}

export default Passkey;
