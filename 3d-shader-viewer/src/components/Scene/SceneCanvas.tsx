import React, { useRef, memo } from 'react';
import { useThreeScene } from '../../hooks/useThreeScene';
import { useAnimation } from '../../hooks/useAnimations';

interface SceneCanvasProps {
  className?: string;
}

export const SceneCanvas = memo<SceneCanvasProps>(({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  
  // Initialize Three.js scene
  useThreeScene(containerRef);
  
  // Start animation loop
  const { isAnimating } = useAnimation();

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ touchAction: 'none' }} // Prevent mobile scroll interference
    >
      {/* Performance indicator (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 glass-panel p-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="ml-2">{isAnimating ? 'Rendering' : 'Paused'}</span>
        </div>
      )}
    </div>
  );
});

SceneCanvas.displayName = 'SceneCanvas';