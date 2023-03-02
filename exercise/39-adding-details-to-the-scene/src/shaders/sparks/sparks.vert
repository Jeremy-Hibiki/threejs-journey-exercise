uniform float uTime;
uniform float uPixelRatio;
uniform float uPointSize;

in float aScale;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.);

  modelPosition.y += sin(modelPosition.x * 100. + uTime) * aScale / 5. - 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  gl_PointSize = uPointSize * aScale * uPixelRatio;
  gl_PointSize /= -viewPosition.z;
}
