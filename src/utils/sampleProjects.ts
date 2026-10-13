
export function createEmptyProject(): SceneProject {
  return {
    settings: {
      name: 'Nuevo Proyecto',
      width: 1080,
      height: 1920,
      duration: 7.0,
      fps: 30,
      backgroundColor: '#030907',
    },
    slides: [
      { id: 'slide-1', title: 'Diapositiva 1: Intro Logo', startTime: 0, duration: 2.5, transition: 'neonFlash' },
      { id: 'slide-2', title: 'Diapositiva 2: Flyer Principal', startTime: 2.5, duration: 4.5, transition: 'fade' },
    ],
    layers: [],
  };
}
import type { SceneLayer, SceneProject, AIProposal } from '../types/scene';

/**
 * Creates an in-memory HTMLCanvasElement and renders custom graphic into it
 */
function createGraphicCanvas(
  width: number,
  height: number,
  renderFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    renderFn(ctx, width, height);
  }
  return canvas;
}

/**
 * Project 1: Electronic Music Festival (Reference from Spec)
 */
export function createElectronicFestivalProject(): SceneProject {
  const W = 1080;
  const H = 1920;

  // 1. BACKGROUND LAYER (1080x1920)
  const bgCanvas = createGraphicCanvas(W, H, (ctx, w, h) => {
    // Deep dark electronic club atmosphere
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.45, 100, w / 2, h / 2, h * 0.8);
    bgGrad.addColorStop(0, '#1a0b36');
    bgGrad.addColorStop(0.4, '#0d051e');
    bgGrad.addColorStop(1, '#040209');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Diagonal ambient light beams
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 120;
    ctx.beginPath();
    ctx.moveTo(-100, -100);
    ctx.lineTo(w + 300, h + 300);
    ctx.stroke();

    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 90;
    ctx.beginPath();
    ctx.moveTo(w + 100, -100);
    ctx.lineTo(-200, h + 200);
    ctx.stroke();
    ctx.restore();

    // Stage dust particles
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 90; i++) {
      const px = (i * 123) % w;
      const py = (i * 247) % h;
      const pr = (i % 3) + 1;
      ctx.globalAlpha = 0.2 + (i % 5) * 0.1;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 2. GRID / SYNTHWAVE PERSPECTIVE FX (1080x800)
  const gridCanvas = createGraphicCanvas(1080, 700, (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2;

    // Horizon line
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(w, 50);
    ctx.stroke();

    // Perspective lines from horizon center
    const cx = w / 2;
    const cy = 50;
    for (let x = -400; x <= w + 400; x += 90) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Horizontal receding lines
    for (let y = 50; y <= h; y += Math.pow((y - 40) / 25, 1.4)) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });

  // 3. HERO OBJECT (3D Holographic Festival Totem / Metallic Prism)
  const heroCanvas = createGraphicCanvas(700, 700, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Outer neon glow ring
    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 35;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 260, 0, Math.PI * 2);
    ctx.stroke();

    // Inner magenta ring
    ctx.strokeStyle = '#f72585';
    ctx.shadowColor = '#f72585';
    ctx.shadowBlur = 30;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 220, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3D Hexagon / Prism
    ctx.save();
    ctx.translate(cx, cy);
    const grad = ctx.createLinearGradient(-200, -200, 200, 200);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#7209b7');
    grad.addColorStop(0.7, '#4361ee');
    grad.addColorStop(1, '#00f0ff');
    ctx.fillStyle = grad;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const r = 180;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Chrome reflection facets
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(180, 0);
    ctx.lineTo(90, 155);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-180, 0);
    ctx.lineTo(-90, -155);
    ctx.closePath();
    ctx.fill();

    // Center pulsating emblem
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 4. DATE BADGE (15.08.2026 • IBIZA ARENA)
  const dateCanvas = createGraphicCanvas(800, 120, (ctx, w, h) => {
    // Pill capsule background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
    ctx.shadowBlur = 12;

    const rad = h / 2;
    ctx.beginPath();
    ctx.roundRect(40, 15, w - 80, h - 30, rad);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.font = '700 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillText('⚡ 15.08.2026 • IBIZA STADIUM ⚡', w / 2, h / 2);
    ctx.restore();
  });

  // 5. TITLE TYPOGRAPHY (NEXUS FESTIVAL)
  const titleCanvas = createGraphicCanvas(960, 260, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';

    // Top subtitle
    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f72585';
    ctx.letterSpacing = '8px';
    ctx.fillText('ELECTRONIC MUSIC REVOLUTION', w / 2, 55);

    // Big Main Brand Title
    ctx.font = '900 120px "Outfit", sans-serif';
    const grad = ctx.createLinearGradient(100, 80, w - 100, 210);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#00f0ff');
    grad.addColorStop(1, '#f72585');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 25;
    ctx.fillText('NEXUS FEST', w / 2, 185);
    ctx.restore();
  });

  // 6. LINEUP ARTISTS
  const lineupCanvas = createGraphicCanvas(920, 160, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 32px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText('CHARLOTTE DE WITTE  •  TALE OF US', w / 2, 55);

    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('AMELIE LENS  •  BORIS BREJCHA  •  ARTBAT', w / 2, 115);
    ctx.restore();
  });

  // 7. CTA BUTTON
  const ctaCanvas = createGraphicCanvas(640, 150, (ctx, w, h) => {
    ctx.save();
    const bx = 30;
    const by = 20;
    const bw = w - 60;
    const bh = h - 40;

    // Glowing gradient button
    const btnGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    btnGrad.addColorStop(0, '#f72585');
    btnGrad.addColorStop(1, '#7209b7');
    ctx.fillStyle = btnGrad;
    ctx.shadowColor = '#f72585';
    ctx.shadowBlur = 24;

    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 35);
    ctx.fill();

    // Border highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Text
    ctx.font = '800 38px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.fillText('GET TICKETS NOW →', w / 2, h / 2);
    ctx.restore();
  });

  // 8. LOGO
  const logoCanvas = createGraphicCanvas(400, 110, (ctx, w, h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 30px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillText('// NEXUS 2026', w / 2, h / 2);
    ctx.restore();
  });

  const layers: SceneLayer[] = [
    {
      id: 'layer_bg',
      name: 'BACKGROUND',
      role: 'background',
      x: 0,
      y: 0,
      width: W,
      height: H,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: true,
      canvas: bgCanvas,
      inAnimation: {
        type: 'fadeIn',
        start: 0.0,
        duration: 0.5,
        easing: 'linear',
      },
      loopAnimation: {
        type: 'slowZoom',
        start: 0.0,
        duration: 7.0,
        intensity: 0.5,
        speed: 1.0,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.4,
        duration: 0.6,
        easing: 'easeInQuad',
      },
      effects: [
        {
          id: 'eff_bg_noise',
          type: 'noise',
          enabled: false,
          start: 0,
          duration: 7,
          intensity: 0.1,
        },
      ],
    },
    {
      id: 'layer_grid',
      name: 'GRID_FX',
      role: 'fx',
      x: 0,
      y: 1220,
      width: 1080,
      height: 700,
      opacity: 0.7,
      blendMode: 'screen',
      visible: true,
      locked: false,
      canvas: gridCanvas,
      inAnimation: {
        type: 'fadeIn',
        start: 0.2,
        duration: 0.8,
        easing: 'easeOutQuad',
      },
      loopAnimation: {
        type: 'none',
        start: 0.0,
        duration: 7.0,
        intensity: 1.0,
        speed: 1.0,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInQuad',
      },
      effects: [],
    },
    {
      id: 'layer_hero',
      name: 'HERO_OBJECT',
      role: 'hero',
      x: (W - 700) / 2,
      y: 530,
      width: 700,
      height: 700,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: heroCanvas,
      inAnimation: {
        type: 'scaleFade',
        start: 0.0,
        duration: 1.0,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'loopPulse',
        start: 1.0,
        duration: 6.0,
        intensity: 1.0,
        speed: 1.0,
      },
      outAnimation: {
        type: 'scaleOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInBack',
      },
      effects: [
        {
          id: 'eff_hero_neon',
          type: 'glowNeon',
          enabled: true,
          start: 0.0,
          duration: 7.0,
          intensity: 1.2,
          color: '#00f0ff',
        },
        {
          id: 'eff_hero_rgb',
          type: 'rgbSplit',
          enabled: true,
          start: 2.5,
          duration: 1.5,
          intensity: 0.8,
        },
      ],
    },
    {
      id: 'layer_logo',
      name: 'STAGE_LOGO',
      role: 'logo',
      x: (W - 400) / 2,
      y: 80,
      width: 400,
      height: 110,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: logoCanvas,
      inAnimation: {
        type: 'slideDownFade',
        start: 0.1,
        duration: 0.6,
        easing: 'easeOutCubic',
      },
      loopAnimation: {
        type: 'none',
        start: 0,
        duration: 7,
        intensity: 1,
        speed: 1,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.4,
        duration: 0.6,
        easing: 'linear',
      },
      effects: [],
    },
    {
      id: 'layer_date',
      name: 'DATE_BADGE',
      role: 'date',
      x: (W - 800) / 2,
      y: 200,
      width: 800,
      height: 120,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: dateCanvas,
      inAnimation: {
        type: 'slideDownFade',
        start: 0.2,
        duration: 0.7,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'none',
        start: 0,
        duration: 7,
        intensity: 1,
        speed: 1,
      },
      outAnimation: {
        type: 'slideOut',
        start: 6.1,
        duration: 0.7,
        easing: 'easeInQuad',
      },
      effects: [
        {
          id: 'eff_date_sweep',
          type: 'lightSweep',
          enabled: true,
          start: 1.5,
          duration: 1.2,
          intensity: 1.0,
        },
      ],
    },
    {
      id: 'layer_title',
      name: 'TITLE_NEXUS',
      role: 'title',
      x: (W - 960) / 2,
      y: 330,
      width: 960,
      height: 260,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: titleCanvas,
      inAnimation: {
        type: 'neonReveal',
        start: 0.8,
        duration: 0.9,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'slowZoom',
        start: 1.7,
        duration: 5.3,
        intensity: 0.6,
        speed: 1,
      },
      outAnimation: {
        type: 'neonOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInBack',
      },
      effects: [
        {
          id: 'eff_title_glow',
          type: 'glowNeon',
          enabled: true,
          start: 0.8,
          duration: 6.2,
          intensity: 1.0,
          color: '#f72585',
        },
      ],
    },
    {
      id: 'layer_lineup',
      name: 'LINEUP_ARTISTS',
      role: 'lineup',
      x: (W - 920) / 2,
      y: 1250,
      width: 920,
      height: 160,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: lineupCanvas,
      inAnimation: {
        type: 'slideUpFade',
        start: 2.0,
        duration: 0.8,
        easing: 'easeOutCubic',
      },
      loopAnimation: {
        type: 'none',
        start: 2.8,
        duration: 4.2,
        intensity: 1,
        speed: 1,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInQuad',
      },
      effects: [],
    },
    {
      id: 'layer_cta',
      name: 'CTA_BUTTON',
      role: 'cta',
      x: (W - 640) / 2,
      y: 1530,
      width: 640,
      height: 150,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: ctaCanvas,
      inAnimation: {
        type: 'pop',
        start: 3.2,
        duration: 0.7,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'loopPulse',
        start: 3.9,
        duration: 3.1,
        intensity: 1.4,
        speed: 1.2,
      },
      outAnimation: {
        type: 'scaleOut',
        start: 6.3,
        duration: 0.7,
        easing: 'easeInBack',
      },
      effects: [
        {
          id: 'eff_cta_sweep',
          type: 'lightSweep',
          enabled: true,
          start: 4.2,
          duration: 1.0,
          intensity: 1.0,
        },
      ],
    },
  ];

  return {
    settings: {
      name: 'Nexus Electronic Festival Story',
      width: W,
      height: H,
      duration: 7.0,
      fps: 30,
      backgroundColor: '#040209',
    },
    layers,
  };
}

