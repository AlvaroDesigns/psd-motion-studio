import type { MotionTemplate } from './types';

export const MULTI_SLIDE_TEMPLATES: MotionTemplate[] = [
  {
    id: 'two_slides_neon_flyer',
    name: '🎞️ Diapositivas: Intro Logo Neón + Flyer',
    description: 'Estructura en 2 diapositivas: en la 1ª el logo irrumpe con Neón brillante (#23C83C) (0-2.5s) y en la 2ª entra el flyer completo con movimiento suave (2.5-7s).',
    badge: '2 Diapositivas',
    color: '#23C83C',
    category: 'multi_slides',
    apply: (layers, duration) => {
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
];
