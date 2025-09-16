import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { usePasskeys } from '@bookapp/react/data-access';
import { ConfirmDialog, useFeedback } from '@bookapp/react/ui';
import { Passkey as IPasskey, PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';

import EditPasskeyDialog from './EditPasskeyDialog/EditPasskeyDialog';
import Passkey from './Passkey/Passkey';
import { StyledPasskeys } from './StyledPasskeys';

export function Passkeys() {
  const [metadata, setMetadata] = useState<Record<string, PasskeyProvidersMetadata>>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<IPasskey | null>(null);
  const [adding, setAdding] = useState(false);
  const {
    passkeys,
    loading,
    isSupported,
    updatePasskey,
    updating,
    deleting,
    deletePasskey,
    addPasskey,
  } = usePasskeys();
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetch('/aaguids.json')
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch(() => setMetadata(null));
  }, []);

  const onAddPasskey = async () => {
    setAdding(true);

    try {
      await addPasskey();
      showFeedback('Passkey added');
    } catch (errors) {
      showFeedback(errors[errors.length - 1].message);
    } finally {
      setAdding(false);
    }
  };

  const onEditPasskey = (passkey: IPasskey) => {
    setSelectedPasskey(passkey);
    setOpenEditDialog(true);
  };

  const onDeletePasskey = (passkey: IPasskey) => {
    setSelectedPasskey(passkey);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = async (result: boolean) => {
    setOpenConfirmDialog(false);

    if (result) {
      try {
        await deletePasskey(selectedPasskey.id);
        showFeedback('Passkey deleted');
      } catch (errors) {
        showFeedback(errors[errors.length - 1].message);
      }
    }
  };

  const handleCloseEditDialog = async (result?: string) => {
    setOpenEditDialog(false);

    if (result) {
      try {
        await updatePasskey(selectedPasskey.id, result);
        showFeedback('Passkey updated');
      } catch (errors) {
        showFeedback(errors[errors.length - 1].message);
      }
    }
  };

  return (
    <StyledPasskeys className="view-content">
      <Card>
        <CardHeader title="Passkeys" />
        <CardContent>
          {isSupported ? (
            loading ? null : (
              passkeys.rows.map((passkey) => (
                <Passkey
                  key={passkey.id}
                  passkey={passkey}
                  loading={updating || deleting || adding}
                  passkeyProvidersMetadata={metadata}
                  onEdit={onEditPasskey}
                  onDelete={onDeletePasskey}
                />
              ))
            )
          ) : (
            <p>Your browser does not support passkeys.</p>
          )}
        </CardContent>

        {isSupported && (
          <CardActions>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              disabled={loading || updating || deleting || adding}
              onClick={onAddPasskey}
              data-testid="add"
            >
              Add
            </Button>
          </CardActions>
        )}
      </Card>

      {openConfirmDialog && (
        <ConfirmDialog
          open={true}
          onClose={handleCloseConfirmDialog}
          message={`Are you sure you want to delete passkey ${selectedPasskey?.label}?`}
        />
      )}

      {openEditDialog && (
        <EditPasskeyDialog
          open={true}
          onClose={handleCloseEditDialog}
          label={selectedPasskey?.label}
        />
      )}
    </StyledPasskeys>
  );
}

export default Passkeys;
