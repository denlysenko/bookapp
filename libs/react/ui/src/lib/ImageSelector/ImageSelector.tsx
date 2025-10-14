import { ChangeEvent, SyntheticEvent, useCallback, useRef, useState } from 'react';

import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Button from '@mui/material/Button';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import LinearProgress from '@mui/material/LinearProgress';

import { useUpload } from '@bookapp/react/data-access';
import { errorsMap } from '@bookapp/shared/constants';
import { getCroppedImg } from '@bookapp/utils/react';

import { useDropZone } from '../dropzone';
import { StyledDialog } from './StyledDialog';

type ImageSelectorProps = {
  open: boolean;
  onImageUpload: (publicUrl: string) => void;
  onClose: () => void;
};

export const ImageSelector = ({ open, onClose, onImageUpload }: ImageSelectorProps) => {
  const imgRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>();
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  const [completedCrop, setCompletedCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [error, setError] = useState(null);
  const { dropElemRef } = useDropZone(onFileDrop);
  const { progress, uploadFile } = useUpload();

  function onSelectFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        setImgSrc(reader.result as string);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function onFileDrop(event: DragEvent) {
    setError(null);
    onSelectFile({
      target: { files: event.dataTransfer.files },
    } as ChangeEvent<HTMLInputElement>);
  }

  const onLoad = useCallback((event: SyntheticEvent<HTMLImageElement, Event>) => {
    imgRef.current = event.target;
    setError(null);
    setReady(true);
  }, []);

  const onError = () => {
    setReady(false);
    setError(errorsMap.INVALID_IMG_ERR);
  };

  const reset = () => {
    setImgSrc(null);
    setCompletedCrop(null);
    setError(null);
    imgRef.current = null;
    setReady(false);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleUpload = async () => {
    if (!imgRef.current) {
      return;
    }

    const img = await getCroppedImg(imgRef.current, completedCrop);

    try {
      setLoading(true);
      const response = await uploadFile(img);
      const { publicUrl } = JSON.parse(response);
      setLoading(false);
      onImageUpload(publicUrl);
      handleClose();
    } catch (err) {
      setLoading(false);
      reset();
      const { message } = JSON.parse(err);
      setError(message);
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
        <ReactCrop
          style={{ display: ready ? 'inline-block' : 'none' }}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        >
          <img
            src={imgSrc}
            onLoad={onLoad}
            onError={onError}
            alt="selected-image"
            data-testid="selected-image"
          />
        </ReactCrop>
        {!ready && (
          <div className="dropzone" ref={dropElemRef}>
            <input type="file" id="file" data-testid="file-input" onChange={onSelectFile} />
            <label className="MuiButtonBase-root" htmlFor="file">
              Click to select
            </label>
            <Icon>add_photo_alternate</Icon>
            or drop file here
            {error && <small className="error">{error}</small>}
          </div>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="contained" onClick={handleClose} data-testid="cancel">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpload} color="secondary" data-testid="upload">
          Upload
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ImageSelector;
