import type { SceneLayer } from "../types/scene";

// Easing functions
export function easeLinear(t: number): number {
  return t;
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function easeInQuad(t: number): number {
  return t * t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
  return Math.pow(t, 3);
}

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeInBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
}

export function easeElasticOut(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeOutSine(t: number): number {
  return Math.sin((t * Math.PI) / 2);
}

export function applyEasing(t: number, easing: string): number {
  const clamped = Math.max(0, Math.min(1, t));
  switch (easing) {
    case "easeOutBack":
      return easeOutBack(clamped);
    case "easeInBack":
      return easeInBack(clamped);
    case "easeOutCubic":
      return easeOutCubic(clamped);
    case "easeInCubic":
      return easeInCubic(clamped);
    case "easeOutQuad":
      return easeOutQuad(clamped);
    case "easeInQuad":
      return easeInQuad(clamped);
    case "elasticOut":
      return easeElasticOut(clamped);
    case "easeOutExpo":
      return easeOutExpo(clamped);
    case "easeInOutCubic":
      return easeInOutCubic(clamped);
    case "easeInOutSine":
      return easeInOutSine(clamped);
    case "easeOutSine":
      return easeOutSine(clamped);
    default:
      return clamped;
  }
}

export interface LayerRenderState {
  visible: boolean;
  opacity: number;
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotation: number; // degrees
  effects: {
    glow: number;
    glowColor?: string;
    lightSweepProgress: number; // -1 if not active, 0..1 if active
    flash: number; // 0..1
    rgbSplitOffset: number; // pixels
    glitchSlice: boolean;
    glitchOffsetX: number;
    blurAmount: number; // px
    noiseIntensity: number;
  };
}

export function computeLayerState(
  layer: SceneLayer,
  time: number,
  totalDuration: number,
): LayerRenderState {
  if (!layer.visible) {
    return {
      visible: false,
      opacity: 0,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      effects: {
        glow: 0,
        lightSweepProgress: -1,
        flash: 0,
        rgbSplitOffset: 0,
        glitchSlice: false,
        glitchOffsetX: 0,
        blurAmount: 0,
        noiseIntensity: 0,
      },
    };
  }

  const inAnim = layer.inAnimation;
  const loopAnim = layer.loopAnimation;
  const outAnim = layer.outAnimation;

  // 1. Time boundary check for Entrance
  if (inAnim.type !== "none" && time < inAnim.start) {
    return {
      visible: false,
      opacity: 0,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      effects: {
        glow: 0,
        lightSweepProgress: -1,
        flash: 0,
        rgbSplitOffset: 0,
        glitchSlice: false,
        glitchOffsetX: 0,
        blurAmount: 0,
        noiseIntensity: 0,
      },
    };
  }

  // 2. Time boundary check for Exit
  if (outAnim.type !== "none" && time > outAnim.start + outAnim.duration) {
    return {
      visible: false,
      opacity: 0,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      effects: {
        glow: 0,
        lightSweepProgress: -1,
        flash: 0,
        rgbSplitOffset: 0,
        glitchSlice: false,
        glitchOffsetX: 0,
        blurAmount: 0,
        noiseIntensity: 0,
      },
    };
  }

  let opacity = layer.opacity ?? 1.0;
  let translateX = 0;
  let translateY = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;
  let inProgress = 1;

  // Compute IN ANIMATION
  if (
    inAnim.type !== "none" &&
    time >= inAnim.start &&
    time < inAnim.start + inAnim.duration
  ) {
    const rawProgress = (time - inAnim.start) / Math.max(0.01, inAnim.duration);
    inProgress = applyEasing(rawProgress, inAnim.easing);

    switch (inAnim.type) {
      case "smoothSlideUp":
        translateY = (1 - inProgress) * 200;
        opacity *= Math.min(1, inProgress * 3);
        break;
      case "smoothSlideDown":
        translateY = (1 - inProgress) * -200;
        opacity *= Math.min(1, inProgress * 3);
        break;
      case "smoothDrift":
        translateX = (1 - inProgress) * 120;
        translateY = (1 - inProgress) * 80;
        opacity *= Math.min(1, inProgress * 2.5);
        break;
      case "softScale":
        scaleX = 0.5 + 0.5 * inProgress;
        scaleY = scaleX;
        opacity *= Math.min(1, inProgress * 3);
        break;
      case "fadeIn":
        opacity *= inProgress;
        break;
      case "slideDownFade":
        translateY = (1 - inProgress) * -450;
        opacity *= Math.min(1, inProgress * 3.5);
        break;
      case "slideUpFade":
        translateY = (1 - inProgress) * 450;
        opacity *= Math.min(1, inProgress * 3.5);
        break;
      case "slideLeft":
        translateX = (1 - inProgress) * 600;
        opacity *= Math.min(1, inProgress * 4);
        break;
      case "slideRight":
        translateX = (1 - inProgress) * -600;
        opacity *= Math.min(1, inProgress * 4);
        break;
      case "scaleFade":
        scaleX = 0.2 + 0.8 * inProgress;
        scaleY = scaleX;
        opacity *= Math.min(1, inProgress * 4);
        break;
      case "pop":
        scaleX = inProgress;
        scaleY = inProgress;
        opacity *= Math.min(1, inProgress * 5);
        break;
      case "neonReveal":
        scaleX = 0.85 + 0.15 * inProgress;
        scaleY = scaleX;
        opacity *= inProgress < 0.45 ? (Math.sin(time * 35) > 0 ? 0.9 : 0.2) : 1;
        break;
      case "glitchIn":
        opacity *= Math.min(1, inProgress * 3);
        if (inProgress < 0.8) {
          translateX =
            (Math.sin(time * 60) > 0 ? 1 : -1) * (1 - inProgress) * 60;
        }
        break;
      case "zoomBurst":
        scaleX = 2.6 - 1.6 * inProgress;
        scaleY = scaleX;
        opacity *= Math.min(1, inProgress * 3.5);
        break;
      case "bassDropIn":
        translateY = (1 - inProgress) * -650;
        opacity *= Math.min(1, inProgress * 4);
        if (inProgress > 0.8) {
          translateY += Math.sin((inProgress - 0.8) * Math.PI * 10) * 18 * (1 - inProgress);
        }
        break;
      case "strobeIn":
        opacity *= inProgress > 0.85 ? 1 : (Math.floor(time * 24) % 2 === 0 ? 1 : 0.05);
        break;
      case "whipPan":
        translateX = (1 - inProgress) * -800;
        opacity *= Math.min(1, inProgress * 5);
        break;
    }
  }

  // Compute CONTINUOUS / LOOP ANIMATION
  if (loopAnim.type !== "none" && time >= loopAnim.start) {
    const loopTime = time - loopAnim.start;
    const intensity = loopAnim.intensity || 1.0;
    const speed = loopAnim.speed || 1.0;

    switch (loopAnim.type) {
      case "softFloat": {
        const fSpeed = loopTime * 0.9 * speed;
        translateY +=
          (Math.sin(fSpeed) * 9 + Math.sin(fSpeed * 1.8) * 3) * intensity;
        translateX += Math.cos(fSpeed * 0.7) * 4 * intensity;
        break;
      }
      case "breathing": {
        const breath = Math.sin(loopTime * ((Math.PI * 2) / 3.2) * speed);
        const breathScale = 1 + breath * 0.024 * intensity;
        scaleX *= breathScale;
        scaleY *= breathScale;
        break;
      }
      case "pendulumSwing": {
        rotation += Math.sin(loopTime * 1.2 * speed) * 1.5 * intensity;
        break;
      }
      case "gentleDrift": {
        translateX += Math.sin(loopTime * 0.35 * speed) * 10 * intensity;
        translateY += Math.cos(loopTime * 0.45 * speed) * 8 * intensity;
        const slowScale =
          1 + Math.sin(loopTime * 0.25 * speed) * 0.015 * intensity;
        scaleX *= slowScale;
        scaleY *= slowScale;
        break;
      }
      case "slowZoom": {
        const zoomFactor = 1 + (loopTime / totalDuration) * 0.12 * intensity;
        scaleX *= zoomFactor;
        scaleY *= zoomFactor;
        break;
      }
      case "slowRotate": {
        rotation += Math.sin(loopTime * 0.8 * speed) * 3 * intensity;
        break;
      }
      case "loopPulse": {
        // Electronic music beat pulse simulation (~128 BPM = ~2.13 beats/sec)
        const pulse = Math.sin(loopTime * Math.PI * 2.13 * speed);
        const pulseScale = 1 + Math.max(0, pulse) * 0.06 * intensity;
        scaleX *= pulseScale;
        scaleY *= pulseScale;
        break;
      }
      case "floatParallax": {
        translateY += Math.sin(loopTime * 1.5 * speed) * 18 * intensity;
        translateX += Math.cos(loopTime * 1.0 * speed) * 8 * intensity;
        break;
      }
      case "neonFlicker": {
        // Subtle electric voltage flutter
        const flicker = 1 - Math.random() * 0.15 * intensity;
        opacity *= flicker;
        break;
      }
      case "shimmer": {
        // Handled in lightSweep effect
        break;
      }
    }
  }

  // Compute OUT ANIMATION
  if (
    outAnim.type !== "none" &&
    time >= outAnim.start &&
    time <= outAnim.start + outAnim.duration
  ) {
    const rawOutProgress =
      (time - outAnim.start) / Math.max(0.01, outAnim.duration);
    const outProgress = applyEasing(rawOutProgress, outAnim.easing);

    switch (outAnim.type) {
      case "smoothFadeOut":
        opacity *= 1 - outProgress;
        break;
      case "smoothScaleDown":
        scaleX *= 1 - outProgress * 0.06;
        scaleY = scaleX;
        opacity *= 1 - outProgress;
        break;
      case "smoothSlideOutUp":
        translateY -= outProgress * 45;
        opacity *= 1 - outProgress;
        break;
      case "fadeOut":
        opacity *= 1 - outProgress;
        break;
      case "slideOut":
        translateY += outProgress * 220;
        opacity *= 1 - outProgress;
        break;
      case "scaleOut":
        scaleX *= 1 - outProgress * 0.7;
        scaleY = scaleX;
        opacity *= 1 - outProgress;
        break;
      case "zoomOut":
        scaleX *= 1 + outProgress * 1.2;
        scaleY = scaleX;
        opacity *= 1 - outProgress;
        break;
      case "blurOut":
        opacity *= 1 - outProgress;
        break;
      case "wipeOut":
        scaleX *= 1 - outProgress;
        opacity *= 1 - outProgress;
        break;
      case "glitchOut":
        translateX += (Math.random() - 0.5) * 40 * outProgress;
        opacity *= 1 - outProgress;
        break;
      case "neonOut":
        scaleX *= 1 + outProgress * 0.2;
        scaleY = scaleX;
        opacity *= 1 - Math.pow(outProgress, 2);
        break;
    }
  }

  // Compute EFFECTS Stack
  let glow = 0;
  let glowColor: string | undefined = undefined;
  let lightSweepProgress = -1;
  let flash = 0;
  let rgbSplitOffset = 0;
  let glitchSlice = false;
  let glitchOffsetX = 0;
  let blurAmount = 0;
  let noiseIntensity = 0;

  for (const eff of layer.effects) {
    if (!eff.enabled) continue;
    const inRange = time >= eff.start && time <= eff.start + eff.duration;
    if (!inRange) continue;

    const effTime = time - eff.start;
    const progress = effTime / Math.max(0.01, eff.duration);

    switch (eff.type) {
      case "glowNeon":
        glow = Math.max(
          glow,
          15 * eff.intensity * (0.8 + 0.2 * Math.sin(time * 6)),
        );
        glowColor = eff.color || "#00f0ff";
        break;

      case "lightSweep":
        // Beam traverses layer diagonally from left to right
        lightSweepProgress = progress;
        break;

      case "flash": {
        // High peak at start then rapid decay
        const flashDecay = Math.max(0, 1 - progress * 2.5);
        flash = Math.max(flash, flashDecay * eff.intensity);
        break;
      }

      case "rgbSplit":
      case "chromaticAberration": {
        const splitAmount = (8 + 12 * Math.sin(time * 12)) * eff.intensity;
        rgbSplitOffset = Math.max(rgbSplitOffset, splitAmount);
        break;
      }

      case "glitch": {
        if (Math.sin(time * 25) > 0.4) {
          glitchSlice = true;
          glitchOffsetX =
            (Math.sin(time * 60) * 16 + (Math.random() - 0.5) * 10) *
            eff.intensity;
        }
        break;
      }

      case "noise":
        noiseIntensity = Math.max(noiseIntensity, eff.intensity);
        break;

      case "blur":
        blurAmount = Math.max(blurAmount, 10 * eff.intensity);
        break;
    }
  }

  // If in neonReveal, add entry glow
  if (inAnim.type === "neonReveal" && inProgress < 1) {
    glow = Math.max(glow, (1 - inProgress) * 30 + 10);
    glowColor = glowColor || "#00f0ff";
  }

  // If in blurOut, add blur
  if (outAnim.type === "blurOut" && time >= outAnim.start) {
    const outP = (time - outAnim.start) / Math.max(0.01, outAnim.duration);
    blurAmount = Math.max(blurAmount, outP * 25);
  }

  return {
    visible: opacity > 0.001,
    opacity: Math.max(0, Math.min(1, opacity)),
    translateX,
    translateY,
    scaleX,
    scaleY,
    rotation,
    effects: {
      glow,
      glowColor,
      lightSweepProgress,
      flash,
      rgbSplitOffset,
      glitchSlice,
      glitchOffsetX,
      blurAmount,
      noiseIntensity,
    },
  };
}

/**
 * High-performance rendering of a layer onto target 2D context
 */
export function renderLayerToCanvas(
  ctx: CanvasRenderingContext2D,
  layer: SceneLayer,
  state: LayerRenderState,
) {
  if (!state.visible || !layer.canvas) return;

  const w = layer.width;
  const h = layer.height;
  if (w <= 0 || h <= 0) return;

  ctx.save();

  // Position transform with origin at center of the layer
  const centerX = layer.x + w / 2 + state.translateX;
  const centerY = layer.y + h / 2 + state.translateY;

  ctx.translate(centerX, centerY);
  if (state.rotation !== 0) {
    ctx.rotate((state.rotation * Math.PI) / 180);
  }
  if (state.scaleX !== 1 || state.scaleY !== 1) {
    ctx.scale(state.scaleX, state.scaleY);
  }

  ctx.globalAlpha = state.opacity;
  ctx.globalCompositeOperation = layer.blendMode || "source-over";

  const dx = -w / 2;
  const dy = -h / 2;

  // 1. Neon Glow pass
  if (state.effects.glow > 0 && state.effects.glowColor) {
    ctx.save();
    ctx.shadowColor = state.effects.glowColor;
    ctx.shadowBlur = state.effects.glow;
    ctx.drawImage(layer.canvas, dx, dy, w, h);
    // Double shadow for intense cyber neon look
    ctx.shadowBlur = state.effects.glow * 1.8;
    ctx.drawImage(layer.canvas, dx, dy, w, h);
    ctx.restore();
  }

  // 2. RGB Split / Chromatic Aberration pass
  if (state.effects.rgbSplitOffset > 0) {
    const offset = state.effects.rgbSplitOffset;
    // Red channel shifted left
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.shadowColor = "rgba(255, 0, 50, 0.7)";
    ctx.shadowBlur = 4;
    ctx.drawImage(layer.canvas, dx - offset, dy, w, h);
    // Cyan channel shifted right
    ctx.shadowColor = "rgba(0, 240, 255, 0.7)";
    ctx.shadowBlur = 4;
    ctx.drawImage(layer.canvas, dx + offset, dy, w, h);
    ctx.restore();
  }

  // 3. Glitch Slicing
  if (state.effects.glitchSlice) {
    const sliceCount = 6;
    const sliceH = h / sliceCount;
    for (let i = 0; i < sliceCount; i++) {
      const isShifted = i % 2 === 1;
      const sx = 0;
      const sy = i * sliceH;
      const sWidth = w;
      const sHeight = sliceH;
      const destX = dx + (isShifted ? state.effects.glitchOffsetX : 0);
      const destY = dy + sy;

      ctx.drawImage(
        layer.canvas,
        sx,
        sy,
        sWidth,
        sHeight,
        destX,
        destY,
        sWidth,
        sHeight,
      );
    }
  } else {
    // Normal Draw
    if (state.effects.blurAmount > 0) {
      ctx.filter = `blur(${state.effects.blurAmount}px)`;
    }
    ctx.drawImage(layer.canvas, dx, dy, w, h);
    ctx.filter = "none";
  }

  // 4. Light Sweep beam pass
  if (
    state.effects.lightSweepProgress >= 0 &&
    state.effects.lightSweepProgress <= 1
  ) {
    ctx.save();
    // Clip to layer alpha using source-atop
    ctx.globalCompositeOperation = "source-atop";
    const sweepX = dx + (w + 200) * state.effects.lightSweepProgress - 100;

    const grad = ctx.createLinearGradient(sweepX - 60, dy, sweepX + 60, dy + h);
    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(dx, dy, w, h);
    ctx.restore();
  }

  // 5. Flash white highlight
  if (state.effects.flash > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, state.effects.flash)})`;
    ctx.fillRect(dx, dy, w, h);
    ctx.restore();
  }

  ctx.restore();
}
