import { Canvas } from '@react-three/fiber';
import { ScrollControls, Stars, OrbitControls } from '@react-three/drei';
import { ScrollManager } from './ScrollManager';
import { UniverseStages } from './UniverseStages';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />

      {/* Background Stars that slowly drift */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Allow user to look around with the mouse */}
      <OrbitControls enableZoom={false} enablePan={false} />

      {/* Scroll controls to drive the animation, setting pages dictates the height of the scrollable area */}
      <ScrollControls pages={5} damping={0.25}>
        <ScrollManager />
        <UniverseStages />
      </ScrollControls>

      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
};
