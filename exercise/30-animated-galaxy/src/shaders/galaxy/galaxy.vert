uniform float u_time;
uniform float u_size;

in float a_scale;
in vec3 a_randomness;

out vec3 v_color;

const vec2 P_CENTER = vec2(0.);

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.);

  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = distance(modelPosition.xz, P_CENTER);
  float spinAngle = angle + 1. / distanceToCenter * u_time * 0.2;

  modelPosition.x = cos(spinAngle) * distanceToCenter;
  modelPosition.z = sin(spinAngle) * distanceToCenter;

  modelPosition.xyz += a_randomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  gl_PointSize = u_size * a_scale;
  gl_PointSize *= 1. / -viewPosition.z;

  v_color = color;
}
