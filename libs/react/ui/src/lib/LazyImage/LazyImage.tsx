import { useEffect, useRef, useState } from 'react';

export const LazyImage = ({ src, placeholder, ...props }) => {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!imgRef.current) {
      return;
    }

    const options = {
      threshold: 0.25,
      rootMargin: '0px 0px 100px 0px',
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(imgRef.current);
        observer.disconnect();
      }
    }, options);

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return <img ref={imgRef} src={inView ? src : placeholder} {...props} alt="img" />;
};
