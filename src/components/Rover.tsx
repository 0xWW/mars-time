import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface RoverProps {
    name: string;
    lat: number;
    lon: number;
    color?: string;
}

export default function Rover({ name, lat, lon, color = '#00ff00' }: RoverProps) {
    // Convert lat/lon to 3D position on a sphere of radius 1 (normalized)
    // Mars radius is approx 3389.5 km, but we scale to 1 unit.
    // Lat: -90 to 90, Lon: -180 to 180

    const position = useMemo(() => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        // Radius slightly > 1 to sit on top of the surface
        const r = 1.01;

        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));

        return new THREE.Vector3(x, y, z);
    }, [lat, lon]);

    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <Html distanceFactor={1.5} position={[0, 0.02, 0]}>
                <div className="bg-black/80 text-white text-[8px] px-1 py-0.5 rounded border border-white/20 whitespace-nowrap backdrop-blur-sm">
                    {name}
                </div>
            </Html>
        </group>
    );
}
