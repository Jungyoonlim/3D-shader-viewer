import { useEffect, useRef, useCallback } from 'react';
import { useSceneStore } from '@/stores/sceneStore';
import * as THREE from 'three';

export const useAnimation = () => {
    const animationFrameRef = useRef<number | undefined>(0);
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

    // Animate demo objects
    const animateObjects = useCallback((time: number) => {
        if (!scene) return;

        const timeInSeconds = time * 0.001;

        scene.traverse((object) => {
            // Animate the demo cube
            if (object.userData.type === 'demo-cube') {
                object.rotation.x = timeInSeconds * 0.5;
                object.rotation.y = timeInSeconds * 0.7;
                object.rotation.z = timeInSeconds * 0.3;

                // Update shader uniforms
                if (object.userData.material && object.userData.material.uniforms) {
                    object.userData.material.uniforms.time.value = timeInSeconds;
                }
            }

            // Animate spheres - floating motion
            if (object instanceof THREE.Mesh && object.geometry.type === 'SphereGeometry') {
                const originalY = object.userData.originalY || object.position.y;
                object.userData.originalY = originalY;
                object.position.y = originalY + Math.sin(timeInSeconds * 2 + object.position.x) * 0.3;
                object.rotation.y = timeInSeconds * 0.4;
            }

            // Animate torus
            if (object instanceof THREE.Mesh && object.geometry.type === 'TorusGeometry') {
                object.rotation.x = Math.PI / 4 + timeInSeconds * 0.2;
                object.rotation.z = timeInSeconds * 0.5;
            }

            // Animate particle system
            if (object.type === 'Points') {
                object.rotation.y = timeInSeconds * 0.1;
                object.rotation.x = Math.sin(timeInSeconds * 0.5) * 0.1;
            }
        });
    }, [scene]);

   // Optimized animation loop
  const animate = useCallback((currentTime: number) => {
    if (!scene || !camera || !renderer || !controls) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Update controls (with damping)
    controls.update();
    
    // Animate objects
    animateObjects(currentTime);
    
    // Update performance stats
    updatePerformanceStats(deltaTime);
    
    // Render scene
    renderer.render(scene, camera);
    
    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [scene, camera, renderer, controls, animateObjects, updatePerformanceStats]);

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