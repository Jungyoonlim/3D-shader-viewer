import * as THREE from 'three';

// Basic vertex shader for most effects
export const basicVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Holographic vertex shader with displacement
export const holographicVertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    vec3 pos = position;
    float wave = sin(pos.x * 2.0 + time) * cos(pos.y * 2.0 + time) * 0.05;
    pos += normal * wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Holographic fragment shader
export const holographicFragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    
    float t = time * 0.5;
    vec2 flowUv = uv + vec2(sin(t + uv.y * 5.0) * 0.1, cos(t + uv.x * 3.0) * 0.1);
    float noiseValue = fractalNoise(flowUv * 8.0 + t);
    float fresnel = pow(1.0 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.0);
    
    vec3 color1 = vec3(0.0, 1.0, 1.0);
    vec3 color2 = vec3(1.0, 0.0, 1.0);
    vec3 color3 = vec3(1.0, 1.0, 0.0);
    
    float colorShift = sin(uv.x * 10.0 + t * 2.0) * 0.5 + 0.5;
    vec3 baseColor = mix(color1, color2, colorShift);
    baseColor = mix(baseColor, color3, sin(uv.y * 8.0 + t * 1.5) * 0.5 + 0.5);
    
    vec3 finalColor = baseColor * (0.5 + noiseValue * 0.5) * (0.3 + fresnel * 0.7);
    float scanline = sin(uv.y * 100.0 + t * 10.0) * 0.1 + 0.9;
    finalColor *= scanline;
    float glow = 1.0 - fresnel;
    finalColor += glow * 0.2;
    
    gl_FragColor = vec4(finalColor, 0.8);
  }
`;

// Ripple effect fragment shader
export const rippleFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    
    float ripple = sin(dist * 20.0 - time * 4.0) * 0.5 + 0.5;
    ripple *= 1.0 - smoothstep(0.0, 0.7, dist);
    
    vec3 color = vec3(0.0, 0.5 + ripple * 0.5, 1.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Color cycling fragment shader
export const colorCycleFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    float r = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
    float g = sin(uv.y * 10.0 + time * 1.2) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 8.0 + time * 0.8) * 0.5 + 0.5;
    
    gl_FragColor = vec4(r * 0.5 + 0.3, g * 0.3 + 0.7, b * 0.8 + 0.2, 1.0);
  }
`;

// Shader material factory
export const createShaderMaterial = (
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, { value: unknown }> = {}
): THREE.ShaderMaterial => {
  const defaultUniforms = {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1024, 1024) }
  };

  return new THREE.ShaderMaterial({
    uniforms: { ...defaultUniforms, ...uniforms },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
};

// Predefined shader materials
export const shaderMaterials = {
  holographic: () => createShaderMaterial(holographicVertexShader, holographicFragmentShader),
  ripple: () => createShaderMaterial(basicVertexShader, rippleFragmentShader),
  colorCycle: () => createShaderMaterial(basicVertexShader, colorCycleFragmentShader)
};

export type ShaderType = keyof typeof shaderMaterials; 