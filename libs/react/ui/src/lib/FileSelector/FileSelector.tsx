import React, { useReducer } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useUpload } from '@bookapp/react/data-access';

import { isNil } from 'lodash';

import { useDropZone } from '../dropzone';
import { useFileSelectorStyles } from './useFileSelectorStyles';
import { initialState, reducer } from './reducer';
import { FileSelectorActionTypes } from './actions';

export interface FileSelectorProps {
  open: boolean;
  onFileUpload: (publicUrl: string) => void;
  onClose: () => void;
}

export const FileSelector = ({ open, onClose, onFileUpload }: FileSelectorProps) => {
  const classes = useFileSelectorStyles();

  const [{ loading, file, error }, dispatch] = useReducer(reducer, initialState);
  const { dropElemRef } = useDropZone(onFileDrop);
  const { progress, uploadFile } = useUpload();

  function onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      dispatch({
        type: FileSelectorActionTypes.SELECT_FILE,
        payload: event.target.files[0],
      });
    }
  }

  function onFileDrop(event: any) {
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
    if (isNil(file)) {
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
    <Dialog className={classes.root} open={open} onClose={handleClose}>
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
        <Button variant="contained" onClick={handleClose} data-testid="cancel">
          CANCEL
        </Button>
        <Button variant="contained" onClick={handleUpload} color="secondary" data-testid="upload">
          UPLOAD
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileSelector;
