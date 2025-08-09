'use client';
import Lenis from 'lenis';
import {useEffect} from 'react';

export default function LenisComponent() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    // Listen for the scroll event and log the event data
    lenis.on('scroll', (e: unknown) => {
      console.log(e);
    });

    // Optional: cleanup if needed
    return () => {
      lenis.destroy?.();
    };
  }, []);

  return null;
}
