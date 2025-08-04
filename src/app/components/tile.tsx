'use client';
import {motion} from 'framer-motion';

const Tile = () => {
  return (
    <motion.div
      className="aspect-square bg-neutral-50 border-[#e8edf1] border"
      initial={{
        backgroundColor: '#f8fafc',
      }}
      whileHover={{
        backgroundColor: '#90a3c9',
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
    />
  );
};

export default Tile;
