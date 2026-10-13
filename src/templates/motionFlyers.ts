import type { MotionTemplate } from './types';

export const MOTION_FLYER_TEMPLATES: MotionTemplate[] = [
  {
    id: 'afro_live_groove',
    name: '🌴 Afro@Live — Afrobeat & Amapiano Motion Flyer',
    description: 'Inspirado en Afro@Live (MotionDesignArt): ritmo afro a 112 BPM, balanceo orgánico pendular, micro-rebote elástico en tipografías y barridos de haz dorado (#ffaa00).',
    badge: 'Afrobeat',
    color: '#ffaa00',
    category: 'motion_flyers',
    genre: 'Afrobeat & Amapiano',
    bpm: '112 BPM',
    demoProjectId: 'afro_live',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.0, easing: 'easeOutExpo' },
            loopAnimation: { type: 'gentleDrift', start: 1.0, duration: duration - 1.8, intensity: 0.5, speed: 0.6 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.16;
        const isHero = layer.role === 'hero' || layer.name.toLowerCase().includes('hero') || nonBgCount === 0;
        const isTitle = layer.role === 'title' || layer.name.toLowerCase().includes('title');
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'softScale' : idx % 2 === 0 ? 'smoothSlideUp' : 'pop',
            start: stagger,
            duration: 0.8,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : isTitle ? 'softFloat' : 'pendulumSwing',
            start: stagger + 0.8,
            duration: Math.max(0.5, duration - (stagger + 0.8) - 0.8),
            intensity: isHero ? 1.25 : 0.8,
            speed: 1.0,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.8,
            duration: 0.8,
            easing: 'easeInOutSine',
          },
          effects: isHero || isTitle
            ? [
                {
                  id: 'eff_gold_glow_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: stagger,
                  duration: Math.max(0.5, duration - stagger),
                  intensity: 1.5,
                  color: '#ffaa00',
                },
                {
                  id: 'eff_sweep_afro_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: 1.6 + stagger * 0.3,
                  duration: 1.2,
                  intensity: 1.1,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'wicked_wasted_trap',
    name: '💀 Wicked & Wasted — Dark Motion Poster',
    description: 'Inspirado en Wicked & Wasted (MotionDesignArt): atmósfera oscura, relámpagos estroboscópicos (#9d4edd y #39ff14), temblor de graves sísmicos 808 y aberración cromática.',
    badge: 'Dark Bass',
    color: '#9d4edd',
    category: 'motion_flyers',
    genre: 'Dark Trap & Bass',
    bpm: '140 BPM',
    demoProjectId: 'wicked_wasted',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 0.7, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 0.7, duration: duration - 1.4, intensity: 0.6, speed: 0.8 },
            outAnimation: { type: 'glitchOut', start: duration - 0.7, duration: 0.7, easing: 'easeInOutSine' },
            effects: [
              {
                id: 'eff_flash_storm_' + Date.now(),
                type: 'flash',
                enabled: true,
                start: 1.8,
                duration: 0.3,
                intensity: 1.2,
              },
            ],
          };
        }

        const stagger = nonBgCount * 0.12;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'bassDropIn' : idx % 2 === 0 ? 'whipPan' : 'strobeIn',
            start: stagger,
            duration: 0.6,
            easing: 'elasticOut',
          },
          loopAnimation: {
            type: isHero ? 'earthquakeShake' : 'bassDropBeat',
            start: stagger + 0.6,
            duration: Math.max(0.5, duration - (stagger + 0.6) - 0.7),
            intensity: isHero ? 1.6 : 1.1,
            speed: 1.25,
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
                  id: 'eff_purple_glow_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.9,
                  color: '#9d4edd',
                },
                {
                  id: 'eff_rgb_wasted_' + Date.now() + '_' + idx,
                  type: 'rgbSplit',
                  enabled: true,
                  start: 1.2,
                  duration: 2.0,
                  intensity: 1.3,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'epidemia_cyber_techno',
    name: '☣️ Epidemia — Cyber Industrial Motion Flyer',
    description: 'Inspirado en Epidemia (MotionDesignArt): club industrial a 136 BPM, láseres cian (#00f0ff) y fucsia (#f72585), destello de ignición y glitch cibernético.',
    badge: 'Cyber Industrial',
    color: '#00f0ff',
    category: 'motion_flyers',
    genre: 'Cyber Techno',
    bpm: '136 BPM',
    demoProjectId: 'epidemia_cyber',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 0.8, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 0.8, duration: duration - 1.5, intensity: 0.5, speed: 0.7 },
            outAnimation: { type: 'glitchOut', start: duration - 0.7, duration: 0.7, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.14;
        const isHero = layer.role === 'hero' || layer.role === 'logo' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'neonReveal' : idx % 2 === 0 ? 'glitchIn' : 'strobeIn',
            start: stagger,
            duration: 0.7,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'neonFlicker' : 'strobeFlicker',
            start: stagger + 0.7,
            duration: Math.max(0.5, duration - (stagger + 0.7) - 0.7),
            intensity: isHero ? 1.4 : 1.0,
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
              id: 'eff_epidemia_neon_' + Date.now() + '_' + idx,
              type: 'glowNeon',
              enabled: true,
              start: stagger,
              duration: Math.max(0.5, duration - stagger),
              intensity: 1.8,
              color: nonBgCount % 2 === 0 ? '#00f0ff' : '#f72585',
            },
            ...(isHero
              ? [
                  {
                    id: 'eff_sweep_epi_' + Date.now() + '_' + idx,
                    type: 'lightSweep' as const,
                    enabled: true,
                    start: 1.5,
                    duration: 1.1,
                    intensity: 1.2,
                  },
                ]
              : []),
          ],
        };
      });
    },
  },
  {
    id: 'sundaz_sunset_pool',
    name: '🍹 SUNDAZ — Sunset Pool Party & Day Vibes',
    description: 'Inspirado en SUNDAZ (MotionDesignArt): ambiente diurno y azotea al atardecer (#ff7b00), micro-respiración orgánica, suave deriva y elegancia estival.',
    badge: 'Pool Party',
    color: '#ff7b00',
    category: 'motion_flyers',
    genre: 'Day Party / Sunset',
    bpm: '118 BPM',
    demoProjectId: 'sundaz_sunset',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.1, easing: 'easeInOutCubic' },
            loopAnimation: { type: 'gentleDrift', start: 1.1, duration: duration - 2.0, intensity: 0.45, speed: 0.5 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.9, duration: 0.9, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.17;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'softScale' : 'smoothSlideUp',
            start: stagger,
            duration: 0.9,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'breathing' : idx % 2 === 0 ? 'softFloat' : 'gentleDrift',
            start: stagger + 0.9,
            duration: Math.max(0.5, duration - (stagger + 0.9) - 0.9),
            intensity: 0.65,
            speed: 0.7,
          },
          outAnimation: {
            type: 'smoothFadeOut',
            start: duration - 0.9,
            duration: 0.9,
            easing: 'easeInOutSine',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_sun_sweep_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: 1.8,
                  duration: 1.6,
                  intensity: 0.95,
                },
                {
                  id: 'eff_sun_glow_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.2,
                  color: '#ffaa00',
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'fiesta_latina_fest',
    name: '🔥 Fiesta Latina / Reggaeton Dembow Fest',
    description: 'Inspirado en Fiesta Latina & Yo Quiero Bailar Fest (MotionDesignArt): dembow a 98 BPM, golpes de zoom en el beat, rebotes elásticos y aura neón festiva (#ff0055).',
    badge: 'Latin Urban',
    color: '#ff0055',
    category: 'motion_flyers',
    genre: 'Latin Reggaeton',
    bpm: '98 BPM',
    demoProjectId: 'fiesta_latina',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 0.7, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 0.7, duration: duration - 1.5, intensity: 0.6, speed: 0.8 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.13;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'zoomBurst' : idx % 2 === 0 ? 'pop' : 'smoothSlideUp',
            start: stagger,
            duration: 0.65,
            easing: 'elasticOut',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'bassDropBeat',
            start: stagger + 0.65,
            duration: Math.max(0.5, duration - (stagger + 0.65) - 0.7),
            intensity: isHero ? 1.5 : 1.2,
            speed: 1.2,
          },
          outAnimation: {
            type: 'scaleOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_latina_neon_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.8,
                  color: '#ff0055',
                },
                {
                  id: 'eff_sweep_lat_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: 1.4,
                  duration: 1.2,
                  intensity: 1.1,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'breyth_minimal_headline',
    name: '🎧 Breyth — Minimal Headline DJ Set',
    description: 'Inspirado en Breyth (MotionDesignArt): club nocturno de alto contraste, tipografía cinética ultra nítida, barrido de haz direccional y pulsaciones sobrias.',
    badge: 'DJ Headline',
    color: '#4836ff',
    category: 'motion_flyers',
    genre: 'Minimal DJ Set',
    bpm: '128 BPM',
    demoProjectId: 'breyth_dj',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 0.9, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 0.9, duration: duration - 1.7, intensity: 0.4, speed: 0.6 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.15;
        const isHero = layer.role === 'hero' || layer.role === 'title' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: 'smoothSlideUp',
            start: stagger,
            duration: 0.8,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'gentleDrift',
            start: stagger + 0.8,
            duration: Math.max(0.5, duration - (stagger + 0.8) - 0.8),
            intensity: isHero ? 1.1 : 0.6,
            speed: 0.9,
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
                  id: 'eff_breyth_sweep_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: 1.5,
                  duration: 1.0,
                  intensity: 1.3,
                },
                {
                  id: 'eff_breyth_glow_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.4,
                  color: '#4836ff',
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'el_chamo_single_cover',
    name: '📀 El Chamo — Single Cover Art Motion',
    description: 'Inspirado en El Chamo · Nicky Jam (MotionDesignArt): portada de single con zoom cinematográfico en el artista, respiración 3D del título y resplandor de reflector.',
    badge: 'Cover Art',
    color: '#ffb070',
    category: 'motion_flyers',
    genre: 'Single Cover Art',
    bpm: '96 BPM',
    demoProjectId: 'el_chamo_cover',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.0, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 1.0, duration: duration - 1.8, intensity: 0.5, speed: 0.5 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.16;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'softScale' : 'smoothSlideUp',
            start: stagger,
            duration: 0.9,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'breathing' : 'softFloat',
            start: stagger + 0.9,
            duration: Math.max(0.5, duration - (stagger + 0.9) - 0.8),
            intensity: isHero ? 0.9 : 0.6,
            speed: 0.75,
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
                  id: 'eff_cover_glow_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.4,
                  color: '#ffb070',
                },
                {
                  id: 'eff_cover_sweep_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: 1.7,
                  duration: 1.4,
                  intensity: 1.0,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'congo_angola_afro',
    name: '🌍 Congo x Angola — Afro-Fusion Cultural',
    description: 'Inspirado en Congo x Angola (MotionDesignArt): transiciones enérgicas whip-pan, entradas rítmicas de banderas y títulos, pulso festivo continuo.',
    badge: 'Afro-Fusion',
    color: '#23C83C',
    category: 'motion_flyers',
    genre: 'Afro-Fusion Event',
    bpm: '120 BPM',
    demoProjectId: 'congo_angola',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 0.8, easing: 'easeOutExpo' },
            loopAnimation: { type: 'gentleDrift', start: 0.8, duration: duration - 1.6, intensity: 0.5, speed: 0.7 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = nonBgCount * 0.14;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: idx % 2 === 0 ? 'whipPan' : 'pop',
            start: stagger,
            duration: 0.65,
            easing: 'easeOutBack',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'pendulumSwing',
            start: stagger + 0.65,
            duration: Math.max(0.5, duration - (stagger + 0.65) - 0.7),
            intensity: isHero ? 1.3 : 0.9,
            speed: 1.1,
          },
          outAnimation: {
            type: 'scaleOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: isHero
            ? [
                {
                  id: 'eff_congo_glow_' + Date.now() + '_' + idx,
                  type: 'glowNeon',
                  enabled: true,
                  start: 0,
                  duration,
                  intensity: 1.5,
                  color: '#23C83C',
                },
              ]
            : [],
        };
      });
    },
  },
];

export const MOTION_FLYERS_TEMPLATES = MOTION_FLYER_TEMPLATES;
