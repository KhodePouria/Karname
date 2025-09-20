'use client';
import dynamic from 'next/dynamic';

const Features = dynamic(() => import('./features'), {ssr: false});

export default Features;
