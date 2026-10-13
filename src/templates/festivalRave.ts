import type { MotionTemplate } from './types';

export const FESTIVAL_RAVE_TEMPLATES: MotionTemplate[] = [
  {
    id: 'techno_warehouse',
    name: '🔊 Techno Warehouse / Berlin Peak-Time (132 BPM)',
    description: 'Estética industrial de club underground. Bombo contundente sin rebotes, ráfagas estroboscópicas y RGB split.',
    badge: 'Techno',
    color: '#00f0ff',
    category: 'festival_rave',
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
    category: 'festival_rave',
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
    category: 'festival_rave',
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
    category: 'festival_rave',
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
    category: 'festival_rave',
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
    category: 'festival_rave',
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
  {
    id: 'festival_rave',
    name: '⚡ Festival Rave / Neon Glitch',
    description: 'Entradas de alto impacto, resplandor neón verde #23C83C, RGB split y pulsos a 128 BPM.',
    badge: 'Electrónica',
    color: '#23C83C',
    category: 'festival_rave',
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
    category: 'festival_rave',
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
    category: 'festival_rave',
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
    category: 'festival_rave',
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
