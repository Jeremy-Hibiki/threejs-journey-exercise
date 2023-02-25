uniform vec3 u_depthColor;
uniform vec3 u_surfaceColor;

uniform float u_mixColorOffset;
uniform float u_mixColorMultiplier;

varying float v_elevation;

void main() {
  float mixAlpha = v_elevation * u_mixColorMultiplier + u_mixColorOffset;
  vec3 color = mix(u_depthColor, u_surfaceColor, mixAlpha);
  gl_FragColor = vec4(color, 1.);
}
