const vec2 P_CENTER = vec2(0.5);

void main() {
  float distanceToCenter = distance(gl_PointCoord, P_CENTER);
  float strength = 0.05 / distanceToCenter - 0.1;

  vec4 color = vec4(1., 0.4, 0.2, strength);
  gl_FragColor = color;
}
