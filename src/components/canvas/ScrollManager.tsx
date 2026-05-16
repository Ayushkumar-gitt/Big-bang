import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import { eras } from '../UIOverlay';

export const ScrollManager = () => {
  const scroll = useScroll();
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const setCurrentEra = useStore((state) => state.setCurrentEra);
  const currentEra = useStore((state) => state.currentEra);

  useFrame(() => {
    // scroll.offset is between 0 and 1
    const progress = scroll.offset;
    setScrollProgress(progress);

    // Calculate which era we are in based on scroll progress
    // We have 5 eras (0 to 4), so we divide the scroll into 5 segments
    const segmentSize = 1 / eras.length;
    let newEra = Math.floor(progress / segmentSize);

    // Ensure newEra doesn't exceed bounds
    if (newEra >= eras.length) {
        newEra = eras.length - 1;
    }

    // Smooth transition buffer to avoid flickering
    if (newEra !== currentEra) {
        setCurrentEra(newEra);
    }
  });

  return null;
};
