import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../../store/useStore';

export const SolarSystemStage = () => {
    const groupRef = useRef<THREE.Group>(null);
    const sunRef = useRef<THREE.Mesh>(null);
    const diskRef = useRef<THREE.Points>(null);
    const scrollProgress = useStore(state => state.scrollProgress);

    const diskParticlesCount = 5000;
    const [diskPositions, diskColors] = useMemo(() => {
        const positions = new Float32Array(diskParticlesCount * 3);
        const colors = new Float32Array(diskParticlesCount * 3);
        const color = new THREE.Color();

        for (let i = 0; i < diskParticlesCount; i++) {
            const radius = 2 + Math.random() * 5;
            const angle = Math.random() * Math.PI * 2;

            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // thin disk
            positions[i * 3 + 2] = Math.sin(angle) * radius;

            // Orange/Yellow/Red colors for accretion disk
            color.setHSL(0.05 + Math.random() * 0.1, 0.8, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return [positions, colors];
    }, [diskParticlesCount]);

    useFrame((state) => {
        if (!groupRef.current || !sunRef.current || !diskRef.current) return;

        // Era 2 is Solar System (progress roughly 0.4 to 0.6)
        const active = scrollProgress > 0.3 && scrollProgress < 0.7;
        groupRef.current.visible = active;

        if (active) {
            const localProgress = (scrollProgress - 0.4) / 0.2;
            const clampedProgress = Math.max(0, Math.min(1, localProgress));

            // Fade in/out
            let opacity = 0;
            if (clampedProgress < 0.2) opacity = clampedProgress / 0.2;
            else if (clampedProgress > 0.8) opacity = 1 - (clampedProgress - 0.8) / 0.2;
            else opacity = 1;

            (sunRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
            (diskRef.current.material as THREE.PointsMaterial).opacity = opacity;

            // Spin the disk
            diskRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

            // Bring group closer as it forms
            groupRef.current.scale.setScalar(1 + clampedProgress);
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            {/* Proto-Sun */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color="#ffcc00" transparent opacity={0} />
            </mesh>

            {/* Accretion Disk */}
            <points ref={diskRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={diskParticlesCount}
                        array={diskPositions}
                        itemSize={3}
                        args={[diskPositions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={diskParticlesCount}
                        array={diskColors}
                        itemSize={3}
                        args={[diskColors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    vertexColors
                    transparent
                    opacity={0}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
};
