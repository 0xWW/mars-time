import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Stars } from '@react-three/drei';
import Rover from './Rover';

export default function MarsGlobe() {
    const meshRef = useRef<any>(null);
    const [hovered, setHover] = useState(false);

    // Load Mars texture
    // Using a reliable public domain texture
    const colorMap = useLoader(TextureLoader, '/mars_1k.jpg');

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Rotate Mars
            // Real rotation is ~24h 37m. We'll make it slow but visible.
            meshRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <>
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 3, 5]} intensity={2.5} />
            <Stars radius={300} depth={50} count={10000} factor={6} saturation={0} fade speed={1} />

            <mesh
                ref={meshRef}
                scale={2.8}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    roughness={0.7}
                    metalness={0.1}
                />

                {/* Rovers */}
                {/* Perseverance: 18.4447° N, 77.4508° E */}
                <Rover name="Perseverance" lat={18.4447} lon={77.4508} color="#00ffff" />

                {/* Curiosity: 4.5895° S, 137.4417° E */}
                <Rover name="Curiosity" lat={-4.5895} lon={137.4417} color="#ff00ff" />

                {/* Opportunity (RIP): 1.9462° S, 354.4734° E (approx -5.5266 W) */}
                <Rover name="Opportunity" lat={-1.9462} lon={-5.5266} color="#aaaaaa" />

                {/* Spirit (RIP): 14.5684° S, 175.4726° E */}
                <Rover name="Spirit" lat={-14.5684} lon={175.4726} color="#aaaaaa" />

                {/* Zhurong: 25.066° N, 109.925° E */}
                <Rover name="Zhurong" lat={25.066} lon={109.925} color="#ff3333" />
            </mesh>
        </>
    );
}
