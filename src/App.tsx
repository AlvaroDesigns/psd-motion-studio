import React, { useState, useEffect, useRef } from 'react';
import type { SceneProject, SceneLayer, AIProposal } from './types/scene';
import { createEmptyProject, createMoventBrandProject } from './utils/sampleProjects';
import { MOTION_TEMPLATES } from './utils/animationTemplates';
import { parsePsdFile } from './utils/psdParser';
import { StudioViewport } from './components/StudioViewport';
import { Timeline } from './components/Timeline';
import { LayerInspector } from './components/LayerInspector';
import { AIDirectorModal } from './components/AIDirectorModal';
import { ExportModal } from './components/ExportModal';
import './styles/studio.css';
import logoImg from './assets/logo-white.png';
import {
  Upload,
  Sparkles,
  Layers,
  FolderOpen,
  Check,
  Lock,
  Unlock,
  Sliders,
  Film,
  Music,
  FolderTree,
  Share2,
  Play,
} from 'lucide-react';

const FESTIVAL_TEMPLATE_IDS = [
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

export function App() {
  const [project, setProject] = useState<SceneProject>(() => createEmptyProject());
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [leftTab, setLeftTab] = useState<'layers' | 'media' | 'audio'>('layers');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [activePane, setActivePane] = useState<'project' | 'inspector'>('inspector');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Playhead Clock Engine (RAF)
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (now - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= project.settings.duration) {
            return 0; // Loop playback
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, project.settings.duration]);

  const handleUpdateLayer = (updatedLayer: SceneLayer) => {
    setProject((prev) => ({
      ...prev,
      layers: prev.layers.map((l) => (l.id === updatedLayer.id ? updatedLayer : l)),
    }));
  };

    // Drag and drop handler for PSD files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.psd')) {
      try {
        setIsUploading(true);
        const parsedProject = await parsePsdFile(file);
        setProject(parsedProject);
        setSelectedLayerId(parsedProject.layers[0]?.id || null);
        setCurrentTime(0);
        setIsPlaying(true);
      } catch (err) {
        console.error('Error parsing PSD:', err);
        alert('Error al procesar el archivo PSD.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const parsedProject = await parsePsdFile(file);
      setProject(parsedProject);
      setSelectedLayerId(parsedProject.layers[0]?.id || null);
      setCurrentTime(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('Error parsing PSD:', err);
      alert('Error al procesar el archivo PSD.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Apply Animation Template to loaded layers
  const handleApplyTemplate = (templateId: string) => {
    if (!templateId) return;
    setSelectedTemplateId(templateId);
    const template = MOTION_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setProject((prev) => {
      const baseLayers = prev.layers.length > 0 ? prev.layers : createMoventBrandProject().layers;
      return {
        ...prev,
        layers: template.apply(baseLayers, prev.settings.duration),
      };
    });

    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Preview Button Handler (Rewinds to 0 and plays)
  const handleTriggerPreview = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleApplyAIProposal = (proposal: AIProposal) => {
    setProject((prev) => {
      const updatedLayers = prev.layers.map((layer) => {
        const cfg = proposal.layerConfigs[layer.role] || proposal.layerConfigs['hero'];
        if (!cfg) return layer;

        return {
          ...layer,
          inAnimation: { ...cfg.inAnimation },
          loopAnimation: { ...cfg.loopAnimation },
          outAnimation: { ...cfg.outAnimation },
          effects: cfg.effects ? [...cfg.effects] : layer.effects,
        };
      });

      return {
        ...prev,
        layers: updatedLayers,
      };
    });
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleApplyCustomMix = (mixMap: Record<string, string>) => {
    import('./utils/sampleProjects').then(({ getAIProposals }) => {
      const allProposals = getAIProposals();
      setProject((prev) => {
        const updatedLayers = prev.layers.map((layer) => {
          const propId = mixMap[layer.id];
          const targetProp = allProposals.find((p) => p.id === propId) || allProposals[0];
          const cfg = targetProp.layerConfigs[layer.role] || targetProp.layerConfigs['hero'];
          if (!cfg) return layer;

          return {
            ...layer,
            inAnimation: { ...cfg.inAnimation },
            loopAnimation: { ...cfg.loopAnimation },
            outAnimation: { ...cfg.outAnimation },
            effects: cfg.effects ? [...cfg.effects] : layer.effects,
          };
        });

        return {
          ...prev,
          layers: updatedLayers,
        };
      });
      setCurrentTime(0);
      setIsPlaying(true);
    });
  };

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <div className="motion-app" onDragOver={handleDragOver} onDrop={handleDrop}>
      {/* Hidden PSD File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".psd"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* TOP TOOLBAR - Apple Motion Style */}
      <header className="am-topbar">
        {/* Left: Brand Logo (NO BORDER) & Segmented View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="am-brand" title="Movent Motion">
            <div className="am-brand-logo">
              <img src={logoImg} alt="Movent" />
            </div>
          </div>

          <div className="am-segmented-group">
            <button
              className={`am-tool-btn ${activePane === 'project' ? 'active' : ''}`}
              onClick={() => setActivePane('project')}
            >
              <FolderTree size={12} /> Project Pane
            </button>
            <button
              className={`am-tool-btn ${activePane === 'inspector' ? 'active' : ''}`}
              onClick={() => setActivePane('inspector')}
            >
              <Sliders size={12} /> Inspector
            </button>
          </div>

          <button
            className="am-tool-btn"
            style={{ background: '#262833', border: '1px solid #363845' }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload size={12} color="#94a3b8" />
            {isUploading ? 'Importando...' : 'Import PSD'}
          </button>
        </div>

        {/* Center: Animation Templates & Behaviors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* PLANTILLAS DE ANIMACIÓN DROPDOWN */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Plantilla:
            </span>
            <select
              id="am-template-select"
              className="am-select"
              style={{ width: 260, height: 28, fontSize: 11 }}
              value={selectedTemplateId}
              onChange={(e) => handleApplyTemplate(e.target.value)}
            >
              <option value="" disabled>Seleccionar Plantilla...</option>
              <optgroup label="🎞️ DIAPOSITIVAS (MULTI-ESCENA)">
                {MOTION_TEMPLATES.filter((t) => t.id === 'two_slides_neon_flyer').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="⚡ ENERGÍA, FESTIVALES & RAVE (10 Estilos)">
                {MOTION_TEMPLATES.filter((t) => FESTIVAL_TEMPLATE_IDS.includes(t.id)).map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌊 MOVIMIENTOS SUAVES & CINE (8 Estilos)">
                {MOTION_TEMPLATES.filter((t) => t.id !== 'two_slides_neon_flyer' && !FESTIVAL_TEMPLATE_IDS.includes(t.id)).map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            className="am-tool-btn"
            onClick={() => setProject(createMoventBrandProject())}
            title="Cargar escena Demo"
          >
            <FolderOpen size={12} /> Demo
          </button>

          <button className="am-btn-ai" onClick={() => setIsAIModalOpen(true)}>
            <Sparkles size={13} /> IA
          </button>
        </div>

        {/* Right: PREVIEW BUTTON & Share / Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* BOTON DE PREVIEW DESTACADO */}
          <button
            className="am-btn-preview"
            onClick={handleTriggerPreview}
            title="Iniciar Vista Previa desde el segundo 0"
          >
            <Play size={13} fill="#fff" /> Preview
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--am-text-dim)' }}>
            <span>Fit: 35%</span>
            <span>• 1080×1920 (9:16)</span>
          </div>

          <button className="am-btn-primary" onClick={() => setIsExportModalOpen(true)}>
            <Share2 size={13} /> Export
          </button>
        </div>
      </header>

      {/* MAIN 3-PANE WORKSPACE */}
      <div className="am-workspace">
        {/* LEFT PANE: Layers / Media / Audio */}
        <aside className="am-pane-left">
          <div className="am-pane-tabs">
            <button
              className={`am-tab-item ${leftTab === 'layers' ? 'active' : ''}`}
              onClick={() => setLeftTab('layers')}
            >
              <Layers size={12} /> Layers
            </button>
            <button
              className={`am-tab-item ${leftTab === 'media' ? 'active' : ''}`}
              onClick={() => setLeftTab('media')}
            >
              <Film size={12} /> Media
            </button>
            <button
              className={`am-tab-item ${leftTab === 'audio' ? 'active' : ''}`}
              onClick={() => setLeftTab('audio')}
            >
              <Music size={12} /> Audio
            </button>
          </div>

          <div className="am-layers-container">
            {project.layers.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 16px', textAlign: 'center', height: '100%', color: 'var(--am-text-dim)' }}>
              <Layers size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--am-text)', marginBottom: 4 }}>
                Sin capas cargadas
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.4, marginBottom: 14 }}>
                Importa un archivo PSD para extraer sus capas automáticamente.
              </p>
              <button
                className="am-btn-primary"
                style={{ fontSize: 11, padding: '6px 14px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={12} /> Importar PSD
              </button>
            </div>
          ) : (
            project.layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <div
                  key={layer.id}
                  className={`am-layer-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedLayerId(layer.id)}
                >
                  <div
                    className={`am-check-box ${layer.visible ? 'checked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateLayer({ ...layer, visible: !layer.visible });
                    }}
                    title="Visibilidad de capa"
                  >
                    {layer.visible && <Check size={10} strokeWidth={3} />}
                  </div>

                  <div className="am-layer-icon">
                    {layer.canvas ? (
                      <canvas
                        ref={(node) => {
                          if (node && layer.canvas) {
                            node.width = 22;
                            node.height = 22;
                            const ctx = node.getContext('2d');
                            if (ctx) {
                              ctx.clearRect(0, 0, 22, 22);
                              ctx.drawImage(layer.canvas, 0, 0, 22, 22);
                            }
                          }
                        }}
                      />
                    ) : (
                      <Layers size={12} color="var(--am-text-dim)" />
                    )}
                  </div>

                  <div className="am-layer-title">{layer.name}</div>

                  <div
                    style={{ cursor: 'pointer', opacity: layer.locked ? 1 : 0.4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateLayer({ ...layer, locked: !layer.locked });
                    }}
                    title={layer.locked ? 'Bloqueada' : 'Desbloqueada'}
                  >
                    {layer.locked ? <Lock size={11} color="#f59e0b" /> : <Unlock size={11} />}
                  </div>
                </div>
              );
            })
          )}
          </div>
        </aside>

        {/* CENTER PANE: Apple Motion Inspector (Wider: 480px) */}
        {activePane === 'inspector' && (
          <aside className="am-pane-inspector">
            <LayerInspector
              layer={selectedLayer}
              onUpdateLayer={handleUpdateLayer}
              totalDuration={project.settings.duration}
            />
          </aside>
        )}

        {/* RIGHT PANE: Canvas Stage & Sub-Canvas Transport Bar */}
        <main className="am-pane-canvas">
          <StudioViewport
            project={project}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onRewind={() => setCurrentTime(0)}
            onSeek={(t) => setCurrentTime(t)}
            selectedLayerId={selectedLayerId}
          />
        </main>
      </div>

      {/* BOTTOM PANE: Apple Motion Timeline with Functional Keyframes View */}
      <Timeline
        project={project}
        currentTime={currentTime}
        duration={project.settings.duration}
        selectedLayerId={selectedLayerId}
        onSelectLayer={(id) => setSelectedLayerId(id)}
        onSeek={(t) => setCurrentTime(t)}
        onUpdateLayer={handleUpdateLayer}
      />

      {/* AI Creative Behaviors Modal */}
      <AIDirectorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        project={project}
        onApplyProposal={handleApplyAIProposal}
        onApplyCustomMix={handleApplyCustomMix}
      />

      {/* Video & JSON Export Modal (Fixed UI) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
      />
    </div>
  );
}

export default App;
