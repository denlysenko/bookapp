import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useReadBook } from '@bookapp/react/data-access';

import BookReader from './BookReader/BookReader';
import { useReadBookStyles } from './useReadBookStyles';

export function ReadBook() {
  const classes = useReadBookStyles();
  const currentLocation = useRef<string>();
  const { slug } = useParams();
  const { epubUrl, bookmark, saveReading } = useReadBook(slug);

  useEffect(() => {
    if (epubUrl) {
      return () => {
        saveReading({ epubUrl, bookmark: currentLocation.current });
      };
    }
  }, [epubUrl]);

  const onLocationChange = (location: string) => {
    currentLocation.current = location;
  };

  return (
    <div className={classes.root}>
      <BookReader src={epubUrl} bookmark={bookmark} onLocationChange={onLocationChange} />
    </div>
  );
}

export default ReadBook;