/**
 * 3 AI Creative Director Proposals (as specified in Section 8)
 */
export function getAIProposals(): AIProposal[] {
  return [
    {
      id: 'proposal_elegant',
      name: 'Elegant',
      tagline: 'Fades suaves, zoom cinematográfico y parallax refinado',
      description: 'Ideal para festivales de prestigio o marcas premium. Movimientos fluidos sin estridencias.',
      vibe: 'Cine & Lujo',
      colorScheme: 'Obsidiana & Oro',
      accentColor: '#ffd166',
      layerConfigs: {
        background: {
          inAnimation: { type: 'fadeIn', start: 0.0, duration: 1.0, easing: 'linear' },
          loopAnimation: { type: 'slowZoom', start: 0.0, duration: 7.0, intensity: 0.4, speed: 0.8 },
          outAnimation: { type: 'fadeOut', start: 6.2, duration: 0.8, easing: 'linear' },
        },
        hero: {
          inAnimation: { type: 'scaleFade', start: 0.3, duration: 1.4, easing: 'easeOutCubic' },
          loopAnimation: { type: 'floatParallax', start: 1.7, duration: 5.3, intensity: 0.8, speed: 0.9 },
          outAnimation: { type: 'fadeOut', start: 6.0, duration: 1.0, easing: 'easeInQuad' },
        },
        date: {
          inAnimation: { type: 'slideDownFade', start: 0.8, duration: 0.9, easing: 'easeOutCubic' },
          loopAnimation: { type: 'none', start: 0, duration: 7, intensity: 1, speed: 1 },
          outAnimation: { type: 'fadeOut', start: 6.1, duration: 0.9, easing: 'linear' },
        },
        title: {
          inAnimation: { type: 'fadeIn', start: 1.2, duration: 1.2, easing: 'easeOutCubic' },
          loopAnimation: { type: 'slowZoom', start: 2.4, duration: 4.6, intensity: 0.5, speed: 0.7 },
          outAnimation: { type: 'fadeOut', start: 6.2, duration: 0.8, easing: 'easeInQuad' },
        },
        lineup: {
          inAnimation: { type: 'slideUpFade', start: 2.2, duration: 1.0, easing: 'easeOutCubic' },
          loopAnimation: { type: 'none', start: 0, duration: 7, intensity: 1, speed: 1 },
          outAnimation: { type: 'fadeOut', start: 6.2, duration: 0.8, easing: 'linear' },
        },
        cta: {
          inAnimation: { type: 'scaleFade', start: 3.5, duration: 0.9, easing: 'easeOutBack' },
          loopAnimation: { type: 'loopPulse', start: 4.4, duration: 2.6, intensity: 0.8, speed: 0.9 },
          outAnimation: { type: 'fadeOut', start: 6.3, duration: 0.7, easing: 'easeInQuad' },
        },
      },
    },
    {
      id: 'proposal_dynamic',
      name: 'Dynamic',
      tagline: 'Slides veloces, bounces, ritmo marcado y micro-glitches',
      description: 'Enfocado a maximizar el engagement en Stories con transiciones ágiles y snap visual.',
      vibe: 'Energía & Impacto',
      colorScheme: 'Cyber Red & Deep Navy',
      accentColor: '#06d6a0',
      layerConfigs: {
        background: {
          inAnimation: { type: 'fadeIn', start: 0.0, duration: 0.3, easing: 'linear' },
          loopAnimation: { type: 'slowZoom', start: 0.0, duration: 7.0, intensity: 0.7, speed: 1.2 },
          outAnimation: { type: 'zoomOut', start: 6.3, duration: 0.7, easing: 'easeInQuad' },
        },
        hero: {
          inAnimation: { type: 'zoomBurst', start: 0.0, duration: 0.7, easing: 'easeOutBack' },
          loopAnimation: { type: 'loopPulse', start: 0.7, duration: 5.6, intensity: 1.3, speed: 1.4 },
          outAnimation: { type: 'glitchOut', start: 6.3, duration: 0.7, easing: 'easeInBack' },
        },
        date: {
          inAnimation: { type: 'slideLeft', start: 0.2, duration: 0.5, easing: 'easeOutBack' },
          loopAnimation: { type: 'none', start: 0, duration: 7, intensity: 1, speed: 1 },
          outAnimation: { type: 'slideOut', start: 6.2, duration: 0.8, easing: 'easeInBack' },
        },
        title: {
          inAnimation: { type: 'pop', start: 0.6, duration: 0.6, easing: 'easeOutBack' },
          loopAnimation: { type: 'loopPulse', start: 1.2, duration: 5.1, intensity: 1.1, speed: 1.2 },
          outAnimation: { type: 'scaleOut', start: 6.2, duration: 0.8, easing: 'easeInBack' },
        },
        lineup: {
          inAnimation: { type: 'slideRight', start: 1.4, duration: 0.6, easing: 'easeOutBack' },
          loopAnimation: { type: 'none', start: 0, duration: 7, intensity: 1, speed: 1 },
          outAnimation: { type: 'slideOut', start: 6.2, duration: 0.8, easing: 'easeInQuad' },
        },
        cta: {
          inAnimation: { type: 'pop', start: 2.2, duration: 0.5, easing: 'easeOutBack' },
          loopAnimation: { type: 'loopPulse', start: 2.7, duration: 3.6, intensity: 1.6, speed: 1.5 },
          outAnimation: { type: 'scaleOut', start: 6.3, duration: 0.7, easing: 'easeInBack' },
        },
      },
    },
    {
      id: 'proposal_neon',
      name: 'Neon Cyber',
      tagline: 'Glow reactivo, revelación neón, RGB split y light sweep',
      description: 'El estilo icónico de la música electrónica. Resalta la luminosidad y el color saturado.',
      vibe: 'Festival Rave & Tech',
      colorScheme: 'Cyan #00f0ff & Magenta #f72585',
      accentColor: '#00f0ff',
      layerConfigs: {
        background: {
          inAnimation: { type: 'fadeIn', start: 0.0, duration: 0.4, easing: 'linear' },
          loopAnimation: { type: 'neonFlicker', start: 0.0, duration: 7.0, intensity: 0.8, speed: 1.0 },
          outAnimation: { type: 'fadeOut', start: 6.4, duration: 0.6, easing: 'easeInQuad' },
        },
        hero: {
          inAnimation: { type: 'scaleFade', start: 0.0, duration: 0.9, easing: 'easeOutBack' },
          loopAnimation: { type: 'loopPulse', start: 0.9, duration: 5.5, intensity: 1.1, speed: 1.2 },
          outAnimation: { type: 'neonOut', start: 6.2, duration: 0.8, easing: 'easeInBack' },
        },
        date: {
          inAnimation: { type: 'slideDownFade', start: 0.3, duration: 0.6, easing: 'easeOutBack' },
          loopAnimation: { type: 'none', start: 0, duration: 7, intensity: 1, speed: 1 },
          outAnimation: { type: 'neonOut', start: 6.1, duration: 0.7, easing: 'easeInBack' },
        },
        title: {
          inAnimation: { type: 'neonReveal', start: 0.7, duration: 0.8, easing: 'easeOutBack' },
          loopAnimation: { type: 'slowZoom', start: 1.5, duration: 4.8, intensity: 0.8, speed: 1 },
          outAnimation: { type: 'neonOut', start: 6.2, duration: 0.8, easing: 'easeInBack' },
        },
        lineup: {
          inAnimation: { type: 'slideUpFade', start: 1.6, duration: 0.7, easing: 'easeOutCubic' },
          loopAnimation: { type: 'none', start: 0, duration: 7, intensity: 1, speed: 1 },
          outAnimation: { type: 'fadeOut', start: 6.2, duration: 0.8, easing: 'easeInQuad' },
        },
        cta: {
          inAnimation: { type: 'pop', start: 2.8, duration: 0.6, easing: 'easeOutBack' },
          loopAnimation: { type: 'loopPulse', start: 3.4, duration: 2.9, intensity: 1.4, speed: 1.3 },
          outAnimation: { type: 'neonOut', start: 6.3, duration: 0.7, easing: 'easeInBack' },
        },
      },
    },
  ];
}

