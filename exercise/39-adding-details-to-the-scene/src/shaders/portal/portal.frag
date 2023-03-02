#include "../perlin"

in vec2 vUv;

uniform float uTime;
uniform vec3 uColorCenter;
uniform vec3 uColorEdge;

const vec2 P_CENTER = vec2(0.5);

void main() {
  vec2 displacedUv = vUv + cnoise(vec3(vUv * 4.2, uTime * 0.3));
  float strength = cnoise(vec3(displacedUv * 4.2, uTime * 0.1));

  // Glow effect on the edge
  float outerGlow = distance(vUv, P_CENTER) * 4.2 - 1.5;
  strength += outerGlow;
  // Sharp step
  strength += step(-0.2, strength) * 0.8;
  // Clamp
  strength = clamp(strength, 0., 1.);
  // Color
  vec3 color = mix(uColorCenter, uColorEdge, strength);
  gl_FragColor = vec4(color, 1.);
}
