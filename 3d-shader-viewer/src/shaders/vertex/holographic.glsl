uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    // Apply some subtle vertex displacement for organic movement
    vec3 pos = position;
    
    // Add wave displacement
    float wave = sin(pos.x * 2.0 + time) * cos(pos.y * 2.0 + time) * 0.05;
    pos += normal * wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
} 