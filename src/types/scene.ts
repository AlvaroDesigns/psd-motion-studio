export type LayerRole =
  | 'background'
  | 'hero'
  | 'title'
  | 'date'
  | 'lineup'
  | 'cta'
  | 'logo'
  | 'fx'
  | 'custom';

export type InAnimationType =
  | 'none'
  | 'fadeIn'
  | 'slideDownFade'
  | 'slideUpFade'
  | 'smoothSlideUp'
  | 'smoothSlideDown'
  | 'smoothDrift'
  | 'softScale'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleFade'
  | 'neonReveal'
  | 'pop'
  | 'glitchIn'
  | 'zoomBurst'
  | 'bassDropIn'
  | 'strobeIn'
  | 'whipPan';

export type LoopAnimationType =
  | 'none'
  | 'slowZoom'
  | 'slowRotate'
  | 'loopPulse'
  | 'floatParallax'
  | 'softFloat'
  | 'breathing'
  | 'pendulumSwing'
  | 'gentleDrift'
  | 'neonFlicker'
  | 'shimmer'
  | 'bassDropBeat'
  | 'strobeFlicker'
  | 'earthquakeShake';

export type OutAnimationType =
  | 'none'
  | 'fadeOut'
  | 'smoothFadeOut'
  | 'smoothScaleDown'
  | 'smoothSlideOutUp'
  | 'slideOut'
  | 'scaleOut'
  | 'zoomOut'
  | 'blurOut'
  | 'wipeOut'
  | 'glitchOut'
  | 'neonOut';

export type EffectType =
  | 'glowNeon'
  | 'lightSweep'
  | 'flash'
  | 'rgbSplit'
  | 'chromaticAberration'
  | 'noise'
  | 'glitch'
  | 'blur';

export interface InAnimationConfig {
  type: InAnimationType;
  start: number; // seconds
  duration: number; // seconds
  easing: 'linear' | 'easeOutQuad' | 'easeOutCubic' | 'easeOutBack' | 'elasticOut' | 'easeOutExpo' | 'easeInOutCubic' | 'easeInOutSine' | 'easeOutSine';
}

export interface LoopAnimationConfig {
  type: LoopAnimationType;
  start: number; // seconds
  duration: number; // seconds (or full duration)
  intensity: number; // 0.1 to 2.0
  speed: number; // speed factor
}

export interface OutAnimationConfig {
  type: OutAnimationType;
  start: number; // seconds
  duration: number; // seconds
  easing: 'linear' | 'easeInQuad' | 'easeInCubic' | 'easeInBack' | 'easeInOutCubic' | 'easeInOutSine' | 'easeOutSine';
}

export interface LayerEffectConfig {
  id: string;
  type: EffectType;
  enabled: boolean;
  start: number;
  duration: number;
  intensity: number; // 0 to 1 or higher
  color?: string; // for neon/glow
}

export interface SceneLayer {
  id: string;
  name: string;
  role: LayerRole;
  x: number; // relative to 1080x1920 base canvas
  y: number;
  width: number;
  height: number;
  opacity: number; // 0 to 1
  blendMode: GlobalCompositeOperation;
  visible: boolean;
  locked: boolean;
  canvas?: HTMLCanvasElement;
  dataUrl?: string; // for serialization
  inAnimation: InAnimationConfig;
  loopAnimation: LoopAnimationConfig;
  outAnimation: OutAnimationConfig;
  effects: LayerEffectConfig[];
}


export interface StorySlide {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  transition: 'cut' | 'fade' | 'neonFlash' | 'slideLeft' | 'zoomBurst';
}

export interface MasterSceneSettings {
  name: string;
  width: number; // 1080
  height: number; // 1920
  duration: number; // 7.0 seconds default
  fps: number; // 30 or 60
  backgroundColor: string;
}

export interface SceneProject {
  settings: MasterSceneSettings;
  layers: SceneLayer[];
  slides?: StorySlide[];
}

export interface AIProposalLayerConfig {
  inAnimation: InAnimationConfig;
  loopAnimation: LoopAnimationConfig;
  outAnimation: OutAnimationConfig;
  effects?: LayerEffectConfig[];
}

export interface AIProposal {
  id: string;
  name: 'Elegant' | 'Dynamic' | 'Neon' | string;
  tagline: string;
  description: string;
  vibe: string;
  colorScheme: string;
  accentColor: string;
  layerConfigs: Record<string, AIProposalLayerConfig>; // key is layer role or layer id
}
