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

    const updatePerformanceStats = useCallback((deltatime: number) => {
        
    })

    
}