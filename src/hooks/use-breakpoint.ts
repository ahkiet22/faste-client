import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const breakpoints: Record<number, Breakpoint> = {
  0: 'xs', // 0 - 599
  600: 'sm', // 600 - 959
  960: 'md', // 960 - 1279
  1280: 'lg', // 1280 - 1535
  1536: 'xl', // 1536 - 1919
  1920: '2xl', // >= 1920
};

export default function useBreakpoint() {
  const [breakpoint, setBreakPoint] = useState<Breakpoint>('xs');
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    console.log(breakpoint);

    if (windowSize.width < 600) {
      setBreakPoint(breakpoints[0]); // xs
    } else if (windowSize.width < 960) {
      setBreakPoint(breakpoints[600]); // sm
    } else if (windowSize.width < 1280) {
      setBreakPoint(breakpoints[960]); // md
    } else if (windowSize.width < 1536) {
      setBreakPoint(breakpoints[1280]); // lg
    } else if (windowSize.width < 1920) {
      setBreakPoint(breakpoints[1536]); // xl
    } else {
      setBreakPoint(breakpoints[1920]); // 2xl
    }

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize.width]);

  return breakpoint;
}
