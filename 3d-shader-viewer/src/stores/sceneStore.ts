import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface SceneState { 
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;

    // State 
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;

    // Perf Tracking
    fps: number; 
    drawCalls: number; 
    triangles: number;

    // Actions
    setScene: (scene: THREE.Scene) => void;
    setCamera: (camera: THREE.PerspectiveCamera) => void;
    setRenderer: (renderer: THREE.WebGLRenderer) => void;
    setControls: (controls: OrbitControls) => void; 
    setInitialized: (initialized: boolean) => void; 
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updatePerformance: (fps: number, drawCalls: number, triangles: number) => void;
    cleanUp: () => void;
}

export const useSceneStore = create<SceneState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    isInitialized: false,
    isLoading: false,
    error: null,
    fps: 0,
    drawCalls: 0,
    triangles: 0,

    // Actions
    setScene: (scene) => set({ scene }),
    setCamera: (camera) => set({ camera }),
    setRenderer: (renderer) => set({ renderer }),
    
)



