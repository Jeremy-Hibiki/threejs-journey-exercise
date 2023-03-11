import '@react-three/postprocessing/dist/effects/SSR';

declare module '@react-three/postprocessing/dist/effects/SSR' {
  interface SSRProps {
    /**
     * intensity of the reflections
     */
    intensity?: number;
    /**
     * exponent by which reflections will be potentiated when composing the current frame's reflections and the accumulated reflections into a final reflection; higher values will make reflections clearer by highlighting darker spots less
     */
    exponent?: number;
    /**
     * maximum distance a reflection ray can travel to find what it reflects
     */
    distance?: number;
    /**
     * how much reflections will fade out by distance
     */
    fade?: number;
    /**
     * how intense reflections should be on rough spots; a higher value will make reflections fade out quicker on rough spots
     */
    roughnessFade?: number;
    /**
     * maximum depth difference between a ray and the particular depth at its screen position before refining with binary search; higher values will result in better performance
     */
    thickness?: number;
    /**
     * Index of Refraction, used for calculating fresnel; reflections tend to be more intense the steeper the angle between them and the viewer is, the ior parameter sets how much the intensity varies
     */
    ior?: number;
    /**
     * maximum roughness a texel can have to have reflections calculated for it
     */
    maxRoughness?: number;
    /**
     * maximum depth difference between a ray and the particular depth at its screen position after refining with binary search; higher values will result in better performance
     */
    maxDepthDifference?: number;
    /**
     * a value between 0 and 1 to set how much the last frame's reflections should be blended in; higher values will result in less noisy reflections when moving the camera but a more smeary look
     */
    blend?: number;
    /**
     * how much pixels should be corrected when doing temporal resolving; higher values will result in less smearing but more noise
     */
    correction?: number;
    /**
     * how many surrounding pixels will be used for neighborhood clamping; a higher value can reduce noise when moving the camera but will result in less performance
     */
    correctionRadius?: number;
    /**
     * how much the blurred reflections should be mixed with the raw reflections
     */
    blur?: number;
    /**
     * kernel size of the Box Blur Filter; higher kernel sizes will result in blurrier reflections with more artifacts
     */
    blurKernel?: number;
    /**
     * exponent of the Box Blur filter; higher values will result in more sharpness
     */
    blurSharpness?: number;
    /**
     * how intense jittering should be
     */
    jitter?: number;
    /**
     * how intense jittering should be in relation to a material's roughness
     */
    jitterRoughness?: number;
    /**
     * number of steps a reflection ray can maximally do to find an object it intersected (and thus reflects)
     */
    steps?: number;
    /**
     * once we had our ray intersect something, we need to find the exact point in space it intersected and thus it reflects; this can be done through binary search with the given number of maximum steps
     */
    refineSteps?: number;
    /**
     * if there should still be reflections for rays for which a reflecting point couldn't be found; enabling this will result in stretched looking reflections which can look good or bad depending on the angle
     */
    missedRays?: boolean;
    /**
     * if roughness maps should be taken account of when calculating reflections
     */
    useNormalMap?: boolean;
    /**
     * if normal maps should be taken account of when calculating reflections
     */
    useRoughnessMap?: boolean;
    /**
     * resolution of the SSR effect, a resolution of 0.5 means the effect will be rendered at half resolution
     */
    resolutionScale?: number;
    /**
     * resolution of the velocity buffer, a resolution of 0.5 means velocity will be rendered at half resolution
     */
    velocityResolutionScale?: number;
  }
}
