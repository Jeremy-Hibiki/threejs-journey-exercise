varying vec2 vUv;

/**
* @see https://thebookofshaders.com/10/
*/
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 src, float degree, vec2 pivot) {
  float radian = radians(degree);
  return vec2( //
  cos(radian) * (src.x - pivot.x) + sin(radian) * (src.y - pivot.y) + pivot.x, // X
  cos(radian) * (src.y - pivot.y) - sin(radian) * (src.x - pivot.x) + pivot.y  // Y
  );
}

/**
* 2D Perlin Noise
* @see https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
*/
vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

const vec2 P_CENTER = vec2(0.5);

void main() {
  // // Pattern 1
  // gl_FragColor = vec4(vUv, 1., 1.);

  // // Pattern 2
  // gl_FragColor = vec4(vUv, 0., 1.);

  // // Pattern 3
  // float strength = vUv.x;
  // // Or
  // gl_FragColor = vec4(vUv.xxx, 1.);

  // // Pattern 4
  // float strength = vUv.y;

  // // Pattern 5
  // float strength = 1. - vUv.y;

  // // Pattern 6
  // float strength = vUv.y * 10.;

  // // Pattern 7
  // float strength = mod(vUv.y * 10., 1.);

  // // Pattern 8
  // float strength = mod(vUv.y * 10., 1.);
  // strength = step(0.5, strength);

  // // Pattern 9
  // float strength = mod(vUv.y * 10., 1.);
  // strength = step(0.8, strength);

  // // Pattern 10
  // float strength = mod(vUv.x * 10., 1.);
  // strength = step(0.8, strength);

  // // Pattern 11
  // float strength = step(0.8, mod(vUv.x * 10., 1.));
  // strength += step(0.8, mod(vUv.y * 10., 1.));

  // // Pattern 12
  // float strength = step(0.8, mod(vUv.x * 10., 1.));
  // strength *= step(0.8, mod(vUv.y * 10., 1.));

  // // Pattern 13
  // float strength = step(0.4, mod(vUv.x * 10., 1.));
  // strength *= step(0.8, mod(vUv.y * 10., 1.));

  // // Pattern 14
  // float strengthX = step(0.4, mod(vUv.x * 10., 1.));
  // strengthX *= step(0.8, mod(vUv.y * 10., 1.));
  // float strengthY = step(0.8, mod(vUv.x * 10., 1.));
  // strengthY *= step(0.4, mod(vUv.y * 10., 1.));
  // float strength = strengthX + strengthY;

  // // Pattern 15
  // float strengthX = step(0.4, mod(vUv.x * 10., 1.));
  // strengthX *= step(0.8, mod(vUv.y * 10. + 0.2, 1.));
  // float strengthY = step(0.8, mod(vUv.x * 10. + 0.2, 1.));
  // strengthY *= step(0.4, mod(vUv.y * 10., 1.));
  // float strength = strengthX + strengthY;

  // // Pattern 16
  // float strength = abs(vUv.x - 0.5);

  // // Pattern 17
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // // Pattern 18
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // // Pattern 19
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // // Pattern 20
  // float strength = 1. - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // strength *= step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // // Pattern 21
  // float strength = floor(vUv.x * 10.) / 10.;

  // // Pattern 22
  // float strength = floor(vUv.x * 10.) / 10.;
  // strength *= floor(vUv.y * 10.) / 10.;

  // // Pattern 23
  // float strength = random(vUv);

  // // Pattern 24
  // float strength = random(floor(vUv * 10.) / 10.);

  // // Pattern 25
  // float strength = random(vec2(floor(vUv.x * 10.) / 10., floor((vUv.y + vUv.x / 2.) * 10.) / 10.));

  // // Pattern 26
  // float strength = length(vUv);

  // // Pattern 27
  // float strength = distance(vUv, P_CENTER);

  // // Pattern 28
  // float strength = 1. - distance(vUv, P_CENTER);

  // // Pattern 29
  // float strength = 0.015 / distance(vUv, P_CENTER);

  // // Pattern 30
  // float strength = 0.015 / distance((vUv - 0.5) * vec2(0.1, 0.5) + 0.5, P_CENTER);

  // // Pattern 31
  // vec2 scale = vec2(0.1, 0.5);
  // float lightX = 0.015 / distance((vUv - 0.5) * scale + 0.5, P_CENTER);
  // float lightY = 0.015 / distance((vUv.yx - 0.5) * scale + 0.5, P_CENTER);
  // float strength = lightX * lightY;

  // // Pattern 32
  // vec2 rotatedUv = rotate(vUv, 45., P_CENTER);
  // vec2 scale = vec2(0.1, 0.5);
  // float lightX = 0.015 / distance((rotatedUv - 0.5) * scale + 0.5, P_CENTER);
  // float lightY = 0.015 / distance((rotatedUv.yx - 0.5) * scale + 0.5, P_CENTER);
  // float strength = lightX * lightY;

  // // Pattern 33
  // float strength = step(0.25, distance(vUv, P_CENTER));

  // // Pattern 34
  // float strength = abs(distance(vUv, P_CENTER) - 0.25);

  // // Pattern 35
  // float strength = step(0.01, abs(distance(vUv, P_CENTER) - 0.25));

  // // Pattern 36
  // float strength = 1. - step(0.01, abs(distance(vUv, P_CENTER) - 0.25));

  // // Pattern 37
  // vec2 waveUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.) / 10.);
  // float strength = 1. - step(0.01, abs(distance(waveUv, P_CENTER) - 0.25));

  // // Pattern 38
  // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.) / 10., vUv.y + sin(vUv.x * 30.) / 10.);
  // float strength = 1. - step(0.01, abs(distance(waveUv, P_CENTER) - 0.25));

  // // Pattern 39
  // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 100.) / 10., vUv.y + sin(vUv.x * 100.) / 10.);
  // float strength = 1. - step(0.01, abs(distance(waveUv, P_CENTER) - 0.25));

  // // Pattern 40
  // float strength = atan(vUv.x, vUv.y);

  // // Pattern 41
  // float strength = atan(vUv.x - 0.5, vUv.y - 0.5);

  // Pattern 42
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  angle /= 2. * M_PI;
  angle += 0.5;
  float strength = angle;

  // // Pattern 43
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2. * M_PI;
  // angle += 0.5;
  // float strength = mod(angle * 20., 1.);

  // // Pattern 44
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2. * M_PI;
  // angle += 0.5;
  // float strength = sin(angle * 100.);

  // // Pattern 45
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2. * M_PI;
  // angle += 0.5;
  // float radius = 0.25 + sin(angle * 100.) / 50.;
  // float strength = 1. - step(0.01, abs(distance(vUv, P_CENTER) - radius));

  // // Pattern 46
  // float strength = cnoise(vUv * 10.);

  // // Pattern 47
  // float strength = step(0., cnoise(vUv * 10.));

  // // Pattern 48
  // float strength = 1. - abs(cnoise(vUv * 10.));

  // // Pattern 49
  // float strength = sin(cnoise(vUv * 10.) * 20.);

  // // Pattern 50
  // float strength = step(0.9, sin(cnoise(vUv * 10.) * 20.));

  // Pattern w/o colors
  // gl_FragColor = vec4(vec3(strength), 1.);

  // Pattern w/ colors
  strength = clamp(strength, 0., 1.);
  vec3 blackColor = vec3(0.);
  vec3 uvColor = vec3(vUv, 1.);
  vec3 mixColor = mix(blackColor, uvColor, strength);
  gl_FragColor = vec4(mixColor, 1.);
}
