import type { MotionTemplate } from './types';

export const NEON_GLOW_TEMPLATES: MotionTemplate[] = [
  {
    id: 'neon_cyber_glow',
    name: '⚡ Cyber Neón Tokyo (Cyan & Magenta)',
    description: 'Iluminación retro-futurista: tubos de neón Cian (#00f0ff) y Magenta (#f72585) con ignición parpadeante, destello de alta tensión y brillo eléctrico continuo.',
    badge: 'Cyber Neón',
    color: '#00f0ff',
    category: 'neon',
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
    category: 'neon',
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
    category: 'neon',
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
];
