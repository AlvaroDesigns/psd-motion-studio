import type { SceneLayer } from '../types/scene';

export interface MotionTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  color: string;
  apply: (layers: SceneLayer[], duration: number) => SceneLayer[];
}

export const MOTION_TEMPLATES: MotionTemplate[] = [
  {
    id: 'two_slides_neon_flyer',
    name: '🎞️ Diapositivas: Intro Logo Neón + Flyer',
    description: 'Estructura en 2 diapositivas: en la 1ª el logo irrumpe con Neón brillante (#23C83C) (0-2.5s) y en la 2ª entra el flyer completo con movimiento suave (2.5-7s).',
    badge: '2 Diapositivas',
    color: '#23C83C',
    apply: (layers, duration) => {
      // Find logo or hero layer
      const logoLayerIdx = layers.findIndex(
        (l) => l.role === 'logo' || l.name.toLowerCase().includes('logo') || l.name.toLowerCase().includes('crest')
      );
      const targetLogoIdx = logoLayerIdx !== -1 ? logoLayerIdx : 3;

      let flyerStaggerCount = 0;

      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isLogo = idx === targetLogoIdx || (targetLogoIdx === -1 && (layer.role === 'hero' || idx === 2));

        if (isBg) {
          return {
            ...layer,
            inAnimation: {
              type: 'fadeIn',
              start: 0,
              duration: 0.8,
              easing: 'easeOutExpo',
            },
            loopAnimation: {
              type: 'gentleDrift',
              start: 0.8,
              duration: duration - 0.8,
              intensity: 0.5,
              speed: 0.6,
            },
            outAnimation: {
              type: 'smoothFadeOut',
              start: duration - 0.8,
              duration: 0.8,
              easing: 'easeInOutSine',
            },
            effects: [],
          };
        }

        if (isLogo) {
          // DIAPOSITIVA 1: LOGO CON NEON DE 0 A 2.5s
          return {
            ...layer,
            inAnimation: {
              type: 'neonReveal',
              start: 0.1,
              duration: 0.85,
              easing: 'easeOutExpo',
            },
            loopAnimation: {
              type: 'loopPulse',
              start: 0.95,
              duration: 1.2,
              intensity: 1.4,
              speed: 1.2,
            },
            outAnimation: {
              type: 'neonOut',
              start: 2.1,
              duration: 0.4,
              easing: 'easeInOutSine',
            },
            effects: [
              {
                id: 'eff_neon_logo_' + Date.now(),
                type: 'glowNeon',
                enabled: true,
                start: 0,
                duration: 2.5,
                intensity: 1.8,
                color: '#23C83C',
              },
              {
                id: 'eff_flash_trans_' + Date.now(),
                type: 'flash',
                enabled: true,
                start: 2.2,
                duration: 0.35,
                intensity: 0.8,
              },
            ],
          };
        }

        // DIAPOSITIVA 2: FLYER COMPLETO ENTRANTE A LOS 2.5s
        const stagger = flyerStaggerCount * 0.16;
        flyerStaggerCount++;

        return {
          ...layer,
          inAnimation: {
            type: idx % 2 === 0 ? 'smoothSlideUp' : 'softScale',
            start: 2.5 + stagger,
            duration: 0.85,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: idx % 3 === 0 ? 'softFloat' : 'gentleDrift',
            start: 2.5 + stagger + 0.85,
            duration: Math.max(0.5, duration - (2.5 + stagger + 0.85) - 0.8),
            intensity: 0.6,
            speed: 0.7,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  // --- TEMPLATES DE EFECTO NEÓN & CYBER GLOW ---
  {
    id: 'neon_cyber_glow',
    name: '⚡ Cyber Neón Tokyo (Cyan & Magenta)',
    description: 'Iluminación retro-futurista: tubos de neón Cian (#00f0ff) y Magenta (#f72585) con ignición parpadeante, destello de alta tensión y brillo eléctrico continuo.',
    badge: 'Cyber Neón',
    color: '#00f0ff',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        if (isBg) {
          return {
            ...layer,
            inAnimation: {
              type: 'fadeIn',
              start: 0,
              duration: 0.9,
              easing: 'easeOutExpo',
            },
            loopAnimation: {
              type: 'slowZoom',
              start: 0.9,
              duration: Math.max(0.5, duration - 1.7),
              intensity: 0.4,
              speed: 0.5,
            },
            outAnimation: {
              type: 'smoothFadeOut',
              start: duration - 0.8,
              duration: 0.8,
              easing: 'easeInOutSine',
            },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.16;
        const neonColor = nonBgCount % 2 === 0 ? '#00f0ff' : '#f72585';
        const isHeroOrTitle = layer.role === 'hero' || layer.role === 'title' || layer.role === 'logo' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: 'neonReveal',
            start: stagger,
            duration: 0.85,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: 'neonFlicker',
            start: stagger + 0.85,
            duration: Math.max(0.5, duration - (stagger + 0.85) - 0.7),
            intensity: 1.35,
            speed: 1.2,
          },
          outAnimation: {
            type: 'neonOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: [
            {
              id: 'eff_neon_' + Date.now() + '_' + idx,
              type: 'glowNeon',
              enabled: true,
              start: stagger,
              duration: Math.max(0.5, duration - stagger),
              intensity: isHeroOrTitle ? 2.0 : 1.6,
              color: neonColor,
            },
            {
              id: 'eff_flash_' + Date.now() + '_' + idx,
              type: 'flash',
              enabled: true,
              start: stagger + 0.06,
              duration: 0.28,
              intensity: 0.9,
            },
            ...(isHeroOrTitle
              ? [
                  {
                    id: 'eff_sweep_' + Date.now() + '_' + idx,
                    type: 'lightSweep' as const,
                    enabled: true,
                    start: 1.6 + stagger * 0.4,
                    duration: 1.1,
                    intensity: 0.95,
                  },
                ]
              : []),
          ],
        };
      });
    },
  },
  {
    id: 'neon_acid_toxic',
    name: '🟢 Toxic Acid Neón (Verde Rave Radiactivo)',
    description: 'Underground Rave Club: tubos de neón verde ácido (#23C83C / #39ff14) de alta potencia con encendido estroboscópico, pulso vibrante de subwoofer y aura eléctrica.',
    badge: 'Toxic Rave',
    color: '#23C83C',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        if (isBg) {
          return {
            ...layer,
            inAnimation: {
              type: 'fadeIn',
              start: 0,
              duration: 0.8,
              easing: 'easeOutExpo',
            },
            loopAnimation: {
              type: 'breathing',
              start: 0.8,
              duration: Math.max(0.5, duration - 1.6),
              intensity: 0.5,
              speed: 0.7,
            },
            outAnimation: {
              type: 'smoothFadeOut',
              start: duration - 0.8,
              duration: 0.8,
              easing: 'easeInOutSine',
            },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.14;
        const isAlt = nonBgCount % 2 === 1;
        const isHeroOrLogo = layer.role === 'hero' || layer.role === 'logo' || layer.role === 'title' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isAlt ? 'strobeIn' : 'neonReveal',
            start: stagger,
            duration: 0.7,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: 'loopPulse',
            start: stagger + 0.7,
            duration: Math.max(0.5, duration - (stagger + 0.7) - 0.7),
            intensity: 1.5,
            speed: 1.35,
          },
          outAnimation: {
            type: 'neonOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: [
            {
              id: 'eff_toxic_neon_' + Date.now() + '_' + idx,
              type: 'glowNeon',
              enabled: true,
              start: stagger,
              duration: Math.max(0.5, duration - stagger),
              intensity: 2.1,
              color: isAlt ? '#39ff14' : '#23C83C',
            },
            {
              id: 'eff_flash_' + Date.now() + '_' + idx,
              type: 'flash',
              enabled: true,
              start: stagger + 0.04,
              duration: 0.32,
              intensity: 1.15,
            },
            ...(isHeroOrLogo
              ? [
                  {
                    id: 'eff_rgb_' + Date.now() + '_' + idx,
                    type: 'rgbSplit' as const,
                    enabled: true,
                    start: 1.5 + stagger * 0.3,
                    duration: 0.6,
                    intensity: 0.85,
                  },
                ]
              : []),
          ],
        };
      });
    },
  },
  {
    id: 'neon_nightclub_vip',
    name: '🟣 Neón Ultravioleta & Gold VIP (Club Lounge)',
    description: 'Estética VIP Lounge: tubos de neón púrpura ultravioleta (#a855f7) y destellos dorados (#ffd166), revelación cinematográfica de gas y parpadeo rítmico.',
    badge: 'VIP Club',
    color: '#a855f7',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        if (isBg) {
          return {
            ...layer,
            inAnimation: {
              type: 'fadeIn',
              start: 0,
              duration: 1.0,
              easing: 'easeOutExpo',
            },
            loopAnimation: {
              type: 'gentleDrift',
              start: 1.0,
              duration: Math.max(0.5, duration - 1.8),
              intensity: 0.45,
              speed: 0.6,
            },
            outAnimation: {
              type: 'smoothFadeOut',
              start: duration - 0.8,
              duration: 0.8,
              easing: 'easeInOutSine',
            },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.15;
        const neonColor = nonBgCount % 2 === 0 ? '#a855f7' : '#ffd166';
        const isHeroOrTitle = layer.role === 'hero' || layer.role === 'title' || layer.role === 'logo' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: 'neonReveal',
            start: stagger,
            duration: 0.85,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: 'neonFlicker',
            start: stagger + 0.85,
            duration: Math.max(0.5, duration - (stagger + 0.85) - 0.8),
            intensity: 1.25,
            speed: 1.1,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: [
            {
              id: 'eff_vip_neon_' + Date.now() + '_' + idx,
              type: 'glowNeon',
              enabled: true,
              start: stagger,
              duration: Math.max(0.5, duration - stagger),
              intensity: 1.8,
              color: neonColor,
            },
            ...(isHeroOrTitle
              ? [
                  {
                    id: 'eff_vip_sweep_' + Date.now() + '_' + idx,
                    type: 'lightSweep' as const,
                    enabled: true,
                    start: 1.8 + stagger * 0.4,
                    duration: 1.2,
                    intensity: 0.9,
                  },
                ]
              : []),
          ],
        };
      });
    },
  },
  // --- TEMPLATES DE MOVIMIENTO ULTRA SUAVE Y ELEGANTE ---
  {
    id: 'smooth_silk_drift',
    name: '🌊 Seda Líquida / Luxury Drift (Ultra Suave)',
    description: 'Movimiento hipnótico y sedoso, micro-desplazamientos con curva Ease Out Expo y flotación armónica.',
    badge: 'Ultra Suave',
    color: '#00f2fe',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.16;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'smoothSlideUp',
            start: isBg ? 0 : stagger,
            duration: isBg ? 1.0 : 0.9,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isBg ? 'gentleDrift' : isHero ? 'softFloat' : 'breathing',
            start: stagger + 0.9,
            duration: duration - stagger - 1.0,
            intensity: isHero ? 0.8 : 0.6,
            speed: 0.7,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 1.0,
            duration: 1.0,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'nordic_keynote',
    name: '🍏 Nordic Flow / Apple Keynote (Suave)',
    description: 'Filosofía de movimiento iOS y Keynote: aceleraciones de desaceleración exponencial y sutileza pura.',
    badge: 'Keynote',
    color: '#38ef7d',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.14;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : idx % 2 === 0 ? 'smoothSlideUp' : 'softScale',
            start: isBg ? 0 : stagger,
            duration: 0.85,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isBg ? 'gentleDrift' : 'softFloat',
            start: stagger + 0.85,
            duration: duration - stagger - 0.9,
            intensity: 0.5,
            speed: 0.8,
          },
          outAnimation: {
            type: 'smoothScaleDown',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'editorial_fashion',
    name: '👠 Editorial & Vogue Motion (Elegante)',
    description: 'Entradas con micro-escala suave (Soft Scale), respiración de escala casi imperceptible y clase editorial.',
    badge: 'Vogue',
    color: '#f6d365',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.18;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'softScale',
            start: isBg ? 0 : stagger,
            duration: 1.1,
            easing: 'easeInOutCubic',
          },
          loopAnimation: {
            type: isHero ? 'breathing' : 'gentleDrift',
            start: stagger + 1.1,
            duration: duration - stagger - 1.0,
            intensity: 0.5,
            speed: 0.6,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.9,
            duration: 0.9,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'ambient_cosmic',
    name: '🪐 Ambient Cosmic / Parallax Flotante',
    description: 'Movimiento orgánico perpetuo sin fin, balanceos armónicos y deriva espacial multicapa.',
    badge: 'Flotación',
    color: '#9b5de5',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.2;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'smoothDrift',
            start: isBg ? 0 : stagger,
            duration: 1.2,
            easing: 'easeInOutSine',
          },
          loopAnimation: {
            type: idx % 3 === 0 ? 'softFloat' : idx % 3 === 1 ? 'pendulumSwing' : 'gentleDrift',
            start: stagger + 1.2,
            duration: duration - stagger - 1.0,
            intensity: 0.7,
            speed: 0.6,
          },
          outAnimation: {
            type: 'smoothSlideOutUp',
            start: duration - 1.0,
            duration: 1.0,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'breathing_wellness',
    name: '🍃 Zen Breathing / Wellness Aura',
    description: 'Inhalación y exhalación continua rítmica a baja frecuencia. Transiciones que transmiten paz y belleza.',
    badge: 'Zen',
    color: '#23C83C',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.22;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: 'fadeIn',
            start: isBg ? 0 : stagger,
            duration: 1.3,
            easing: 'easeInOutSine',
          },
          loopAnimation: {
            type: 'breathing',
            start: stagger + 1.3,
            duration: duration - stagger - 1.0,
            intensity: 0.6,
            speed: 0.5,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 1.1,
            duration: 1.1,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'kinetic_smooth',
    name: '💎 Kinetic Smooth / Modern Poster',
    description: 'Entradas suaves en cascada diagonal con amortiguación expo, balanceo imperceptible y ligereza visual.',
    badge: 'Moderno',
    color: '#4cc9f0',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.15;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'smoothSlideUp',
            start: isBg ? 0 : stagger,
            duration: 0.9,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: idx % 2 === 0 ? 'softFloat' : 'gentleDrift',
            start: stagger + 0.9,
            duration: duration - stagger - 0.9,
            intensity: 0.6,
            speed: 0.7,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },

  
  // --- COLECCIÓN EXPANDIDA: ENERGÍA, FESTIVALES & RAVE ---
  {
    id: 'techno_warehouse',
    name: '🔊 Techno Warehouse / Berlin Peak-Time (132 BPM)',
    description: 'Estética industrial de club underground. Bombo contundente sin rebotes, ráfagas estroboscópicas y RGB split.',
    badge: 'Techno',
    color: '#00f0ff',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.12;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : idx % 2 === 0 ? 'whipPan' : 'strobeIn',
            start: isBg ? 0 : stagger,
            duration: 0.55,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'bassDropBeat' : idx % 2 === 0 ? 'earthquakeShake' : 'slowZoom',
            start: stagger + 0.55,
            duration: duration - stagger - 0.8,
            intensity: isHero ? 1.5 : 0.9,
            speed: 1.1,
          },
          outAnimation: {
            type: 'glitchOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_rgb_' + Date.now() + '_' + idx,
                  type: 'rgbSplit',
                  enabled: true,
                  start: 1.0,
                  duration: duration - 1.5,
                  intensity: 1.2,
                },
                {
                  id: 'eff_flash_' + Date.now() + '_' + idx,
                  type: 'flash',
                  enabled: true,
                  start: 1.8,
                  duration: 0.4,
                  intensity: 1.0,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'bass_drop_strobe',
    name: '💥 Bass Drop & Hardstyle Strobe (150 BPM)',
    description: 'Impacto total en el drop. Caída sísmica vertical, estroboscopio continuo y sacudida de subwoofer de alta frecuencia.',
    badge: 'Hardstyle',
    color: '#ff0055',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.10;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'bassDropIn',
            start: isBg ? 0 : stagger,
            duration: 0.6,
            easing: 'elasticOut',
          },
          loopAnimation: {
            type: isHero ? 'strobeFlicker' : 'bassDropBeat',
            start: stagger + 0.6,
            duration: duration - stagger - 0.7,
            intensity: 1.6,
            speed: 1.3,
          },
          outAnimation: {
            type: 'zoomOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInBack',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_neon_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 2.0,
                  color: '#ff0055',
                },
                {
                  id: 'eff_flash_' + Date.now() + '_' + idx,
                  type: 'flash',
                  enabled: true,
                  start: 0.6,
                  duration: 0.5,
                  intensity: 1.2,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'mainstage_pyro',
    name: '🎪 Mainstage EDM / Tomorrowland Pyro',
    description: 'Pirotecnia visual para grandes festivales: barridos de haz de luz dorados, rebotes enérgicos y pulso de himno.',
    badge: 'Mainstage',
    color: '#ffd166',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.15;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'zoomBurst',
            start: isBg ? 0 : stagger,
            duration: 0.75,
            easing: 'easeOutBack',
          },
          loopAnimation: {
            type: 'loopPulse',
            start: stagger + 0.75,
            duration: duration - stagger - 0.8,
            intensity: isHero ? 1.5 : 1.1,
            speed: 1.15,
          },
          outAnimation: {
            type: 'scaleOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: [
            {
              id: 'eff_sweep_' + Date.now() + '_' + idx,
              type: 'lightSweep',
              enabled: true,
              start: stagger + 0.8,
              duration: 1.4,
              intensity: 1.2,
            },
            ...(isHero
              ? [
                  {
                    id: 'eff_neon_gold_' + Date.now() + '_' + idx,
                    type: 'glowNeon' as const,
                    enabled: true,
                    start: 0,
                    duration,
                    intensity: 1.4,
                    color: '#ffd166',
                  },
                ]
              : []),
          ],
        };
      });
    },
  },
  {
    id: 'psytrance_dimension',
    name: '🛸 Psytrance Fractal / 145 BPM Trip',
    description: 'Aberración cromática continua (RGB Split), rotación rápida acelerada a 145 BPM y energía psicodélica ininterrumpida.',
    badge: 'Psytrance',
    color: '#bf5af2',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.12;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'pop',
            start: isBg ? 0 : stagger,
            duration: 0.6,
            easing: 'elasticOut',
          },
          loopAnimation: {
            type: idx % 2 === 0 ? 'slowRotate' : 'loopPulse',
            start: stagger + 0.6,
            duration: duration - stagger - 0.7,
            intensity: 1.6,
            speed: 1.4,
          },
          outAnimation: {
            type: 'glitchOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: [
            {
              id: 'eff_rgb_psy_' + Date.now() + '_' + idx,
              type: 'rgbSplit',
              enabled: true,
              start: 0,
              duration,
              intensity: 1.3,
            },
            {
              id: 'eff_neon_uv_' + Date.now() + '_' + idx,
              type: 'glowNeon',
              enabled: true,
              start: 0,
              duration,
              intensity: 1.5,
              color: '#bf5af2',
            },
          ],
        };
      });
    },
  },
  {
    id: 'urban_trap_distortion',
    name: '🔥 Urban Trap & Subwoofer Distortion',
    description: 'Estilo trap / urbano oscuro: glitch horizontal agresivo, sacudida sísmica de graves 808 y latigazos de pantalla.',
    badge: 'Trap / 808',
    color: '#ff3b30',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.11;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'whipPan',
            start: isBg ? 0 : stagger,
            duration: 0.5,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'earthquakeShake' : 'bassDropBeat',
            start: stagger + 0.5,
            duration: duration - stagger - 0.7,
            intensity: 1.4,
            speed: 1.0,
          },
          outAnimation: {
            type: 'glitchOut',
            start: duration - 0.6,
            duration: 0.6,
            easing: 'linear',
          },
          effects: [
            {
              id: 'eff_glitch_trap_' + Date.now() + '_' + idx,
              type: 'glitch',
              enabled: true,
              start: 1.2,
              duration: 2.2,
              intensity: 1.4,
            },
          ],
        };
      });
    },
  },
  {
    id: 'sunset_ibiza_melodic',
    name: '🌅 Sunset Beach Festival / Ibiza Melodic (124 BPM)',
    description: 'Calidez veraniega y bajo envolvente: resplandor turquesa/dorado, barridos rítmicos suaves y euforia progresiva.',
    badge: 'Melodic House',
    color: '#ff9500',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.16;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'smoothSlideUp',
            start: isBg ? 0 : stagger,
            duration: 0.85,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'floatParallax',
            start: stagger + 0.85,
            duration: duration - stagger - 0.8,
            intensity: 1.1,
            speed: 0.95,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_sweep_sun_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: 1.5,
                  duration: 1.8,
                  intensity: 1.0,
                },
                {
                  id: 'eff_neon_teal_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.2,
                  color: '#00f0ff',
                },
              ]
            : [],
        };
      });
    },
  },

  // --- TEMPLATES DINÁMICOS & EVENTOS ---
  {
    id: 'cinema_elegance',
    name: '✨ Cine & Elegancia Clásica',
    description: 'Fades suaves cinematográficos, zooms pausados con lente 35mm y salidas graduales.',
    badge: 'Premium',
    color: '#ffd166',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.22;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: 'fadeIn',
            start: isBg ? 0 : stagger,
            duration: 1.0,
            easing: 'easeOutCubic',
          },
          loopAnimation: {
            type: 'slowZoom',
            start: isBg ? 0 : stagger + 1.0,
            duration: duration - stagger,
            intensity: 0.5,
            speed: 0.8,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.9,
            duration: 0.9,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'minimal_brand',
    name: '🌿 Minimal Clean Brand',
    description: 'Transiciones limpias sin artificios, slide suave con fundido y animación pausada para marcas modernas.',
    badge: 'Corporativo',
    color: '#06d6a0',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.18;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'smoothSlideUp',
            start: isBg ? 0 : stagger,
            duration: 0.8,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: 'slowZoom',
            start: stagger + 0.8,
            duration: duration - stagger,
            intensity: 0.35,
            speed: 0.5,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'festival_rave',
    name: '⚡ Festival Rave / Neon Glitch',
    description: 'Entradas de alto impacto, resplandor neón verde #23C83C, RGB split y pulsos a 128 BPM.',
    badge: 'Electrónica',
    color: '#23C83C',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = Math.min(2.5, idx * 0.18);
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || idx === 2;

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : isHero ? 'zoomBurst' : idx % 2 === 0 ? 'slideDownFade' : 'pop',
            start: isBg ? 0 : stagger,
            duration: isBg ? 0.6 : 0.7,
            easing: 'easeOutBack',
          },
          loopAnimation: {
            type: isBg ? 'slowZoom' : isHero ? 'loopPulse' : 'floatParallax',
            start: stagger + 0.7,
            duration: duration - stagger - 1.2,
            intensity: isHero ? 1.4 : 1.0,
            speed: 1.2,
          },
          outAnimation: {
            type: isBg ? 'fadeOut' : 'glitchOut',
            start: Math.max(duration - 1.0, 5.8),
            duration: 0.8,
            easing: 'easeInBack',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_neon_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.3,
                  color: '#23C83C',
                },
                {
                  id: 'eff_rgb_' + Date.now() + '_' + idx,
                  type: 'rgbSplit',
                  enabled: true,
                  start: 2.0,
                  duration: 2.0,
                  intensity: 0.9,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'dynamic_hype',
    name: '🔥 Dynamic Hype (TikTok / Reels)',
    description: 'Ritmo rápido, rebotes elásticos, escalada rápida para captar atención en los primeros segundos.',
    badge: 'Viral',
    color: '#f72585',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.12;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : idx % 2 === 0 ? 'slideLeft' : 'slideRight',
            start: isBg ? 0 : stagger,
            duration: 0.5,
            easing: 'easeOutBack',
          },
          loopAnimation: {
            type: 'loopPulse',
            start: stagger + 0.5,
            duration: duration - stagger,
            intensity: 1.4,
            speed: 1.4,
          },
          outAnimation: {
            type: 'scaleOut',
            start: duration - 0.8,
            duration: 0.7,
            easing: 'easeInBack',
          },
          effects: [],
        };
      });
    },
  },
  {
    id: 'cyberpunk_glitch',
    name: '🔮 Cyberpunk Hologram',
    description: 'Scanlines, glitch horizontal, destellos estroboscópicos y parpadeo neón de alta energía.',
    badge: 'Futurista',
    color: '#00f0ff',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.15;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'glitchIn',
            start: isBg ? 0 : stagger,
            duration: 0.7,
            easing: 'easeOutBack',
          },
          loopAnimation: {
            type: 'neonFlicker',
            start: stagger + 0.7,
            duration: duration - stagger,
            intensity: 1.2,
            speed: 1.0,
          },
          outAnimation: {
            type: 'glitchOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'linear',
          },
          effects: [
            {
              id: 'eff_glitch_' + Date.now() + '_' + idx,
              type: 'glitch',
              enabled: true,
              start: 1.5,
              duration: 2.5,
              intensity: 1.1,
            },
          ],
        };
      });
    },
  },
  {
    id: 'poster_reveal',
    name: '💥 Poster Reveal / Explosivo',
    description: 'Aparición desde el fondo en zoom burst, barrido de haz de luz en títulos y rebote elástico.',
    badge: 'Impacto',
    color: '#ffb703',
    apply: (layers, duration) => {
      return layers.map((layer, idx) => {
        const stagger = idx * 0.18;
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');

        return {
          ...layer,
          inAnimation: {
            type: isBg ? 'fadeIn' : 'zoomBurst',
            start: isBg ? 0 : stagger,
            duration: 0.8,
            easing: 'elasticOut',
          },
          loopAnimation: {
            type: 'floatParallax',
            start: stagger + 0.8,
            duration: duration - stagger,
            intensity: 0.8,
            speed: 1.0,
          },
          outAnimation: {
            type: 'zoomOut',
            start: duration - 0.9,
            duration: 0.9,
            easing: 'easeInQuad',
          },
          effects: [
            {
              id: 'eff_sweep_' + Date.now() + '_' + idx,
              type: 'lightSweep',
              enabled: true,
              start: stagger + 1.0,
              duration: 1.2,
              intensity: 1.0,
            },
          ],
        };
      });
    },
  },
];
