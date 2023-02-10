import type {
  AmbientLightProbeProps,
  AmbientLightProps,
  ArrayCameraProps,
  ArrowHelperProps,
  AudioListenerProps,
  AxesHelperProps,
  BoneProps,
  Box3HelperProps,
  BoxBufferGeometryProps,
  BoxGeometryProps,
  BoxHelperProps,
  BufferAttributeProps,
  BufferGeometryProps,
  CameraHelperProps,
  CameraProps,
  CanvasTextureProps,
  CapsuleGeometryProps,
  CircleBufferGeometryProps,
  CircleGeometryProps,
  ColorProps,
  CompressedTextureProps,
  ConeBufferGeometryProps,
  ConeGeometryProps,
  CubeCameraProps,
  CubeTextureProps,
  CylinderBufferGeometryProps,
  CylinderGeometryProps,
  DataTexture3DProps,
  DataTextureProps,
  DepthTextureProps,
  DirectionalLightHelperProps,
  DirectionalLightProps,
  DirectionalLightShadowProps,
  DodecahedronBufferGeometryProps,
  DodecahedronGeometryProps,
  EdgesGeometryProps,
  EulerProps,
  ExtrudeBufferGeometryProps,
  ExtrudeGeometryProps,
  Float16BufferAttributeProps,
  Float32BufferAttributeProps,
  Float64BufferAttributeProps,
  FogExp2Props,
  FogProps,
  GridHelperProps,
  GroupProps,
  HemisphereLightHelperProps,
  HemisphereLightProbeProps,
  HemisphereLightProps,
  IcosahedronBufferGeometryProps,
  IcosahedronGeometryProps,
  InstancedBufferAttributeProps,
  InstancedBufferGeometryProps,
  InstancedMeshProps,
  Int16BufferAttributeProps,
  Int32BufferAttributeProps,
  Int8BufferAttributeProps,
  LatheBufferGeometryProps,
  LatheGeometryProps,
  LightProbeProps,
  LightProps,
  LightShadowProps,
  LineBasicMaterialProps,
  LineDashedMaterialProps,
  LineLoopProps,
  LineSegmentsProps,
  LODProps,
  MaterialProps,
  Matrix3Props,
  Matrix4Props,
  MeshBasicMaterialProps,
  MeshDepthMaterialProps,
  MeshDistanceMaterialProps,
  MeshLambertMaterialProps,
  MeshMatcapMaterialProps,
  MeshNormalMaterialProps,
  MeshPhongMaterialProps,
  MeshPhysicalMaterialProps,
  MeshProps,
  MeshStandardMaterialProps,
  MeshToonMaterialProps,
  Object3DProps,
  OctahedronBufferGeometryProps,
  OctahedronGeometryProps,
  OrthographicCameraProps,
  PerspectiveCameraProps,
  PlaneBufferGeometryProps,
  PlaneGeometryProps,
  PlaneHelperProps,
  PointLightHelperProps,
  PointLightProps,
  PointsMaterialProps,
  PointsProps,
  PolarGridHelperProps,
  PolyhedronBufferGeometryProps,
  PolyhedronGeometryProps,
  PositionalAudioProps,
  PrimitiveProps,
  QuaternionProps,
  RawShaderMaterialProps,
  RaycasterProps,
  RectAreaLightProps,
  RingBufferGeometryProps,
  RingGeometryProps,
  SceneProps,
  ShaderMaterialProps,
  ShadowMaterialProps,
  ShapeBufferGeometryProps,
  ShapeGeometryProps,
  ShapeProps,
  SkeletonHelperProps,
  SkeletonProps,
  SkinnedMeshProps,
  SphereBufferGeometryProps,
  SphereGeometryProps,
  SpotLightHelperProps,
  SpotLightProps,
  SpotLightShadowProps,
  SpriteMaterialProps,
  SpriteProps,
  TetrahedronBufferGeometryProps,
  TetrahedronGeometryProps,
  TextureProps,
  TorusBufferGeometryProps,
  TorusGeometryProps,
  TorusKnotBufferGeometryProps,
  TorusKnotGeometryProps,
  TubeBufferGeometryProps,
  TubeGeometryProps,
  Uint16BufferAttributeProps,
  Uint32BufferAttributeProps,
  Uint8BufferAttributeProps,
  Vector2Props,
  Vector3Props,
  Vector4Props,
  VideoTextureProps,
  WireframeGeometryProps,
} from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      object3D: Object3DProps;

      // `audio` works but conflicts with @types/react. Try using PositionalAudio from @react-three/drei instead
      // audio: AudioProps
      audioListener: AudioListenerProps;
      positionalAudio: PositionalAudioProps;

      mesh: MeshProps;
      instancedMesh: InstancedMeshProps;
      scene: SceneProps;
      sprite: SpriteProps;
      lOD: LODProps;
      skinnedMesh: SkinnedMeshProps;
      skeleton: SkeletonProps;
      bone: BoneProps;
      lineSegments: LineSegmentsProps;
      lineLoop: LineLoopProps;
      // see `audio`
      // line: LineProps
      points: PointsProps;
      group: GroupProps;

      // cameras
      camera: CameraProps;
      perspectiveCamera: PerspectiveCameraProps;
      orthographicCamera: OrthographicCameraProps;
      cubeCamera: CubeCameraProps;
      arrayCamera: ArrayCameraProps;

      // geometry
      instancedBufferGeometry: InstancedBufferGeometryProps;
      bufferGeometry: BufferGeometryProps;
      boxBufferGeometry: BoxBufferGeometryProps;
      circleBufferGeometry: CircleBufferGeometryProps;
      coneBufferGeometry: ConeBufferGeometryProps;
      cylinderBufferGeometry: CylinderBufferGeometryProps;
      dodecahedronBufferGeometry: DodecahedronBufferGeometryProps;
      extrudeBufferGeometry: ExtrudeBufferGeometryProps;
      icosahedronBufferGeometry: IcosahedronBufferGeometryProps;
      latheBufferGeometry: LatheBufferGeometryProps;
      octahedronBufferGeometry: OctahedronBufferGeometryProps;
      planeBufferGeometry: PlaneBufferGeometryProps;
      polyhedronBufferGeometry: PolyhedronBufferGeometryProps;
      ringBufferGeometry: RingBufferGeometryProps;
      shapeBufferGeometry: ShapeBufferGeometryProps;
      sphereBufferGeometry: SphereBufferGeometryProps;
      tetrahedronBufferGeometry: TetrahedronBufferGeometryProps;
      torusBufferGeometry: TorusBufferGeometryProps;
      torusKnotBufferGeometry: TorusKnotBufferGeometryProps;
      tubeBufferGeometry: TubeBufferGeometryProps;
      wireframeGeometry: WireframeGeometryProps;
      tetrahedronGeometry: TetrahedronGeometryProps;
      octahedronGeometry: OctahedronGeometryProps;
      icosahedronGeometry: IcosahedronGeometryProps;
      dodecahedronGeometry: DodecahedronGeometryProps;
      polyhedronGeometry: PolyhedronGeometryProps;
      tubeGeometry: TubeGeometryProps;
      torusKnotGeometry: TorusKnotGeometryProps;
      torusGeometry: TorusGeometryProps;
      sphereGeometry: SphereGeometryProps;
      ringGeometry: RingGeometryProps;
      planeGeometry: PlaneGeometryProps;
      latheGeometry: LatheGeometryProps;
      shapeGeometry: ShapeGeometryProps;
      extrudeGeometry: ExtrudeGeometryProps;
      edgesGeometry: EdgesGeometryProps;
      coneGeometry: ConeGeometryProps;
      cylinderGeometry: CylinderGeometryProps;
      circleGeometry: CircleGeometryProps;
      boxGeometry: BoxGeometryProps;
      capsuleGeometry: CapsuleGeometryProps;

      // materials
      material: MaterialProps;
      shadowMaterial: ShadowMaterialProps;
      spriteMaterial: SpriteMaterialProps;
      rawShaderMaterial: RawShaderMaterialProps;
      shaderMaterial: ShaderMaterialProps;
      pointsMaterial: PointsMaterialProps;
      meshPhysicalMaterial: MeshPhysicalMaterialProps;
      meshStandardMaterial: MeshStandardMaterialProps;
      meshPhongMaterial: MeshPhongMaterialProps;
      meshToonMaterial: MeshToonMaterialProps;
      meshNormalMaterial: MeshNormalMaterialProps;
      meshLambertMaterial: MeshLambertMaterialProps;
      meshDepthMaterial: MeshDepthMaterialProps;
      meshDistanceMaterial: MeshDistanceMaterialProps;
      meshBasicMaterial: MeshBasicMaterialProps;
      meshMatcapMaterial: MeshMatcapMaterialProps;
      lineDashedMaterial: LineDashedMaterialProps;
      lineBasicMaterial: LineBasicMaterialProps;

      // primitive
      primitive: PrimitiveProps;

      // lights and other
      light: LightProps;
      spotLightShadow: SpotLightShadowProps;
      spotLight: SpotLightProps;
      pointLight: PointLightProps;
      rectAreaLight: RectAreaLightProps;
      hemisphereLight: HemisphereLightProps;
      directionalLightShadow: DirectionalLightShadowProps;
      directionalLight: DirectionalLightProps;
      ambientLight: AmbientLightProps;
      lightShadow: LightShadowProps;
      ambientLightProbe: AmbientLightProbeProps;
      hemisphereLightProbe: HemisphereLightProbeProps;
      lightProbe: LightProbeProps;

      // helpers
      spotLightHelper: SpotLightHelperProps;
      skeletonHelper: SkeletonHelperProps;
      pointLightHelper: PointLightHelperProps;
      hemisphereLightHelper: HemisphereLightHelperProps;
      gridHelper: GridHelperProps;
      polarGridHelper: PolarGridHelperProps;
      directionalLightHelper: DirectionalLightHelperProps;
      cameraHelper: CameraHelperProps;
      boxHelper: BoxHelperProps;
      box3Helper: Box3HelperProps;
      planeHelper: PlaneHelperProps;
      arrowHelper: ArrowHelperProps;
      axesHelper: AxesHelperProps;

      // textures
      texture: TextureProps;
      videoTexture: VideoTextureProps;
      dataTexture: DataTextureProps;
      dataTexture3D: DataTexture3DProps;
      compressedTexture: CompressedTextureProps;
      cubeTexture: CubeTextureProps;
      canvasTexture: CanvasTextureProps;
      depthTexture: DepthTextureProps;

      // misc
      raycaster: RaycasterProps;
      vector2: Vector2Props;
      vector3: Vector3Props;
      vector4: Vector4Props;
      euler: EulerProps;
      matrix3: Matrix3Props;
      matrix4: Matrix4Props;
      quaternion: QuaternionProps;
      bufferAttribute: BufferAttributeProps;
      float16BufferAttribute: Float16BufferAttributeProps;
      float32BufferAttribute: Float32BufferAttributeProps;
      float64BufferAttribute: Float64BufferAttributeProps;
      int8BufferAttribute: Int8BufferAttributeProps;
      int16BufferAttribute: Int16BufferAttributeProps;
      int32BufferAttribute: Int32BufferAttributeProps;
      uint8BufferAttribute: Uint8BufferAttributeProps;
      uint16BufferAttribute: Uint16BufferAttributeProps;
      uint32BufferAttribute: Uint32BufferAttributeProps;
      instancedBufferAttribute: InstancedBufferAttributeProps;
      color: ColorProps;
      fog: FogProps;
      fogExp2: FogExp2Props;
      shape: ShapeProps;
    }
  }
}
