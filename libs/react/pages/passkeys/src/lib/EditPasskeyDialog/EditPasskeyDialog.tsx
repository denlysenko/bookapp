import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import { ERRORS } from '@bookapp/shared/constants';
import { getFormikError } from '@bookapp/utils/react';

import { StyledDialog } from './StyledDialog';

export interface EditPasskeyDialogProps {
  label: string;
  open: boolean;
  onClose: (value?: string) => void;
}

const EditPasskeySchema = Yup.object().shape({
  label: Yup.string().required(ERRORS.REQUIRED_FIELD),
});

export const EditPasskeyDialog = ({ open, label, onClose }: EditPasskeyDialogProps) => {
  const formik = useFormik({
    initialValues: {
      label: label ?? '',
    },
    validationSchema: EditPasskeySchema,
    onSubmit: (values) => {
      onClose(values.label);
    },
  });

  const labelError = getFormikError<{ label: string }>('label', {
    touched: formik.touched,
    errors: formik.errors,
  });

  return (
    <StyledDialog open={open} onClose={() => onClose()}>
      <DialogTitle>Edit passkey</DialogTitle>
      <Divider />
      <DialogContent>
        <form id="edit-passkey-form" noValidate={true} onSubmit={formik.handleSubmit}>
          <TextField
            type="text"
            name="label"
            label="Label"
            variant="outlined"
            required={true}
            margin="none"
            error={!!labelError}
            helperText={labelError}
            value={formik.values.label}
            onChange={formik.handleChange}
          />
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose()} disableElevation data-testid="cancel">
          Cancel
        </Button>

        <Button
          form="edit-passkey-form"
          variant="contained"
          type="submit"
          color="primary"
          disableElevation
          data-testid="save"
        >
          Save
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditPasskeyDialog;
