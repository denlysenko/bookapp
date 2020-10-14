import { useCallback, useRef } from 'react';

type DropCallback = (event: any) => void;

// it would be easier to create DropZone component rather than custom hook
export function useDropZone(onDrop: DropCallback) {
  const ref = useRef(null);

  const handleDragEnter = () => {
    ref.current.classList.add('highlighted');
  };

  const handleDragLeave = () => {
    ref.current.classList.remove('highlighted');
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    ref.current.classList.remove('highlighted');
    onDrop(event);
  };

  const dropElemRef = useCallback((node) => {
    if (ref.current) {
      ref.current.removeEventListener('dragenter', handleDragEnter);
      ref.current.removeEventListener('dragleave', handleDragLeave);
      ref.current.removeEventListener('dragover', handleDragOver);
      ref.current.removeEventListener('drop', handleDrop);
    }

    if (node !== null) {
      node.addEventListener('dragenter', handleDragEnter);
      node.addEventListener('dragleave', handleDragLeave);
      node.addEventListener('dragover', handleDragOver);
      node.addEventListener('drop', handleDrop);
    }

    ref.current = node;
  }, []);

  return {
    dropElemRef,
  };
}
