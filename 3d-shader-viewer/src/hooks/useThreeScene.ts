import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useSceneStore } from '../stores/sceneStore';

export const useThreeScene = (containerRef: React.RefObject<HTMLDivElement>) => {
  const {
    setScene,
    setCamera,
    setRenderer,
    setControls,
    setInitialized,
    setError,
    cleanup
  } = useSceneStore();

  const initializeScene = useCallback((): void => {
    if (!containerRef.current) return;

    try {
      const container = containerRef.current;
      const { clientWidth: width, clientHeight: height } = container;

      // Scene with fog for depth
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
      setScene(scene);

      // High-performance camera setup
      const camera = new THREE.PerspectiveCamera(
        50, // FOV
        width / height, // Aspect
        0.1, // Near
        1000 // Far (optimized for performance)
      );
      camera.position.set(5, 5, 5);
      setCamera(camera);

      // Professional renderer setup (major upgrade from simulation)
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false, // Disable if not needed
        depth: true
      });

      // Performance optimizations
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      
      // Advanced rendering settings (professional touch)
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.physicallyCorrectLights = true;
      
      // Enable extensions for better performance
      renderer.capabilities.logarithmicDepthBuffer = false;
      
      setRenderer(renderer);
      container.appendChild(renderer.domElement);

      // Enhanced controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.03; // Smoother than simulation
      controls.screenSpacePanning = false;
      controls.minDistance = 1;
      controls.maxDistance = 100;
      controls.maxPolarAngle = Math.PI * 0.9; // Prevent going under floor
      
      // Better zoom behavior
      controls.zoomSpeed = 0.6;
      controls.panSpeed = 0.8;
      controls.rotateSpeed = 0.4;
      
      setControls(controls);

      // Professional lighting setup
      setupLighting(scene);

      setInitialized(true);
      console.log('Scene initialized with optimizations');

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Scene initialization failed';
      setError(errorMsg);
      console.error('Scene initialization error:', error);
    }
  }, [containerRef, setScene, setCamera, setRenderer, setControls, setInitialized, setError]);

  // Professional lighting (upgrade from simulation)
  const setupLighting = (scene: THREE.Scene): void => {
    // Ambient light (soft fill)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Key light (main illumination)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(10, 10, 5);
    keyLight.castShadow = true;
    
    // Shadow optimization
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.bias = -0.0001;
    
    scene.add(keyLight);

    // Fill light (softer, opposite side)
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Rim light (dramatic edge lighting)
    const rimLight = new THREE.DirectionalLight(0xffaa88, 0.6);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    // Stylized grid (better than simulation's basic grid)
    const gridHelper = new THREE.GridHelper(
      20, 20, 
      0x00f5ff, // Cyber blue
      0x333333  // Dark gray
    );
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
  };

  // Initialize on mount
  useEffect(() => {
    initializeScene();
    return cleanup;
  }, [initializeScene, cleanup]);

  // Window resize handler
  useEffect(() => {
    const handleResize = (): void => {
      const { camera, renderer } = useSceneStore.getState();
      if (!camera || !renderer || !containerRef.current) return;

      const { clientWidth: width, clientHeight: height } = containerRef.current;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { initializeScene };
};