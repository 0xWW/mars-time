'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import MarsGlobe from '@/components/MarsGlobe';
import MarsTimeDisplay from '@/components/MarsTimeDisplay';

export default function Home() {
  return (
    <main className="fixed inset-0 w-screen h-screen bg-black overflow-hidden m-0 p-0">
      {/* UI Overlay - Fixed on top */}
      <div className="fixed top-0 left-0 w-full h-full z-20 pointer-events-none">
        <MarsTimeDisplay />
      </div>



      {/* 3D Scene - Fixed background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 4.0], fov: 45 }}>
          <Suspense fallback={null}>
            <MarsGlobe />
            <OrbitControls
              makeDefault
              enablePan={false}
              minDistance={3.0}
              maxDistance={10}
              autoRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      <Loader />
    </main>
  );
}
