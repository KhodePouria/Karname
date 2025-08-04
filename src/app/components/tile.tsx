'use client';
import {motion} from 'framer-motion';

const Tile = () => {
  return (
    <motion.div
      className="aspect-square bg-neutral-50 border-[#e8edf1] border"
      whileHover={{
        backgroundColor: '#90a3c9',
        zIndex: 1,
      }}
      transition={{
        duration: 5,
        ease: 'easeInOut',
      }}
    />
  );
};

export default Tile;
