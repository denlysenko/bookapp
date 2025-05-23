import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useReadBook } from '@bookapp/react/data-access';

import BookReader from './BookReader/BookReader';
import { StyledReadBook } from './StyledReadBook';

export function ReadBook() {
  const currentLocation = useRef<string>('');
  const { slug } = useParams();
  const { epubUrl, bookmark, saveReading } = useReadBook(slug);

  useEffect(() => {
    if (epubUrl) {
      return () => {
        saveReading({ epubUrl, bookmark: currentLocation.current });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epubUrl]);

  const onLocationChange = (location: string) => {
    currentLocation.current = location;
  };

  return (
    <StyledReadBook>
      <BookReader src={epubUrl} bookmark={bookmark} onLocationChange={onLocationChange} />
    </StyledReadBook>
  );
}

export default ReadBook;
