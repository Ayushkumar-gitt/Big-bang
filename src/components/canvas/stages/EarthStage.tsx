import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../../store/useStore';
import { useTexture } from '@react-three/drei';

export const EarthStage = () => {
    const groupRef = useRef<THREE.Group>(null);
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const moltenRef = useRef<THREE.Mesh>(null);

    const scrollProgress = useStore(state => state.scrollProgress);

    // Load Textures
    const [colorMap, normalMap, specularMap] = useTexture([
        '/assets/textures/earth_color.jpg',
        '/assets/textures/earth_normal.jpg',
        '/assets/textures/earth_specular.jpg'
    ]);

    // Create a glowing molten texture programmatically for the early Earth
    const moltenMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: '#ff3300',
            emissive: '#ff0000',
            emissiveIntensity: 2,
            roughness: 0.8,
            metalness: 0.2,
            transparent: true
        });
    }, []);

    useFrame((state) => {
        if (!groupRef.current || !earthRef.current || !moltenRef.current || !cloudsRef.current) return;

        // Era 3 & 4: Early Earth -> Modern Earth (progress > 0.6)
        const active = scrollProgress > 0.5;
        groupRef.current.visible = active;

        if (active) {
            // Local progress from 0.6 to 1.0 maps to 0 to 1
            const localProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.4));

            // Overall group visibility/fade in
            let groupOpacity = 1;
            if (scrollProgress < 0.7) {
                groupOpacity = (scrollProgress - 0.5) / 0.2;
            }

            // Transition from Molten (Era 3) to Modern (Era 4)
            // localProgress 0 -> 0.5: Molten Earth
            // localProgress 0.5 -> 1.0: Transition to Modern Earth

            let moltenOpacity = 1;
            let modernOpacity = 0;

            if (localProgress > 0.5) {
                const transitionProgress = (localProgress - 0.5) * 2; // 0 to 1
                moltenOpacity = 1 - transitionProgress;
                modernOpacity = transitionProgress;
            }

            // Apply Opacities
            (moltenRef.current.material as THREE.MeshStandardMaterial).opacity = moltenOpacity * groupOpacity;

            const earthMat = earthRef.current.material as THREE.MeshStandardMaterial;
            earthMat.opacity = modernOpacity * groupOpacity;

            const cloudsMat = cloudsRef.current.material as THREE.MeshStandardMaterial;
            cloudsMat.opacity = modernOpacity * 0.5 * groupOpacity; // semi-transparent clouds

            // Rotation
            const time = state.clock.getElapsedTime();
            groupRef.current.rotation.y = time * 0.1;
            cloudsRef.current.rotation.y = time * 0.12; // clouds move slightly faster

            // Camera push-in effect based on scroll
            groupRef.current.position.z = -5 + localProgress * 5; // Move closer to camera
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            {/* Directional light to simulate the Sun for Earth */}
            <directionalLight position={[5, 3, 5]} intensity={2} />

            {/* Molten Early Earth */}
            <mesh ref={moltenRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <primitive object={moltenMaterial} attach="material" />
            </mesh>

            {/* Modern Earth */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    roughnessMap={specularMap}
                    roughness={0.6}
                    metalness={0.1}
                    transparent
                    opacity={0}
                />
            </mesh>

            {/* Clouds */}
            <mesh ref={cloudsRef} scale={1.01}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color="white"
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};
