import type { MotionTemplate } from './types';

export const MOTION_FLYER_TEMPLATES: MotionTemplate[] = [
  {
    id: 'afro_live_groove',
    name: '🌴 Afro@Live — Sunset Amapiano & Groove',
    description: 'Inspirado en Afro@Live (MotionDesignArt): estética afrobeat tropical a 112 BPM, deriva orgánica, balanceo rítmico pausado y entradas suaves.',
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
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.3, easing: 'easeOutExpo' },
            loopAnimation: { type: 'gentleDrift', start: 1.3, duration: duration - 2.2, intensity: 0.45, speed: 0.6 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.3 + nonBgCount * 0.28;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        const isTitle = layer.role === 'title';
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'softScale' : isTitle ? 'smoothSlideUp' : idx % 2 === 0 ? 'pop' : 'smoothDrift',
            start: stagger,
            duration: 1.25,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'softFloat' : isTitle ? 'pendulumSwing' : 'gentleDrift',
            start: stagger + 1.25,
            duration: Math.max(0.5, duration - (stagger + 1.25) - 0.8),
            intensity: isHero ? 0.9 : 0.65,
            speed: 0.75,
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
                  id: 'eff_sweep_afro_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: stagger + 0.8,
                  duration: 1.4,
                  intensity: 0.95,
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
    description: 'Inspirado en Wicked & Wasted (MotionDesignArt): atmósfera oscura, relámpagos controlados, temblor de graves 808 y entradas fluidas sin brusquedad.',
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
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.2, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 1.2, duration: duration - 2.0, intensity: 0.5, speed: 0.7 },
            outAnimation: { type: 'glitchOut', start: duration - 0.7, duration: 0.7, easing: 'easeInOutSine' },
            effects: [
              {
                id: 'eff_flash_storm_' + Date.now(),
                type: 'flash',
                enabled: true,
                start: 2.2,
                duration: 0.35,
                intensity: 1.1,
              },
            ],
          };
        }

        const stagger = 0.25 + nonBgCount * 0.25;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'smoothSlideUp' : idx % 2 === 0 ? 'softScale' : 'smoothSlideUp',
            start: stagger,
            duration: 1.15,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'earthquakeShake' : 'bassDropBeat',
            start: stagger + 1.15,
            duration: Math.max(0.5, duration - (stagger + 1.15) - 0.7),
            intensity: isHero ? 1.2 : 0.9,
            speed: 1.0,
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
                  id: 'eff_rgb_wasted_' + Date.now() + '_' + idx,
                  type: 'rgbSplit',
                  enabled: true,
                  start: stagger + 0.6,
                  duration: 1.8,
                  intensity: 1.1,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'epidemia_cyber_techno',
    name: '☣️ Epidemia Club — Hard Techno Industrial',
    description: 'Inspirado en Epidemia Club (MotionDesignArt): estética berlinesa a 135 BPM, transiciones con inercia, flashes controlados y cadencia rítmica.',
    badge: 'Hard Techno',
    color: '#00f0ff',
    category: 'motion_flyers',
    genre: 'Peak Techno',
    bpm: '135 BPM',
    demoProjectId: 'epidemia_club',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.1, easing: 'easeOutExpo' },
            loopAnimation: { type: 'loopPulse', start: 1.1, duration: duration - 1.8, intensity: 0.6, speed: 1.1 },
            outAnimation: { type: 'neonOut', start: duration - 0.6, duration: 0.6, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.22 + nonBgCount * 0.24;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: idx % 2 === 0 ? 'smoothSlideUp' : 'softScale',
            start: stagger,
            duration: 1.1,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'pendulumSwing',
            start: stagger + 1.1,
            duration: Math.max(0.5, duration - (stagger + 1.1) - 0.7),
            intensity: isHero ? 1.1 : 0.8,
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
                  id: 'eff_sweep_epi_' + Date.now() + '_' + idx,
                  type: 'lightSweep' as const,
                  enabled: true,
                  start: stagger + 0.6,
                  duration: 1.2,
                  intensity: 1.0,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'sundaz_sunset_pool',
    name: '☀️ Sundaz Sunset — Melodic Pool Party',
    description: 'Inspirado en Sundaz Sunset (MotionDesignArt): desplazamientos flotantes horizontales, luz cálida dorada y movimiento elegante a 122 BPM.',
    badge: 'Pool Party',
    color: '#ff758c',
    category: 'motion_flyers',
    genre: 'Melodic Deep House',
    bpm: '122 BPM',
    demoProjectId: 'sundaz_sunset',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.4, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 1.4, duration: duration - 2.4, intensity: 0.4, speed: 0.5 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.9, duration: 0.9, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.3 + nonBgCount * 0.3;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: idx % 2 === 0 ? 'smoothSlideUp' : 'softScale',
            start: stagger,
            duration: 1.35,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'breathing' : 'softFloat',
            start: stagger + 1.35,
            duration: Math.max(0.5, duration - (stagger + 1.35) - 0.8),
            intensity: isHero ? 0.7 : 0.55,
            speed: 0.65,
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
                  id: 'eff_sun_sweep_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: stagger + 0.7,
                  duration: 1.6,
                  intensity: 0.9,
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
    description: 'Inspirado en Fiesta Latina & Yo Quiero Bailar Fest (MotionDesignArt): dembow a 98 BPM, entradas musicales a compás con desaceleración suave.',
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
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.2, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 1.2, duration: duration - 2.0, intensity: 0.5, speed: 0.7 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.26 + nonBgCount * 0.26;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'softScale' : idx % 2 === 0 ? 'pop' : 'smoothSlideUp',
            start: stagger,
            duration: 1.2,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'bassDropBeat',
            start: stagger + 1.2,
            duration: Math.max(0.5, duration - (stagger + 1.2) - 0.7),
            intensity: isHero ? 1.2 : 0.95,
            speed: 1.0,
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
                  id: 'eff_sweep_lat_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: stagger + 0.6,
                  duration: 1.3,
                  intensity: 1.0,
                },
              ]
            : [],
        };
      });
    },
  },
  {
    id: 'breyth_minimal_headline',
    name: '🎧 Breyth Headline — Tech House Minimal',
    description: 'Inspirado en Breyth Headline Show (MotionDesignArt): tipografía sobria, entradas en cascada pausadas, zoom suave constante y estética premium.',
    badge: 'Tech House',
    color: '#ffffff',
    category: 'motion_flyers',
    genre: 'Tech House Minimal',
    bpm: '126 BPM',
    demoProjectId: 'breyth_show',
    apply: (layers, duration) => {
      let nonBgCount = 0;
      return layers.map((layer, idx) => {
        const isBg = layer.role === 'background' || layer.name.toLowerCase().includes('bg');
        if (isBg) {
          return {
            ...layer,
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.3, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 1.3, duration: duration - 2.2, intensity: 0.35, speed: 0.5 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.28 + nonBgCount * 0.28;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: 'smoothSlideUp',
            start: stagger,
            duration: 1.25,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'slowZoom' : 'softFloat',
            start: stagger + 1.25,
            duration: Math.max(0.5, duration - (stagger + 1.25) - 0.8),
            intensity: 0.45,
            speed: 0.55,
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
                  id: 'eff_sweep_br_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: stagger + 0.7,
                  duration: 1.2,
                  intensity: 1.0,
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
    description: 'Inspirado en El Chamo · Nicky Jam (MotionDesignArt): portada de single con zoom pausado en el artista, respiración 3D del título y llegada suave.',
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
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.4, easing: 'easeOutExpo' },
            loopAnimation: { type: 'slowZoom', start: 1.4, duration: duration - 2.4, intensity: 0.4, speed: 0.5 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.3 + nonBgCount * 0.3;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: isHero ? 'softScale' : 'smoothSlideUp',
            start: stagger,
            duration: 1.35,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'breathing' : 'softFloat',
            start: stagger + 1.35,
            duration: Math.max(0.5, duration - (stagger + 1.35) - 0.8),
            intensity: 0.75,
            speed: 0.65,
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
                  id: 'eff_cover_sweep_' + Date.now() + '_' + idx,
                  type: 'lightSweep',
                  enabled: true,
                  start: stagger + 0.8,
                  duration: 1.5,
                  intensity: 0.95,
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
    description: 'Inspirado en Congo x Angola (MotionDesignArt): transiciones rítmicas cadenciadas, entradas progresivas y pulso festivo continuo.',
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
            inAnimation: { type: 'fadeIn', start: 0, duration: 1.3, easing: 'easeOutExpo' },
            loopAnimation: { type: 'gentleDrift', start: 1.3, duration: duration - 2.2, intensity: 0.45, speed: 0.65 },
            outAnimation: { type: 'smoothFadeOut', start: duration - 0.8, duration: 0.8, easing: 'easeInOutSine' },
            effects: [],
          };
        }

        const stagger = 0.26 + nonBgCount * 0.26;
        const isHero = layer.role === 'hero' || nonBgCount === 0;
        nonBgCount++;

        return {
          ...layer,
          inAnimation: {
            type: idx % 2 === 0 ? 'smoothSlideUp' : 'softScale',
            start: stagger,
            duration: 1.2,
            easing: 'easeOutExpo',
          },
          loopAnimation: {
            type: isHero ? 'loopPulse' : 'pendulumSwing',
            start: stagger + 1.2,
            duration: Math.max(0.5, duration - (stagger + 1.2) - 0.7),
            intensity: isHero ? 1.1 : 0.8,
            speed: 0.95,
          },
          outAnimation: {
            type: 'scaleOut',
            start: duration - 0.7,
            duration: 0.7,
            easing: 'easeInOutSine',
          },
          effects: [],
        };
      });
    },
  },
];

export const MOTION_FLYERS_TEMPLATES = MOTION_FLYER_TEMPLATES;
