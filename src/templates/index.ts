import type { MotionTemplate, TemplateCategory } from './types';
import { MULTI_SLIDE_TEMPLATES } from './multiSlides';
import { MOTION_FLYERS_TEMPLATES } from './motionFlyers';
import { NEON_GLOW_TEMPLATES } from './neonGlow';
import { SMOOTH_LUXURY_TEMPLATES } from './smoothLuxury';
import { FESTIVAL_RAVE_TEMPLATES } from './festivalRave';

export * from './types';
export { MULTI_SLIDE_TEMPLATES } from './multiSlides';
export { MOTION_FLYERS_TEMPLATES } from './motionFlyers';
export { NEON_GLOW_TEMPLATES } from './neonGlow';
export { SMOOTH_LUXURY_TEMPLATES } from './smoothLuxury';
export { FESTIVAL_RAVE_TEMPLATES } from './festivalRave';

/**
 * Colección completa consolidada de todas las plantillas de movimiento.
 */
export const MOTION_TEMPLATES: MotionTemplate[] = [
  ...MULTI_SLIDE_TEMPLATES,
  ...MOTION_FLYERS_TEMPLATES,
  ...NEON_GLOW_TEMPLATES,
  ...SMOOTH_LUXURY_TEMPLATES,
  ...FESTIVAL_RAVE_TEMPLATES,
];

/**
 * Busca una plantilla por su identificador único.
 */
export function getTemplateById(id: string): MotionTemplate | undefined {
  return MOTION_TEMPLATES.find((t) => t.id === id);
}

/**
 * Obtiene todas las plantillas pertenecientes a una categoría.
 */
export function getTemplatesByCategory(category: TemplateCategory): MotionTemplate[] {
  return MOTION_TEMPLATES.filter((t) => t.category === category);
}
