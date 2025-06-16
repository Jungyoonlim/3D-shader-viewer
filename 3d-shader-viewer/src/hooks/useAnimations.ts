import { useEffect, useRef, useCallback } from 'react';
import { useSceneStore } from '@/stores/sceneStore';

export const useAnimation = () => {
    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const fpsRef = useRef<number[]>([]);
    const frameCountRef = useRef<number>(0);

    const { 
        scene,
        camera,
        renderer,
        controls,
        updatePerformance
    } = useSceneStore();

    // Performance monitoring (way better than original)
    const updatePerformanceStats = useCallback((deltaTime: number) => {
        frameCountRef.current++;
        
        // Calculate FPS over last 60 frames
        fpsRef.current.push(1000 / deltaTime);
        if (fpsRef.current.length > 60) {
        fpsRef.current.shift();
        }
        
        // Update stats every 30 frames (avoid UI spam)
        if (frameCountRef.current % 30 === 0 && renderer) {
        const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
        const info = renderer.info;
        
        updatePerformance(
            Math.round(avgFps),
            info.render.calls,
            info.render.triangles
        );
        }
    }, [renderer, updatePerformance]);

   // Optimized animation loop
  const animate = useCallback((currentTime: number) => {
    if (!scene || !camera || !renderer || !controls) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Update controls (with damping)
    controls.update();
    
    // Update performance stats
    updatePerformanceStats(deltaTime);
    
    // Render scene
    renderer.render(scene, camera);
    
    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [scene, camera, renderer, controls, updatePerformanceStats]);

    // Start/stop animation loop
  useEffect(() => {
    if (scene && camera && renderer && controls) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scene, camera, renderer, controls, animate]);

  return {
    isAnimating: !!animationFrameRef.current
  };   
}