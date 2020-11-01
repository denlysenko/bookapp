import React, { useCallback, useEffect, useRef, useState } from 'react';

import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useUpload } from '@bookapp/react/data-access';
import { getCroppedImg } from '@bookapp/utils/react';

import { useDropZone } from '../dropzone';
import { useImageSelectorStyles } from './useImageSelectorStyles';

// tslint:disable-next-line: interface-over-type-literal
type ImageSelectorProps = {
  open: boolean;
  onImageUpload: (publicUrl: string) => void;
  onClose: () => void;
};

// tslint:disable: jsx-no-lambda
export const ImageSelector = ({ open, onClose, onImageUpload }: ImageSelectorProps) => {
  const classes = useImageSelectorStyles();

  const imgRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [upImg, setUpImg] = useState<string>();
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [error, setError] = useState(null);
  const { dropElemRef } = useDropZone(onFileDrop);
  const { progress, uploadFile } = useUpload();

  function onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        setUpImg(reader.result as string);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function onFileDrop(event: any) {
    setError(null);
    onSelectFile({
      target: { files: event.dataTransfer.files },
    });
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img;
    setError(null);
    setReady(true);
  }, []);

  const onError = () => {
    setReady(false);
    setError('INVALID_IMG_ERR');
  };

  const reset = () => {
    setUpImg(null);
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

  useEffect(() => {
    setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
    setCompletedCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  }, [ready]);

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
        <ReactCrop
          style={{ display: ready ? 'inline-block' : 'none' }}
          src={upImg}
          imageAlt="image"
          onImageLoaded={onLoad}
          onImageError={onError}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        />
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
          CANCEL
        </Button>
        <Button variant="contained" onClick={handleUpload} color="secondary" data-testid="upload">
          UPLOAD
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSelector;
