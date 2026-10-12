import React, { useState } from 'react';
import type { SceneProject, AIProposal } from '../types/scene';
import { getAIProposals } from '../utils/sampleProjects';
import { Sparkles, Wand2, Check, X, Shuffle } from 'lucide-react';

interface AIDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SceneProject;
  onApplyProposal: (proposal: AIProposal) => void;
  onApplyCustomMix: (mixMap: Record<string, string>) => void; // layerId -> proposalId
}

export const AIDirectorModal: React.FC<AIDirectorModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyProposal,
  onApplyCustomMix,
}) => {
  const [prompt, setPrompt] = useState('Haz una Story de 7 segundos, estilo festival electrónico, dinámica pero elegante');
  const [proposals] = useState<AIProposal[]>(getAIProposals());
  const [selectedProposalId, setSelectedProposalId] = useState<string>('proposal_neon');
  const [activeTab, setActiveTab] = useState<'proposals' | 'mix'>('proposals');

  // Mix & Match state: map layerId -> proposalId
  const [layerMix, setLayerMix] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const layer of project.layers) {
      initial[layer.id] = 'proposal_neon';
    }
    return initial;
  });

  if (!isOpen) return null;

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  const handleApplyFull = () => {
    if (currentProposal) {
      onApplyProposal(currentProposal);
      onClose();
    }
  };

  const handleApplyMix = () => {
    onApplyCustomMix(layerMix);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ color: 'var(--neon-magenta)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wand2 size={22} />
            </span>
            <span>Director Creativo IA — Propuestas de Timeline</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Natural Language Prompt Box */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Instrucción Creativa (Prompt para el Director IA)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-control"
                style={{ fontSize: 13, padding: '10px 14px' }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe el estilo, ritmo y duración deseados..."
              />
              <button className="btn btn-ai" style={{ padding: '0 18px' }}>
                <Sparkles size={15} /> Regenerar
              </button>
            </div>

            {/* Quick chips */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                '⚡ Festival Electrónico (Neon & Glitch)',
                '✨ Lujo & Moda (Fades & Parallax)',
                '🚀 Sneaker Drop (Dynamic & Pop)',
              ].map((chip) => (
                <button
                  key={chip}
                  className="btn"
                  style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(255,255,255,0.03)' }}
                  onClick={() => setPrompt(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Subtabs: 3 Propuestas Completas vs Mezclar Partes */}
          <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 16 }}>
            <button
              className="btn"
              style={{
                background: activeTab === 'proposals' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                borderColor: activeTab === 'proposals' ? 'var(--neon-cyan)' : 'transparent',
                color: activeTab === 'proposals' ? 'var(--neon-cyan)' : 'var(--text-muted)',
              }}
              onClick={() => setActiveTab('proposals')}
            >
              3 Alternativas Generadas
            </button>
            <button
              className="btn"
              style={{
                background: activeTab === 'mix' ? 'rgba(247, 37, 133, 0.15)' : 'transparent',
                borderColor: activeTab === 'mix' ? 'var(--neon-magenta)' : 'transparent',
                color: activeTab === 'mix' ? 'var(--neon-magenta)' : 'var(--text-muted)',
              }}
              onClick={() => setActiveTab('mix')}
            >
              <Shuffle size={13} /> Mezclar Partes (Mix & Match)
            </button>
          </div>

          {activeTab === 'proposals' ? (
            <>
              {/* Proposal Cards Grid */}
              <div className="proposal-cards-grid">
                {proposals.map((prop) => {
                  const isSelected = prop.id === selectedProposalId;
                  return (
                    <div
                      key={prop.id}
                      className={`proposal-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedProposalId(prop.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: prop.accentColor, fontFamily: 'Outfit, sans-serif' }}>
                          {prop.name}
                        </span>
                        {isSelected && <Check size={16} color="var(--neon-cyan)" />}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>{prop.vibe}</span>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, flex: 1 }}>
                        {prop.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown Table for Selected Proposal */}
              <div style={{ marginTop: 22, background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>
                  Desglose de Timeline determinista propuesta ({currentProposal.name})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {project.layers.map((layer) => {
                    const cfg = currentProposal.layerConfigs[layer.role] || currentProposal.layerConfigs['hero'];
                    if (!cfg) return null;
                    return (
                      <div
                        key={layer.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 4,
                          fontSize: 12,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', width: 140 }}>{layer.name}</span>
                        <span style={{ color: 'var(--neon-green)', fontFamily: 'JetBrains Mono, monospace' }}>
                          → {cfg.inAnimation.type} ({cfg.inAnimation.start}s | {cfg.inAnimation.duration}s)
                        </span>
                        <span style={{ color: 'var(--neon-amber)', fontFamily: 'JetBrains Mono, monospace' }}>
                          ⚡ {cfg.loopAnimation.type}
                        </span>
                        <span style={{ color: 'var(--neon-magenta)', fontFamily: 'JetBrains Mono, monospace' }}>
                          ◼ {cfg.outAnimation.type} ({cfg.outAnimation.start}s)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* MIX & MATCH TAB */
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                Combina estilos a nivel de capa: por ejemplo, usa el <strong>Hero de Neon Cyber</strong>, el <strong>Título de Dynamic</strong> y el <strong>Fondo de Elegant</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.layers.map((layer) => {
                  const selectedPropId = layerMix[layer.id] || 'proposal_neon';
                  return (
                    <div
                      key={layer.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 6,
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{layer.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Rol: {layer.role}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {proposals.map((p) => {
                          const isPicked = selectedPropId === p.id;
                          return (
                            <button
                              key={p.id}
                              className="btn"
                              style={{
                                fontSize: 11,
                                padding: '4px 10px',
                                background: isPicked ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                                borderColor: isPicked ? 'var(--neon-cyan)' : 'transparent',
                                color: isPicked ? 'var(--neon-cyan)' : 'var(--text-muted)',
                              }}
                              onClick={() => setLayerMix({ ...layerMix, [layer.id]: p.id })}
                            >
                              {p.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn" onClick={onClose}>
            Cancelar
          </button>
          {activeTab === 'proposals' ? (
            <button className="btn btn-primary" onClick={handleApplyFull}>
              <Check size={16} /> Aplicar Propuesta "{currentProposal.name}"
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleApplyMix}>
              <Shuffle size={16} /> Aplicar Mezcla Personalizada
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
