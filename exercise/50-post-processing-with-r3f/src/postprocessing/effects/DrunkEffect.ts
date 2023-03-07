import { BlendFunction, Effect } from 'postprocessing';
import { Uniform, WebGLRenderer, WebGLRenderTarget } from 'three';

export type DrunkProps = {
  frequency?: number;
  amplitude?: number;
  offset?: number;
  blendFunction?: BlendFunction;
  // opacity?: number;
};

const fragmentShader = /* glsl */ `
  uniform float frequency;
  uniform float amplitude;
  uniform float offset;

  void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * frequency + offset) * amplitude;
    uv.y += cos((uv.x * frequency + offset) * 1.2) * amplitude / 1.2;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
  }
`;

export default class DrunkEffect extends Effect {
  constructor({
    frequency = 10,
    amplitude = 0.1,
    offset = 0,
    blendFunction = BlendFunction.DARKEN,
  }: DrunkProps) {
    super('DrunkEffect', fragmentShader, {
      blendFunction,
      uniforms: new Map<string, Uniform<number>>([
        ['frequency', new Uniform(frequency)],
        ['amplitude', new Uniform(amplitude)],
        ['offset', new Uniform(offset)],
      ]),
    });
  }

  public update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, deltaTime?: number) {
    this.uniforms.get('offset')!.value += deltaTime;
  }
}