/**
 * Project: Movent Brand Motion (Official Colors & Logo)
 */
export function createMoventBrandProject(): SceneProject {
  const W = 1080;
  const H = 1920;

  // 1. BACKGROUND (Negro #030907 con gradiente radial Verde Oscuro #063D29)
  const bgCanvas = createGraphicCanvas(W, H, (ctx, w, h) => {
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.42, 120, w / 2, h / 2, h * 0.85);
    bgGrad.addColorStop(0, '#063D29');
    bgGrad.addColorStop(0.5, '#03160e');
    bgGrad.addColorStop(1, '#030907');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Beams Verde Turquesa #007B49 y Verde Brillante #23C83C
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#23C83C';
    ctx.lineWidth = 140;
    ctx.beginPath();
    ctx.moveTo(-100, -100);
    ctx.lineTo(w + 300, h + 300);
    ctx.stroke();

    ctx.strokeStyle = '#007B49';
    ctx.lineWidth = 100;
    ctx.beginPath();
    ctx.moveTo(w + 100, -100);
    ctx.lineTo(-200, h + 200);
    ctx.stroke();
    ctx.restore();

    // Subtle emerald dust particles
    ctx.fillStyle = '#23C83C';
    for (let i = 0; i < 80; i++) {
      const px = (i * 137) % w;
      const py = (i * 257) % h;
      const pr = (i % 3) + 1;
      ctx.globalAlpha = 0.15 + (i % 5) * 0.08;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 2. GRID EMERALD FX (1080x700)
  const gridCanvas = createGraphicCanvas(1080, 700, (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(35, 200, 60, 0.3)';
    ctx.lineWidth = 2;

    const cx = w / 2;
    const cy = 40;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    for (let x = -300; x <= w + 300; x += 100) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for (let y = 40; y <= h; y += Math.pow((y - 30) / 24, 1.4)) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });

  // 3. HERO OBJECT - MOVENT BRAND ICON / LOGO (600x600)
  const heroCanvas = createGraphicCanvas(600, 600, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Glowing Neon Rings en Verde Brillante #23C83C y Turquesa #007B49
    ctx.save();
    ctx.strokeStyle = '#23C83C';
    ctx.shadowColor = '#23C83C';
    ctx.shadowBlur = 40;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 240, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#007B49';
    ctx.shadowColor = '#007B49';
    ctx.shadowBlur = 30;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Central circular plate
    ctx.save();
    ctx.translate(cx, cy);
    const grad = ctx.createLinearGradient(-180, -180, 180, 180);
    grad.addColorStop(0, '#063D29');
    grad.addColorStop(0.5, '#178D1B');
    grad.addColorStop(1, '#23C83C');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#23C83C';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fill();

    // Central Movent 'M' emblem
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 120px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFFFFF';
    ctx.fillText('M', 0, 8);
    ctx.restore();

    // Draw logo-white.png if loaded
    const logoImg = new Image();
    logoImg.src = `${import.meta.env.BASE_URL}icon-green-512.png`;
    logoImg.onload = () => {
      ctx.drawImage(logoImg, cx - 140, cy - 140, 280, 280);
    };
  });

  // 4. DATE / BRAND BADGE (800x120)
  const dateCanvas = createGraphicCanvas(800, 120, (ctx, w, h) => {
    ctx.save();
    ctx.fillStyle = 'rgba(6, 61, 41, 0.45)';
    ctx.strokeStyle = '#23C83C';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(35, 200, 60, 0.5)';
    ctx.shadowBlur = 14;

    const rad = h / 2;
    ctx.beginPath();
    ctx.roundRect(40, 15, w - 80, h - 30, rad);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 34px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#23C83C';
    ctx.shadowColor = '#23C83C';
    ctx.shadowBlur = 10;
    ctx.fillText('⚡ MOVENT MOTION STUDIO ⚡', w / 2, h / 2);
    ctx.restore();
  });

  // 5. TITLE TYPOGRAPHY (MOVENT)
  const titleCanvas = createGraphicCanvas(960, 260, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';

    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#23C83C';
    ctx.letterSpacing = '8px';
    ctx.fillText('BRAND MOTION & CREATIVE AI', w / 2, 55);

    ctx.font = '900 130px "Outfit", sans-serif';
    const grad = ctx.createLinearGradient(150, 80, w - 150, 210);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.5, '#23C83C');
    grad.addColorStop(1, '#007B49');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#23C83C';
    ctx.shadowBlur = 30;
    ctx.fillText('MOVENT', w / 2, 190);
    ctx.restore();
  });

  // 6. TAGLINE / LINEUP
  const lineupCanvas = createGraphicCanvas(920, 160, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 34px "Outfit", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(35, 200, 60, 0.4)';
    ctx.shadowBlur = 10;
    ctx.fillText('CREATIVE AI  •  DETERMINISTIC TIMELINE', w / 2, 55);

    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('STORIES 9:16  •  PSD PARSER  •  HIGH PERFORMANCE', w / 2, 115);
    ctx.restore();
  });

  // 7. CTA BUTTON
  const ctaCanvas = createGraphicCanvas(640, 150, (ctx, w, h) => {
    ctx.save();
    const bx = 30;
    const by = 20;
    const bw = w - 60;
    const bh = h - 40;

    const btnGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    btnGrad.addColorStop(0, '#23C83C');
    btnGrad.addColorStop(1, '#178D1B');
    ctx.fillStyle = btnGrad;
    ctx.shadowColor = '#23C83C';
    ctx.shadowBlur = 28;

    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 35);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '800 38px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#030907';
    ctx.shadowBlur = 0;
    ctx.fillText('DESCUBRIR MOVENT →', w / 2, h / 2);
    ctx.restore();
  });

  // 8. LOGO CREST
  const logoCanvas = createGraphicCanvas(400, 110, (ctx, w, h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#23C83C';
    ctx.shadowBlur = 12;
    ctx.fillText('// MOVENT 2026', w / 2, h / 2);
    ctx.restore();
  });

  const layers: SceneLayer[] = [
    {
      id: 'layer_bg_movent',
      name: 'BACKGROUND',
      role: 'background',
      x: 0,
      y: 0,
      width: W,
      height: H,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: true,
      canvas: bgCanvas,
      inAnimation: {
        type: 'fadeIn',
        start: 0.0,
        duration: 0.5,
        easing: 'linear',
      },
      loopAnimation: {
        type: 'slowZoom',
        start: 0.0,
        duration: 7.0,
        intensity: 0.5,
        speed: 1.0,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.4,
        duration: 0.6,
        easing: 'easeInQuad',
      },
      effects: [],
    },
    {
      id: 'layer_grid_movent',
      name: 'GRID_FX',
      role: 'fx',
      x: 0,
      y: 1220,
      width: 1080,
      height: 700,
      opacity: 0.75,
      blendMode: 'screen',
      visible: true,
      locked: false,
      canvas: gridCanvas,
      inAnimation: {
        type: 'slideUpFade',
        start: 0.1,
        duration: 0.8,
        easing: 'easeOutExpo',
      },
      loopAnimation: {
        type: 'none',
        start: 0.0,
        duration: 7.0,
        intensity: 1.0,
        speed: 1.0,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInQuad',
      },
      effects: [],
    },
    {
      id: 'layer_hero_movent',
      name: 'HERO_OBJECT',
      role: 'hero',
      x: (W - 600) / 2,
      y: 560,
      width: 600,
      height: 600,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: heroCanvas,
      inAnimation: {
        type: 'scaleFade',
        start: 0.0,
        duration: 1.0,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'loopPulse',
        start: 1.0,
        duration: 6.0,
        intensity: 1.1,
        speed: 1.0,
      },
      outAnimation: {
        type: 'scaleOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInBack',
      },
      effects: [
        {
          id: 'eff_hero_neon_movent',
          type: 'glowNeon',
          enabled: true,
          start: 0.0,
          duration: 7.0,
          intensity: 1.4,
          color: '#23C83C',
        },
      ],
    },
    {
      id: 'layer_logo_movent',
      name: 'MOVENT_CREST',
      role: 'logo',
      x: (W - 400) / 2,
      y: 80,
      width: 400,
      height: 110,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: logoCanvas,
      inAnimation: {
        type: 'slideDownFade',
        start: 0.1,
        duration: 0.6,
        easing: 'easeOutCubic',
      },
      loopAnimation: {
        type: 'none',
        start: 0,
        duration: 7,
        intensity: 1,
        speed: 1,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.4,
        duration: 0.6,
        easing: 'linear',
      },
      effects: [],
    },
    {
      id: 'layer_badge_movent',
      name: 'DATE_BADGE',
      role: 'date',
      x: (W - 800) / 2,
      y: 200,
      width: 800,
      height: 120,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: dateCanvas,
      inAnimation: {
        type: 'slideDownFade',
        start: 0.2,
        duration: 0.7,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'none',
        start: 0,
        duration: 7,
        intensity: 1,
        speed: 1,
      },
      outAnimation: {
        type: 'slideOut',
        start: 6.1,
        duration: 0.7,
        easing: 'easeInQuad',
      },
      effects: [
        {
          id: 'eff_badge_sweep',
          type: 'lightSweep',
          enabled: true,
          start: 1.5,
          duration: 1.2,
          intensity: 1.0,
        },
      ],
    },
    {
      id: 'layer_title_movent',
      name: 'TITLE_MOVENT',
      role: 'title',
      x: (W - 960) / 2,
      y: 330,
      width: 960,
      height: 260,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: titleCanvas,
      inAnimation: {
        type: 'neonReveal',
        start: 0.8,
        duration: 0.9,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'slowZoom',
        start: 1.7,
        duration: 5.3,
        intensity: 0.6,
        speed: 1,
      },
      outAnimation: {
        type: 'neonOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInBack',
      },
      effects: [
        {
          id: 'eff_title_glow_movent',
          type: 'glowNeon',
          enabled: true,
          start: 0.8,
          duration: 6.2,
          intensity: 1.2,
          color: '#23C83C',
        },
      ],
    },
    {
      id: 'layer_lineup_movent',
      name: 'TAGLINE',
      role: 'lineup',
      x: (W - 920) / 2,
      y: 1250,
      width: 920,
      height: 160,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: lineupCanvas,
      inAnimation: {
        type: 'slideUpFade',
        start: 2.0,
        duration: 0.8,
        easing: 'easeOutCubic',
      },
      loopAnimation: {
        type: 'none',
        start: 2.8,
        duration: 4.2,
        intensity: 1,
        speed: 1,
      },
      outAnimation: {
        type: 'fadeOut',
        start: 6.2,
        duration: 0.8,
        easing: 'easeInQuad',
      },
      effects: [],
    },
    {
      id: 'layer_cta_movent',
      name: 'CTA_BUTTON',
      role: 'cta',
      x: (W - 640) / 2,
      y: 1530,
      width: 640,
      height: 150,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      locked: false,
      canvas: ctaCanvas,
      inAnimation: {
        type: 'pop',
        start: 3.2,
        duration: 0.7,
        easing: 'easeOutBack',
      },
      loopAnimation: {
        type: 'loopPulse',
        start: 3.9,
        duration: 3.1,
        intensity: 1.4,
        speed: 1.2,
      },
      outAnimation: {
        type: 'scaleOut',
        start: 6.3,
        duration: 0.7,
        easing: 'easeInBack',
      },
      effects: [
        {
          id: 'eff_cta_sweep_movent',
          type: 'lightSweep',
          enabled: true,
          start: 4.2,
          duration: 1.0,
          intensity: 1.0,
        },
      ],
    },
  ];

  return {
    settings: {
      name: 'Movent Brand Motion Story',
      width: W,
      height: H,
      duration: 7.0,
      fps: 30,
      backgroundColor: '#030907',
    },
    layers,
  };
}

