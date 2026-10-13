import type { MotionTemplate } from './types';

export const SMOOTH_LUXURY_TEMPLATES: MotionTemplate[] = [
  {
    id: 'smooth_silk_drift',
    name: '🌊 Seda Líquida / Luxury Drift (Ultra Suave)',
    description: 'Movimiento hipnótico y sedoso, micro-desplazamientos con curva Ease Out Expo y flotación armónica.',
    badge: 'Ultra Suave',
    color: '#00f2fe',
    category: 'smooth_luxury',
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
    category: 'smooth_luxury',
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
    category: 'smooth_luxury',
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
    category: 'smooth_luxury',
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
    category: 'smooth_luxury',
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
    category: 'smooth_luxury',
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
  {
    id: 'cinema_elegance',
    name: '✨ Cine & Elegancia Clásica',
    description: 'Fades suaves cinematográficos, zooms pausados con lente 35mm y salidas graduales.',
    badge: 'Premium',
    color: '#ffd166',
    category: 'smooth_luxury',
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
    category: 'smooth_luxury',
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
];
