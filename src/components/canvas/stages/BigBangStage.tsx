import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../../store/useStore';

export const BigBangStage = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const scrollProgress = useStore(state => state.scrollProgress);

    const particlesCount = 5000;
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        const color = new THREE.Color();

        for (let i = 0; i < particlesCount; i++) {
            // Initial position is very close to center
            const x = (Math.random() - 0.5) * 0.1;
            const y = (Math.random() - 0.5) * 0.1;
            const z = (Math.random() - 0.5) * 0.1;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            color.setHSL(Math.random() * 0.2 + 0.5, 1.0, 0.5); // Hot colors
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return [positions, colors];
    }, [particlesCount]);

    useFrame(() => {
        if (!pointsRef.current) return;

        // Era 0 is Big Bang (progress 0 to 0.2)
        // We calculate a local progress for this stage
        const localProgress = Math.max(0, Math.min(1, scrollProgress / 0.2));

        // Expansion effect
        const scale = 1 + localProgress * 50;
        pointsRef.current.scale.set(scale, scale, scale);

        // Fade out as we approach the next era
        const opacity = localProgress < 0.8 ? 1 : 1 - ((localProgress - 0.8) * 5);
        (pointsRef.current.material as THREE.PointsMaterial).opacity = opacity;

        pointsRef.current.rotation.y += 0.005;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesCount}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particlesCount}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};
