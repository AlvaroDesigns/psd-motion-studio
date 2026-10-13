import { readPsd } from 'ag-psd';
import type { SceneLayer, LayerRole, SceneProject } from '../types/scene';

function detectLayerRole(name: string, normY?: number, normW?: number, normH?: number): LayerRole {
  const lower = name.toLowerCase();
  const area = (normW && normH) ? (normW * normH) : 0;
  const isFullCanvas = area > 1080 * 1920 * 0.65;

  if (lower.includes('bg') || lower.includes('background') || lower.includes('fondo') || isFullCanvas) return 'background';
  if (lower.includes('hero') || lower.includes('main') || lower.includes('sujeto') || lower.includes('person') || lower.includes('object') || lower.includes('skull') || lower.includes('foto') || lower.includes('chica') || lower.includes('dj') || lower.includes('brenda') || lower.includes('serna')) return 'hero';
  if (lower.includes('title') || lower.includes('titulo') || lower.includes('head') || lower.includes('name') || lower.includes('festival') || lower.includes('elche') || lower.includes('tour') || lower.includes('party')) return 'title';
  if (lower.includes('date') || lower.includes('fecha') || lower.includes('time') || lower.includes('hora') || lower.includes('sep') || lower.includes('oct') || lower.includes('mie') || lower.includes('sab') || lower.includes('dom') || lower.includes('badge')) return 'date';
  if (lower.includes('lineup') || lower.includes('artist') || lower.includes('cristian') || lower.includes('gil') || lower.includes('alca') || lower.includes('cartel') || lower.includes('feat') || lower.includes('live')) return 'lineup';
  if (lower.includes('cta') || lower.includes('btn') || lower.includes('button') || lower.includes('ticket') || lower.includes('comprar') || lower.includes('entradas') || lower.includes('info')) return 'cta';
  if (lower.includes('logo') || lower.includes('brand') || lower.includes('crest') || lower.includes('sello') || lower.includes('escudo')) return 'logo';
  if (lower.includes('fx') || lower.includes('light') || lower.includes('glow') || lower.includes('grid') || lower.includes('flare') || lower.includes('spark') || lower.includes('neon')) return 'fx';
  
  // Spatial fallback if name is generic
  if (normY !== undefined) {
    if (normY < 350) return 'title';
    if (normY > 1500) return 'cta';
    if (area > 300000) return 'hero';
  }

  return 'custom';
}

