import { ChangeEvent, useReducer } from 'react';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import LinearProgress from '@mui/material/LinearProgress';

import { useUpload } from '@bookapp/react/data-access';
import {
  FileSelectorActionTypes,
  fileSelectorReducer,
  initialFileSelectorState,
} from '@bookapp/react/state';

import { useDropZone } from '../dropzone';
import { StyledDialog } from './StyledDialog';

export interface FileSelectorProps {
  open: boolean;
  onFileUpload: (publicUrl: string) => void;
  onClose: () => void;
}

export const FileSelector = ({ open, onClose, onFileUpload }: FileSelectorProps) => {
  const [{ loading, file, error }, dispatch] = useReducer(
    fileSelectorReducer,
    initialFileSelectorState
  );
  const { dropElemRef } = useDropZone(onFileDrop);
  const { progress, uploadFile } = useUpload();

  function onSelectFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      dispatch({
        type: FileSelectorActionTypes.SELECT_FILE,
        payload: event.target.files[0],
      });
    }
  }

  function onFileDrop(event: DragEvent) {
    dispatch({
      type: FileSelectorActionTypes.SELECT_FILE,
      payload: event.dataTransfer.files[0],
    });
  }

  const reset = () => {
    dispatch({ type: FileSelectorActionTypes.RESET });
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    try {
      dispatch({ type: FileSelectorActionTypes.START_LOADING });
      const response = await uploadFile(file);
      const { publicUrl } = JSON.parse(response);
      dispatch({ type: FileSelectorActionTypes.STOP_LOADING });
      onFileUpload(publicUrl);
      handleClose();
    } catch (err) {
      dispatch({ type: FileSelectorActionTypes.STOP_LOADING });
      reset();
      const { message } = JSON.parse(err);
      dispatch({
        type: FileSelectorActionTypes.SET_ERROR,
        payload: message,
      });
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle>Select File</DialogTitle>
      <Divider />
      <DialogContent>
        {loading && (
          <div className="progress">
            <LinearProgress color="secondary" variant="determinate" value={progress} />
          </div>
        )}
        {!file && (
          <div className="dropzone" ref={dropElemRef}>
            <input type="file" id="file" data-testid="file-input" onChange={onSelectFile} />
            <label className="MuiButtonBase-root" htmlFor="file">
              Click to select
            </label>
            <Icon>add_box</Icon>
            or drop file here
            {error && <small className="error">{error}</small>}
          </div>
        )}
        {file && (
          <div className="attachment">
            <Icon>attach_file</Icon>
            <span>{file.name}</span>
          </div>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="contained" onClick={handleClose} disableElevation data-testid="cancel">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          color="secondary"
          disableElevation
          data-testid="upload"
        >
          Upload
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default FileSelector;
