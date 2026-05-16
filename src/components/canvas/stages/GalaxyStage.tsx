import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../../store/useStore';

export const GalaxyStage = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const scrollProgress = useStore(state => state.scrollProgress);

    const particlesCount = 10000;
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        const color = new THREE.Color();

        for (let i = 0; i < particlesCount; i++) {
            // Galaxy spiral formation
            const radius = Math.random() * 10;
            const spinAngle = radius * 2;
            const branchAngle = ((i % 3) / 3) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;

            positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i * 3 + 1] = randomY;
            positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // Nebula colors (blues and purples)
            color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return [positions, colors];
    }, [particlesCount]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        // Era 1 is Cosmic Inflation & Galaxies (progress roughly 0.2 to 0.4)
        // Let's activate this stage when progress is between 0.1 and 0.5
        const active = scrollProgress > 0.1 && scrollProgress < 0.5;
        pointsRef.current.visible = active;

        if (active) {
            // Map scroll progress to visibility/formation
            const localProgress = (scrollProgress - 0.2) / 0.2; // 0 to 1 in Era 1
            const clampedProgress = Math.max(0, Math.min(1, localProgress));

            // Fade in and out
            let opacity = 0;
            if (clampedProgress < 0.2) opacity = clampedProgress / 0.2;
            else if (clampedProgress > 0.8) opacity = 1 - (clampedProgress - 0.8) / 0.2;
            else opacity = 1;

            (pointsRef.current.material as THREE.PointsMaterial).opacity = opacity;

            // Slow rotation
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            pointsRef.current.rotation.z = 0.2; // slight tilt
        }
    });

    return (
        <points ref={pointsRef} visible={false}>
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
                size={0.02}
                vertexColors
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};
