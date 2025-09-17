import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

import { StyledDialog } from './StyledDialog';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: (result: boolean) => void;
  message: string;
}

export const ConfirmDialog = ({ open, onClose, message }: ConfirmDialogProps) => {
  return (
    <StyledDialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Confirmation</DialogTitle>
      <Divider />
      <DialogContent>{message}</DialogContent>
      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => onClose(false)}
          disableElevation
          data-testid="cancel"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => onClose(true)}
          color="primary"
          disableElevation
          data-testid="confirm"
        >
          Confirm
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ConfirmDialog;
