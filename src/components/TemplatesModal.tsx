import React, { useState, useMemo } from 'react';
import type { SceneProject } from '../types/scene';
import { MOTION_TEMPLATES, type MotionTemplate } from '../utils/animationTemplates';
import { SAMPLE_PROJECTS_LIST } from '../utils/sampleProjects';
import {
  Wand2,
  X,
  Sparkles,
  Layers,
  Search,
  Check,
  Film,
  Music,
  Flame,
  Zap,
  Play,
} from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SceneProject;
  onApplyTemplate: (templateId: string) => void;
  onLoadDemoProject: (demoId: string) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyTemplate,
  onLoadDemoProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '✨ Todas las Plantillas', icon: Sparkles },
    { id: 'motion_flyers', label: '🌴 Motion Flyers (MotionDesignArt)', icon: Flame },
    { id: 'neon', label: '💡 Neón & Cyber Glow', icon: Zap },
    { id: 'festival_rave', label: '🔊 Festivales, Rave & Club', icon: Music },
    { id: 'smooth_luxury', label: '🌊 Suaves, Lujo & Cine', icon: Film },
    { id: 'multi_slides', label: '🎞️ Multi-Diapositivas', icon: Layers },
  ];

  const filteredTemplates = useMemo(() => {
    return MOTION_TEMPLATES.filter((template) => {
      // Category filter
      if (selectedCategory === 'motion_flyers') {
        if (template.category !== 'motion_flyers') return false;
      } else if (selectedCategory === 'neon') {
        if (!template.id.startsWith('neon_')) return false;
      } else if (selectedCategory === 'festival_rave') {
        const festIds = [
          'festival_rave',
          'techno_warehouse',
          'bass_drop_strobe',
          'mainstage_pyro',
          'psytrance_dimension',
          'urban_trap_distortion',
          'sunset_ibiza_melodic',
          'dynamic_hype',
          'cyberpunk_glitch',
          'poster_reveal',
        ];
        if (!festIds.includes(template.id)) return false;
      } else if (selectedCategory === 'smooth_luxury') {
        const smoothIds = [
          'smooth_silk_drift',
          'nordic_keynote',
          'editorial_fashion',
          'ambient_cosmic',
          'breathing_wellness',
          'kinetic_smooth',
          'cinema_elegance',
          'minimal_brand',
        ];
        if (!smoothIds.includes(template.id)) return false;
      } else if (selectedCategory === 'multi_slides') {
        if (template.id !== 'two_slides_neon_flyer') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(q);
        const matchesDesc = template.description.toLowerCase().includes(q);
        const matchesBadge = template.badge.toLowerCase().includes(q);
        const matchesGenre = template.genre?.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesBadge || matchesGenre;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleApply = (template: MotionTemplate) => {
    setActiveTemplateId(template.id);
    onApplyTemplate(template.id);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleLoadDemo = (demoId: string) => {
    onLoadDemoProject(demoId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 1040, width: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 107, 0, 0.15))',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                display: 'grid',
                placeItems: 'center',
                color: '#00d4ff',
              }}
            >
              <Wand2 size={20} />
            </span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Galería de Plantillas de Motion Flyers
              </div>
              <div style={{ fontSize: 12, color: 'var(--am-text-dim)', marginTop: 2 }}>
                Inspiradas en MotionDesignArt — Estilos animados para eventos, festivales, clubes y portadas
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Tabs Bar */}
        <div style={{ padding: '16px 24px 12px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Buscar por género (Afrobeat, Reggaeton, Neón, Techno, BPM...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 999,
                  padding: '8px 14px 8px 34px',
                  fontSize: 12,
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            {/* Total Badge */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--am-text-dim)', padding: '4px 12px', borderRadius: 999, background: 'rgba(255, 255, 255, 0.04)' }}>
              {filteredTemplates.length} Plantillas Disponibles
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: isActive ? '1px solid rgba(0, 212, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isActive ? 'linear-gradient(90deg, rgba(0, 212, 255, 0.15), rgba(72, 54, 255, 0.15))' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#00d4ff' : 'var(--am-text-dim)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={12} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body: Template Cards Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {filteredTemplates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--am-text-dim)' }}>
              <Search size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>No se encontraron plantillas</div>
              <p style={{ fontSize: 12 }}>Intenta con otro término de búsqueda o selecciona otra categoría.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))',
                gap: 16,
              }}
            >
              {filteredTemplates.map((tmpl) => {
                const demoProject = SAMPLE_PROJECTS_LIST.find((dp) => dp.id === tmpl.demoProjectId);
                const isSelected = activeTemplateId === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015))',
                      border: isSelected ? `1px solid ${tmpl.color}` : '1px solid rgba(255, 255, 255, 0.09)',
                      borderRadius: 16,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 8px 24px -8px ${tmpl.color}` : 'none',
                    }}
                  >
                    {/* Top Glow Accent Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: `linear-gradient(90deg, ${tmpl.color}, transparent 80%)`,
                      }}
                    />

                    {/* Card Header: Badges & Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '3px 9px',
                          borderRadius: 999,
                          color: '#07070f',
                          background: tmpl.color,
                        }}
                      >
                        {tmpl.badge}
                      </span>

                      {tmpl.bpm && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {tmpl.bpm}
                        </span>
                      )}
                    </div>

                    {/* Template Title */}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>
                        {tmpl.name}
                      </div>
                      {tmpl.genre && (
                        <div style={{ fontSize: 11, fontWeight: 600, color: tmpl.color }}>
                          {tmpl.genre}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 11.5, lineHeight: 1.45, color: 'rgba(255, 255, 255, 0.7)', margin: 0, flex: 1 }}>
                      {tmpl.description}
                    </p>

                    {/* Actions Row */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <button
                        onClick={() => handleApply(tmpl)}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '8px 12px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: tmpl.color,
                          color: '#07070f',
                          border: 'none',
                          transition: 'filter 0.15s ease',
                        }}
                        title={project.layers.length > 0 ? "Aplica esta animación a las capas de tu PSD" : "Aplica la animación al proyecto actual"}
                      >
                        {isSelected ? <Check size={12} /> : <Wand2 size={12} />}
                        <span>Aplicar a Capas</span>
                      </button>

                      {demoProject && (
                        <button
                          onClick={() => handleLoadDemo(demoProject.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            padding: '8px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                          }}
                          title="Carga el flyer demo completo pre-diseñado"
                        >
                          <Play size={11} fill="#fff" />
                          <span>Demo</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--am-text-dim)' }}>
            💡 Tip: Puedes importar cualquier PSD con capas separadas y aplicarle cualquiera de estas plantillas en un clic.
          </div>
          <button
            className="am-tool-btn"
            onClick={onClose}
            style={{ padding: '6px 18px', fontSize: 11 }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