function getDefaultAnimationsForRole(role: LayerRole, index: number, normY?: number, normX?: number) {
  switch (role) {
    case 'background':
      return {
        inAnimation: { type: 'fadeIn' as const, start: 0.0, duration: 0.6, easing: 'linear' as const },
        loopAnimation: { type: 'slowZoom' as const, start: 0.0, duration: 7.0, intensity: 0.5, speed: 1.0 },
        outAnimation: { type: 'fadeOut' as const, start: 6.4, duration: 0.6, easing: 'linear' as const },
        effects: [],
      };
    case 'hero':
      return {
        inAnimation: { type: 'scaleFade' as const, start: 0.1, duration: 0.85, easing: 'easeOutBack' as const },
        loopAnimation: { type: 'loopPulse' as const, start: 1.0, duration: 6.0, intensity: 1.1, speed: 1.0 },
        outAnimation: { type: 'scaleOut' as const, start: 6.2, duration: 0.8, easing: 'easeInBack' as const },
        effects: [
          {
            id: `eff_neon_${Date.now()}`,
            type: 'glowNeon' as const,
            enabled: true,
            start: 0.0,
            duration: 7.0,
            intensity: 1.0,
            color: '#00f0ff',
          },
        ],
      };
    case 'title':
      return {
        inAnimation: { type: 'slideDownFade' as const, start: 0.35, duration: 0.75, easing: 'easeOutBack' as const },
        loopAnimation: { type: 'slowZoom' as const, start: 1.2, duration: 5.8, intensity: 0.5, speed: 1.0 },
        outAnimation: { type: 'neonOut' as const, start: 6.2, duration: 0.8, easing: 'easeInBack' as const },
        effects: [
          {
            id: `eff_title_glow_${Date.now()}`,
            type: 'glowNeon' as const,
            enabled: true,
            start: 0.4,
            duration: 6.6,
            intensity: 1.1,
            color: '#f72585',
          },
        ],
      };
    case 'date':
      return {
        inAnimation: { type: 'slideDownFade' as const, start: 0.55, duration: 0.7, easing: 'easeOutBack' as const },
        loopAnimation: { type: 'none' as const, start: 0, duration: 7, intensity: 1, speed: 1 },
        outAnimation: { type: 'slideOut' as const, start: 6.2, duration: 0.8, easing: 'easeInQuad' as const },
        effects: [],
      };
    case 'lineup':
      return {
        inAnimation: { type: 'slideUpFade' as const, start: 0.8 + (index % 3) * 0.18, duration: 0.75, easing: 'easeOutExpo' as const },
        loopAnimation: { type: 'none' as const, start: 0, duration: 7, intensity: 1, speed: 1 },
        outAnimation: { type: 'fadeOut' as const, start: 6.2, duration: 0.8, easing: 'linear' as const },
        effects: [],
      };
    case 'cta':
      return {
        inAnimation: { type: 'pop' as const, start: 1.3, duration: 0.7, easing: 'easeOutBack' as const },
        loopAnimation: { type: 'loopPulse' as const, start: 2.0, duration: 5.0, intensity: 1.3, speed: 1.2 },
        outAnimation: { type: 'scaleOut' as const, start: 6.3, duration: 0.7, easing: 'easeInBack' as const },
        effects: [
          {
            id: `eff_cta_sweep_${Date.now()}`,
            type: 'lightSweep' as const,
            enabled: true,
            start: 2.2,
            duration: 1.0,
            intensity: 1.0,
          },
        ],
      };
    case 'logo':
      return {
        inAnimation: { type: 'zoomBurst' as const, start: 0.2, duration: 0.75, easing: 'easeOutExpo' as const },
        loopAnimation: { type: 'none' as const, start: 0, duration: 7, intensity: 1, speed: 1 },
        outAnimation: { type: 'fadeOut' as const, start: 6.3, duration: 0.7, easing: 'linear' as const },
        effects: [],
      };
    case 'fx':
      return {
        inAnimation: { type: 'strobeIn' as const, start: 0.15, duration: 0.65, easing: 'easeOutQuad' as const },
        loopAnimation: { type: 'none' as const, start: 0, duration: 7, intensity: 1, speed: 1 },
        outAnimation: { type: 'fadeOut' as const, start: 6.2, duration: 0.8, easing: 'linear' as const },
        effects: [],
      };
    default: {
      const staggeredStart = 0.2 + (index % 5) * 0.22;
      const y = normY ?? 960;
      const x = normX ?? 540;

      // Select dynamic motion entrance based on screen placement
      let inType: 'slideDownFade' | 'slideUpFade' | 'slideLeft' | 'slideRight' | 'pop' | 'scaleFade' = 'pop';
      if (y < 700) {
        inType = 'slideDownFade';
      } else if (y > 1200) {
        inType = 'slideUpFade';
      } else if (x < 300) {
        inType = 'slideRight';
      } else if (x > 780) {
        inType = 'slideLeft';
      } else {
        inType = index % 2 === 0 ? 'scaleFade' : 'pop';
      }

      return {
        inAnimation: { type: inType, start: staggeredStart, duration: 0.75, easing: 'easeOutBack' as const },
        loopAnimation: { type: 'none' as const, start: 0, duration: 7, intensity: 1, speed: 1 },
        outAnimation: { type: 'fadeOut' as const, start: 6.3, duration: 0.7, easing: 'linear' as const },
        effects: [],
      };
    }
  }
}

function mapPsdBlendMode(mode?: string): GlobalCompositeOperation {
  if (!mode) return 'source-over';
  const m = mode.toLowerCase().trim();
  switch (m) {
    case 'screen':
      return 'screen';
    case 'linear dodge':
    case 'linear dodge (add)':
    case 'lighter color':
      return 'lighter';
    case 'multiply':
      return 'multiply';
    case 'overlay':
      return 'overlay';
    case 'darken':
    case 'darker color':
      return 'darken';
    case 'lighten':
      return 'lighten';
    case 'color dodge':
      return 'color-dodge';
    case 'color burn':
    case 'linear burn':
      return 'color-burn';
    case 'hard light':
      return 'hard-light';
    case 'soft light':
      return 'soft-light';
    case 'difference':
      return 'difference';
    case 'exclusion':
      return 'exclusion';
    case 'hue':
      return 'hue';
    case 'saturation':
      return 'saturation';
    case 'color':
      return 'color';
    case 'luminosity':
      return 'luminosity';
    case 'normal':
    case 'pass through':
    default:
      return 'source-over';
  }
}

