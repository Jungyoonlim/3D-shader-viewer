'use client';

import { SceneCanvas } from '@/components/Scene/SceneCanvas';
import { useSceneStore } from '@/stores/sceneStore';

export default function Home() {
  const { fps, drawCalls, triangles, error, isInitialized } = useSceneStore();

  return (
    <div className="h-screen w-full bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-white">3D Shader Viewer</h1>
          
          {/* Performance Stats */}
          {isInitialized && (
            <div className="flex gap-4 text-sm text-gray-300">
              <span>FPS: {fps}</span>
              <span>Calls: {drawCalls}</span>
              <span>Tris: {triangles}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main 3D Scene */}
      <main className="h-full pt-16">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400 text-center">
              <h2 className="text-xl mb-2">Scene Error</h2>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <SceneCanvas className="h-full" />
        )}
      </main>

      {/* Controls Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 px-6 py-3">
            <div className="flex gap-4 text-sm text-gray-300">
              <span>Left click + drag: Rotate</span>
              <span>Right click + drag: Pan</span>
              <span>Scroll: Zoom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
