uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Noise function for texture variation
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Improved noise function
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

// Fractal noise
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
    
    // Time-based animation
    float t = time * 0.5;
    
    // Create flowing patterns
    vec2 flowUv = uv + vec2(sin(t + uv.y * 5.0) * 0.1, cos(t + uv.x * 3.0) * 0.1);
    
    // Fractal noise for organic patterns
    float noiseValue = fractalNoise(flowUv * 8.0 + t);
    
    // Holographic color shift based on viewing angle
    float fresnel = pow(1.0 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.0);
    
    // Color cycling through the spectrum
    vec3 color1 = vec3(0.0, 1.0, 1.0); // Cyan
    vec3 color2 = vec3(1.0, 0.0, 1.0); // Magenta
    vec3 color3 = vec3(1.0, 1.0, 0.0); // Yellow
    
    // Create color shifting based on position and time
    float colorShift = sin(uv.x * 10.0 + t * 2.0) * 0.5 + 0.5;
    vec3 baseColor = mix(color1, color2, colorShift);
    baseColor = mix(baseColor, color3, sin(uv.y * 8.0 + t * 1.5) * 0.5 + 0.5);
    
    // Apply noise and fresnel
    vec3 finalColor = baseColor * (0.5 + noiseValue * 0.5) * (0.3 + fresnel * 0.7);
    
    // Add scanline effect
    float scanline = sin(uv.y * 100.0 + t * 10.0) * 0.1 + 0.9;
    finalColor *= scanline;
    
    // Add glow effect
    float glow = 1.0 - fresnel;
    finalColor += glow * 0.2;
    
    gl_FragColor = vec4(finalColor, 0.8);
} 