function applyMaskToCanvas(
  layerCanvas: HTMLCanvasElement,
  layerLeft: number,
  layerTop: number,
  mask: any
): HTMLCanvasElement {
  if (!mask || mask.disabled) return layerCanvas;

  let maskCanvas: HTMLCanvasElement | undefined = mask.canvas;
  if (!maskCanvas && mask.imageData) {
    try {
      maskCanvas = document.createElement('canvas');
      maskCanvas.width = mask.imageData.width;
      maskCanvas.height = mask.imageData.height;
      const mCtx = maskCanvas.getContext('2d');
      if (mCtx) mCtx.putImageData(mask.imageData, 0, 0);
    } catch {
      maskCanvas = undefined;
    }
  }

  if (!maskCanvas) return layerCanvas;

  const w = layerCanvas.width;
  const h = layerCanvas.height;
  if (w <= 0 || h <= 0) return layerCanvas;

  try {
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = w;
    outputCanvas.height = h;
    const outCtx = outputCanvas.getContext('2d');
    if (!outCtx) return layerCanvas;

    outCtx.drawImage(layerCanvas, 0, 0);

    const imgData = outCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const mCtx = maskCanvas.getContext('2d');
    if (!mCtx) return layerCanvas;
    const maskW = maskCanvas.width;
    const maskH = maskCanvas.height;
    const maskImgData = mCtx.getImageData(0, 0, maskW, maskH);
    const maskData = maskImgData.data;

    const maskLeft = (mask.left ?? layerLeft) - layerLeft;
    const maskTop = (mask.top ?? layerTop) - layerTop;
    const defaultAlpha = (mask.defaultColor ?? 0) === 255 ? 1 : 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const mx = x - maskLeft;
        const my = y - maskTop;

        let maskVal = defaultAlpha;
        if (mx >= 0 && mx < maskW && my >= 0 && my < maskH) {
          const mIdx = (my * maskW + mx) * 4;
          // Grayscale mask: R channel represents mask luminance (0=transparent, 255=opaque)
          maskVal = maskData[mIdx] / 255;
        }

        data[idx + 3] = Math.round(data[idx + 3] * maskVal);
      }
    }

    outCtx.putImageData(imgData, 0, 0);
    return outputCanvas;
  } catch (err) {
    console.warn('Error applying layer mask:', err);
    return layerCanvas;
  }
}

/**
 * Parses a File (PSD format) and outputs a fully reconstructed SceneProject
 */
export async function parsePsdFile(file: File): Promise<SceneProject> {
  const buffer = await file.arrayBuffer();
  const psd = readPsd(buffer, { skipLayerImageData: false });

  const rawWidth = psd.width || 1080;
  const rawHeight = psd.height || 1920;

  // Normalization scale factor so canvas fits 1080x1920 logical space
  const scaleX = 1080 / rawWidth;
  const scaleY = 1920 / rawHeight;
  const scale = Math.min(scaleX, scaleY);

  const sceneLayers: SceneLayer[] = [];

  function processLayer(node: any, path = '') {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        processLayer(child, path ? `${path}/${node.name}` : node.name);
      }
      return;
    }

    let layerCanvas: HTMLCanvasElement | undefined = node.canvas || node.image;

    // Skip adjustment layers, empty groups or non-raster nodes without image data
    // (Prevents generating phantom translucent white boxes)
    if (!layerCanvas) {
      return;
    }

    const layerName = node.name || `Layer_${sceneLayers.length + 1}`;
    const left = node.left ?? 0;
    const top = node.top ?? 0;
    const right = node.right ?? left + layerCanvas.width;
    const bottom = node.bottom ?? top + layerCanvas.height;

    const layerW = Math.max(1, right - left);
    const layerH = Math.max(1, bottom - top);

    // Apply Photoshop layer mask if present
    if (node.mask && !node.mask.disabled) {
      layerCanvas = applyMaskToCanvas(layerCanvas, left, top, node.mask);
    }

    // Coordinate mapping to 1080x1920 viewport
    const normX = Math.round(left * scale + (1080 - rawWidth * scale) / 2);
    const normY = Math.round(top * scale + (1920 - rawHeight * scale) / 2);
    const normW = Math.round(layerW * scale);
    const normH = Math.round(layerH * scale);

    const role = detectLayerRole(layerName, normY, normW, normH);
    const blendMode = mapPsdBlendMode(node.blendMode);
    const animDefaults = getDefaultAnimationsForRole(role, sceneLayers.length, normY, normX);

    const layer: SceneLayer = {
      id: `psd_layer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: layerName,
      role,
      x: normX,
      y: normY,
      width: normW,
      height: normH,
      opacity: node.opacity !== undefined ? node.opacity : 1,
      blendMode,
      visible: node.hidden ? false : true,
      locked: role === 'background',
      canvas: layerCanvas,
      inAnimation: animDefaults.inAnimation,
      loopAnimation: animDefaults.loopAnimation,
      outAnimation: animDefaults.outAnimation,
      effects: animDefaults.effects,
    };

    sceneLayers.push(layer);
  }

  if (psd.children) {
    for (const child of psd.children) {
      processLayer(child);
    }
  }

  // Reverse so top layer in PSD matches top in render order
  // (In PSD array, index 0 is often background or top depending on parser; ag-psd returns back-to-front order)
  return {
    settings: {
      name: file.name.replace(/\.[^/.]+$/, ''),
      width: 1080,
      height: 1920,
      duration: 7.0,
      fps: 30,
      backgroundColor: '#050508',
    },
    layers: sceneLayers,
  };
}
