import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface SceneState { 
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    fps: number;
    drawCalls: number;
    triangles: number;
}

export interface ModelState {
    currentModel: THREE.Object3D | null;
    modelPath: string | null;
    isLoading: boolean;
    loadingProgress: number;
    error: string | null;
}

export interface ShaderPreset { 
    id: string;
    name: string; 
    description: string;
    vertexShader: string;
    fragmentShader: string;
    uniforms: Record<string, THREE.IUniform>;
    preview?: string; 
}

export interface ShaderState { 
    activeShader: string | null;
    availableShaders: ShaderPreset[];
    shaderUniforms: Record<string, any>;
    material: THREE.ShaderMaterial | null;
}