import type { SceneLayer } from '../types/scene';

export type TemplateCategory =
  | 'motion_flyers'
  | 'neon'
  | 'festival_rave'
  | 'smooth_luxury'
  | 'multi_slides';

export interface MotionTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  color: string;
  category?: TemplateCategory;
  genre?: string;
  bpm?: string;
  demoProjectId?: string;
  apply: (layers: SceneLayer[], duration: number) => SceneLayer[];
}
