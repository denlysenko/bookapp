import { useCallback, useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
}
// based on https://medium.com/@swatisucharita94/react-infinite-scroll-with-intersection-observer-api-db3998e52d63
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ children, onLoadMore }) => {
  const anchor = useRef<HTMLDivElement>(null);

  const callback = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        onLoadMore();
      }
    },
    [onLoadMore]
  );

  useEffect(() => {
    if (!anchor.current) {
      return;
    }

    const options = {
      root: null,
    };

    const observer = new IntersectionObserver(callback, options);

    observer.observe(anchor.current);

    return () => observer.disconnect();
  }, [callback]);

  return (
    <>
      {children}
      <div ref={anchor} />
    </>
  );
};