// ============================================================
// --- MOTIONDESIGNART DEMO FLYER CREATORS ---
// ============================================================

/**
 * Afro@Live — Afrobeat & Amapiano Motion Flyer
 */
export function createAfroLiveProject(): SceneProject {
  const W = 1080;
  const H = 1920;

  const bgCanvas = createGraphicCanvas(W, H, (ctx, w, h) => {
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.45, 120, w / 2, h / 2, h * 0.85);
    bgGrad.addColorStop(0, '#2b1400');
    bgGrad.addColorStop(0.45, '#140800');
    bgGrad.addColorStop(1, '#050200');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Warm sun rays
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 90;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(-200, h);
    ctx.stroke();

    ctx.strokeStyle = '#ff6b00';
    ctx.lineWidth = 110;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w + 200, h);
    ctx.stroke();
    ctx.restore();

    // Floating gold sparks
    ctx.fillStyle = '#ffda79';
    for (let i = 0; i < 70; i++) {
      const px = (i * 157) % w;
      const py = (i * 289) % h;
      const pr = (i % 3) + 1.5;
      ctx.globalAlpha = 0.2 + (i % 4) * 0.15;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const sunCrestCanvas = createGraphicCanvas(700, 700, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    ctx.save();
    ctx.strokeStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 35;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 240, 0, Math.PI * 2);
    ctx.stroke();

    // Inner tribal dashed ring
    ctx.setLineDash([20, 15]);
    ctx.strokeStyle = '#ff6b00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Golden sun core
    const coreGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 150);
    coreGrad.addColorStop(0, '#fff4cc');
    coreGrad.addColorStop(0.5, '#ffaa00');
    coreGrad.addColorStop(1, '#b35900');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const titleCanvas = createGraphicCanvas(980, 260, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffaa00';
    ctx.letterSpacing = '8px';
    ctx.fillText('AFROBEATS & AMAPIANO VIBES', w / 2, 50);

    ctx.font = '900 130px "Outfit", sans-serif';
    const grad = ctx.createLinearGradient(100, 70, w - 100, 220);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#ffaa00');
    grad.addColorStop(1, '#ff5500');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 30;
    ctx.fillText('AFRO@LIVE', w / 2, 185);
    ctx.restore();
  });

  const lineupCanvas = createGraphicCanvas(920, 150, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 32px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 170, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('BURNA BOY  •  REMA  •  ASAKE  •  AYRA STARR', w / 2, 50);

    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffda79';
    ctx.fillText('DJ TUNEZ  •  MAJOR LEAGUE DJZ  •  UNCLE WAFFLES', w / 2, 105);
    ctx.restore();
  });

  const dateCanvas = createGraphicCanvas(750, 110, (ctx, w, h) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 170, 0, 0.12)';
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255, 170, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(30, 10, w - 60, h - 20, (h - 20) / 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 32px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚡ SÁBADO 18 OCTUBRE • LIVE ARENA ⚡', w / 2, h / 2);
    ctx.restore();
  });

  const ctaCanvas = createGraphicCanvas(600, 110, (ctx, w, h) => {
    ctx.save();
    const grad = ctx.createLinearGradient(50, 0, w - 50, 0);
    grad.addColorStop(0, '#ffaa00');
    grad.addColorStop(1, '#ff5500');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(255, 85, 0, 0.7)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(50, 12, w - 100, h - 24, (h - 24) / 2);
    ctx.fill();

    ctx.font = '800 30px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#060200';
    ctx.fillText('GET TICKETS NOW →', w / 2, h / 2);
    ctx.restore();
  });

  return {
    settings: {
      name: 'Afro@Live — Motion Flyer (MotionDesignArt)',
      width: W,
      height: H,
      duration: 7.0,
      fps: 30,
      backgroundColor: '#0a0400',
    },
    layers: [
      {
        id: 'layer_afro_bg',
        name: 'Background Golden Dusk',
        role: 'background',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width: W,
        height: H,
        canvas: bgCanvas,
        inAnimation: { type: 'fadeIn', start: 0, duration: 1.0, easing: 'easeOutExpo' },
        loopAnimation: { type: 'gentleDrift', start: 1.0, duration: 5.2, intensity: 0.5, speed: 0.6 },
        outAnimation: { type: 'smoothFadeOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [],
      },
      {
        id: 'layer_afro_sun',
        name: 'Tribal Sun Crest',
        role: 'hero',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'screen',
        x: (W - 700) / 2,
        y: 370,
        width: 700,
        height: 700,
        canvas: sunCrestCanvas,
        inAnimation: { type: 'softScale', start: 0.2, duration: 0.9, easing: 'easeOutExpo' },
        loopAnimation: { type: 'loopPulse', start: 1.1, duration: 5.1, intensity: 1.3, speed: 1.0 },
        outAnimation: { type: 'smoothFadeOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [
          { id: 'eff_gold_' + Date.now(), type: 'glowNeon', enabled: true, start: 0.2, duration: 6.5, intensity: 1.6, color: '#ffaa00' },
          { id: 'eff_sweep_' + Date.now(), type: 'lightSweep', enabled: true, start: 1.8, duration: 1.4, intensity: 1.2 },
        ],
      },
      {
        id: 'layer_afro_title',
        name: 'AFRO@LIVE Kinetic Title',
        role: 'title',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: (W - 980) / 2,
        y: 970,
        width: 980,
        height: 260,
        canvas: titleCanvas,
        inAnimation: { type: 'smoothSlideUp', start: 0.4, duration: 0.8, easing: 'easeOutExpo' },
        loopAnimation: { type: 'softFloat', start: 1.2, duration: 5.0, intensity: 0.8, speed: 0.9 },
        outAnimation: { type: 'smoothFadeOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [
          { id: 'eff_tsweep_' + Date.now(), type: 'lightSweep', enabled: true, start: 2.2, duration: 1.2, intensity: 1.1 },
        ],
      },
      {
        id: 'layer_afro_lineup',
        name: 'Headliners Lineup',
        role: 'lineup',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: (W - 920) / 2,
        y: 1280,
        width: 920,
        height: 150,
        canvas: lineupCanvas,
        inAnimation: { type: 'pop', start: 0.6, duration: 0.7, easing: 'easeOutBack' },
        loopAnimation: { type: 'pendulumSwing', start: 1.3, duration: 4.9, intensity: 0.7, speed: 0.8 },
        outAnimation: { type: 'smoothFadeOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [],
      },
      {
        id: 'layer_afro_date',
        name: 'Date Pill Badge',
        role: 'date',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: (W - 750) / 2,
        y: 1490,
        width: 750,
        height: 110,
        canvas: dateCanvas,
        inAnimation: { type: 'smoothSlideUp', start: 0.8, duration: 0.7, easing: 'easeOutExpo' },
        loopAnimation: { type: 'breathing', start: 1.5, duration: 4.7, intensity: 0.6, speed: 0.9 },
        outAnimation: { type: 'smoothFadeOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [],
      },
      {
        id: 'layer_afro_cta',
        name: 'CTA Tickets Pill',
        role: 'cta',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: (W - 600) / 2,
        y: 1650,
        width: 600,
        height: 110,
        canvas: ctaCanvas,
        inAnimation: { type: 'zoomBurst', start: 1.0, duration: 0.7, easing: 'elasticOut' },
        loopAnimation: { type: 'loopPulse', start: 1.7, duration: 4.5, intensity: 1.3, speed: 1.1 },
        outAnimation: { type: 'scaleOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [],
      },
    ],
  };
}

/**
 * Fiesta Latina — Urban Reggaeton Dembow Festival
 */
export function createFiestaLatinaProject(): SceneProject {
  const W = 1080;
  const H = 1920;

  const bgCanvas = createGraphicCanvas(W, H, (ctx, w, h) => {
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.45, 100, w / 2, h / 2, h * 0.85);
    bgGrad.addColorStop(0, '#2b001a');
    bgGrad.addColorStop(0.45, '#12000d');
    bgGrad.addColorStop(1, '#050004');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Neon beams
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 120;
    ctx.beginPath();
    ctx.moveTo(-100, 200);
    ctx.lineTo(w + 200, h + 200);
    ctx.stroke();

    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 90;
    ctx.beginPath();
    ctx.moveTo(w + 100, 200);
    ctx.lineTo(-200, h + 200);
    ctx.stroke();
    ctx.restore();
  });

  const titleCanvas = createGraphicCanvas(980, 280, (ctx, w, _h) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.letterSpacing = '8px';
    ctx.fillText('EL FESTIVAL MÁS GRANDE DE REGGAETON', w / 2, 50);

    ctx.font = '900 135px "Outfit", sans-serif';
    const grad = ctx.createLinearGradient(100, 80, w - 100, 240);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#ff0055');
    grad.addColorStop(1, '#ffb703');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 35;
    ctx.fillText('FIESTA LATINA', w / 2, 200);
    ctx.restore();
  });

  return {
    settings: {
      name: 'Fiesta Latina — Motion Flyer (MotionDesignArt)',
      width: W,
      height: H,
      duration: 7.0,
      fps: 30,
      backgroundColor: '#0a0005',
    },
    layers: [
      {
        id: 'layer_fiesta_bg',
        name: 'Background Neon Night',
        role: 'background',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width: W,
        height: H,
        canvas: bgCanvas,
        inAnimation: { type: 'fadeIn', start: 0, duration: 0.8, easing: 'easeOutExpo' },
        loopAnimation: { type: 'slowZoom', start: 0.8, duration: 5.4, intensity: 0.5, speed: 0.7 },
        outAnimation: { type: 'smoothFadeOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [],
      },
      {
        id: 'layer_fiesta_title',
        name: 'FIESTA LATINA Title',
        role: 'hero',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: (W - 980) / 2,
        y: 660,
        width: 980,
        height: 280,
        canvas: titleCanvas,
        inAnimation: { type: 'zoomBurst', start: 0.2, duration: 0.7, easing: 'elasticOut' },
        loopAnimation: { type: 'loopPulse', start: 0.9, duration: 5.3, intensity: 1.5, speed: 1.2 },
        outAnimation: { type: 'scaleOut', start: 6.2, duration: 0.8, easing: 'easeInOutSine' },
        effects: [
          { id: 'eff_fiesta_' + Date.now(), type: 'glowNeon', enabled: true, start: 0, duration: 7, intensity: 1.8, color: '#ff0055' },
          { id: 'eff_sweep_' + Date.now(), type: 'lightSweep', enabled: true, start: 1.4, duration: 1.2, intensity: 1.1 },
        ],
      },
    ],
  };
}

export interface DemoProjectMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  color: string;
  create: () => SceneProject;
}

export const SAMPLE_PROJECTS_LIST: DemoProjectMeta[] = [
  {
    id: 'afro_live',
    name: '🌴 Afro@Live (MotionDesignArt)',
    category: 'Afrobeat & Amapiano',
    description: 'Flyer animado tropical a 112 BPM, resplandor dorado, percusión visual y tipografía cinética con haz de luz.',
    badge: 'Afrobeat',
    color: '#ffaa00',
    create: createAfroLiveProject,
  },
  {
    id: 'fiesta_latina',
    name: '🔥 Fiesta Latina Dembow Fest',
    category: 'Latin Urban & Reggaeton',
    description: 'Alta energía dembow a 98 BPM, neón fucsia/oro, zoom bursts en caídas y pulsos rítmicos.',
    badge: 'Reggaeton',
    color: '#ff0055',
    create: createFiestaLatinaProject,
  },
  {
    id: 'nexus_electronic',
    name: '⚡ Nexus Electronic Festival (Spec)',
    category: 'Electronic Music Festival',
    description: 'Festival EDM futurista en Ibiza con hexágono 3D holográfico, láseres cian/magenta y lineup estelar.',
    badge: 'Electronic',
    color: '#00f0ff',
    create: createElectronicFestivalProject,
  },
  {
    id: 'movent_brand',
    name: '🎞️ Movent Brand — 2 Diapositivas',
    category: 'Multi-Slide Brand Story',
    description: 'Diapositiva 1 (0-2.5s) con revelación de Logo Neón verde #23C83C + Diapositiva 2 con Flyer completo.',
    badge: '2 Slides',
    color: '#23C83C',
    create: createMoventBrandProject,
  },
];

