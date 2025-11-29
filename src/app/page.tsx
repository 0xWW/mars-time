'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import MarsGlobe from '@/components/MarsGlobe';
import MarsTimeDisplay from '@/components/MarsTimeDisplay';
import RoverCard from '@/components/RoverCard';
import { ROVERS } from '@/utils/marsTime';

export default function Home() {
  return (
    <main className="fixed inset-0 w-screen h-screen bg-black overflow-hidden m-0 p-0">
      {/* UI Overlay - Fixed on top */}
      <div className="fixed top-0 left-0 w-full h-full z-20 pointer-events-none overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center py-12 gap-12">
          <div className="w-full">
            <MarsTimeDisplay />
          </div>

          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {ROVERS.map((rover) => (
                <RoverCard key={rover.name} rover={rover} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene - Fixed background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 8.0], fov: 45 }}>
          <Suspense fallback={null}>
            <MarsGlobe />
            <OrbitControls
              makeDefault
              enablePan={false}
              minDistance={3.0}
              maxDistance={12}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>

      <Loader />
    </main>
  );
}
