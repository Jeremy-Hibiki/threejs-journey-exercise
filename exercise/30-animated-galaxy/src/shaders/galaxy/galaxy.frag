in vec3 v_color;

const vec2 P_CENTER = vec2(0.5);

void main() {
  // // Disc
  // float strength = distance(gl_PointCoord, P_CENTER);
  // strength = 1. - step(0.4, strength);

  // // Diffused Point (Linear Diffusion)
  // float strength = distance(gl_PointCoord, P_CENTER);
  // strength *= 2.;
  // strength = 1. - strength;

  // Light (Non-linear Diffusion)
  float strength = distance(gl_PointCoord, P_CENTER);
  strength = 1. - strength;
  strength = pow(strength, 10.);

  vec3 mixedColor = mix(vec3(0.), v_color, strength);

  gl_FragColor = vec4(mixedColor, 1.);
}
