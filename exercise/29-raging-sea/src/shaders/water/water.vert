#include ./perlin.glsl

uniform float u_time;

uniform float u_bigWavesElevation;
uniform vec2 u_bigWavesFrequency;
uniform float u_bigWavesSpeed;

uniform float u_smallWavesElevation;
uniform float u_smallWavesFrequency;
uniform float u_smallWavesSpeed;
uniform float u_smallWavesIterationNum;

varying float v_elevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.);

  float elevation = sin(modelPosition.x * u_bigWavesFrequency.x + u_time * u_bigWavesSpeed);
  elevation *= sin(modelPosition.z * u_bigWavesFrequency.y + u_time * u_bigWavesSpeed);
  elevation *= u_bigWavesElevation;

#pragma unroll_loop_start
  for(float i = 1.; i <= u_smallWavesIterationNum; i++) {
    elevation -= abs(cnoise(vec3(modelPosition.xz * u_smallWavesFrequency * i, u_time * u_smallWavesSpeed)) * u_smallWavesElevation / i);
  }
#pragma unroll_loop_end

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  v_elevation = elevation;
}
