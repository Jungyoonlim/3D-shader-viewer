import { useEffect, useRef, useCallback } from 'react';
import { useSceneStore } from '@/stores/sceneStore';

export const useAnimation = () => {
    const animationFrameRef = useRef<number>();
    
}