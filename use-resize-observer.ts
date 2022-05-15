import { useState, useEffect, useRef } from 'react';

const useResizeObserver = (option = 'contentRect') => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();

  function handleResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      if (
        option === 'borderBoxSize' &&
        entry.borderBoxSize &&
        entry.borderBoxSize.length > 0
      ) {
        setHeight(entry.borderBoxSize[0].blockSize);
        setWidth(entry.borderBoxSize[0].inlineSize);
      } else if (
        option === 'contentBoxSize' &&
        entry.contentBoxSize &&
        entry.contentBoxSize.length > 0
      ) {
        setHeight(entry.contentBoxSize[0].blockSize);
        setWidth(entry.contentBoxSize[0].inlineSize);
      } else {
        setHeight(entry.contentRect.height);
        setWidth(entry.contentRect.width);
      }
    }
  }

  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) => {
        handleResize(entries);
      });
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }

    // Added this return for eslint rule -> no-consisten-return
    return undefined;
  });

  return { ref, width, height };
};

export default useResizeObserver;
