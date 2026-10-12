import React, { useState } from 'react';
import type { SceneProject } from '../types/scene';
import { computeLayerState, renderLayerToCanvas } from '../engine/motionEngine';
import { Download, Film, Code, Check, Loader2, X, Play } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SceneProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'json'>('video');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  if (!isOpen) return null;

  // Clean serializable Scene JSON (stripping in-memory canvas objects)
  const getCleanSceneJson = () => {
    return {
      version: '1.0.0',
      generator: 'PSD Motion Studio',
      project: {
        name: project.settings.name,
        width: project.settings.width,
        height: project.settings.height,
        fps: project.settings.fps,
        duration: project.settings.duration,
        backgroundColor: project.settings.backgroundColor,
      },
      layers: project.layers.map((l) => ({
        id: l.id,
        name: l.name,
        role: l.role,
        origin: { x: l.x, y: l.y, width: l.width, height: l.height },
        opacity: l.opacity,
        blendMode: l.blendMode,
        visible: l.visible,
        animations: {
          in: l.inAnimation,
          loop: l.loopAnimation,
          out: l.outAnimation,
        },
        effects: l.effects,
      })),
    };
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(getCleanSceneJson(), null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(getCleanSceneJson(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.settings.name.toLowerCase().replace(/\s+/g, '_')}_scene.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // High-fidelity client-side render to Video
  const handleRenderVideo = async () => {
    setIsExporting(true);
    setProgress(0);
    setVideoUrl(null);

    // Offscreen render canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = project.settings.width;
    offscreen.height = project.settings.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const stream = offscreen.captureStream(project.settings.fps);
    const mimeTypes = [
      'video/mp4;codecs=avc1',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    let selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

    const recorder = new MediaRecorder(stream, {
      mimeType: selectedMime,
      videoBitsPerSecond: 12000000, // 12 Mbps crystal clear
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedMime });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setIsExporting(false);
      setProgress(100);
    };

    recorder.start();

    const fps = project.settings.fps;
    const totalFrames = Math.ceil(project.settings.duration * fps);
    const frameInterval = 1000 / fps;

    // Render frame-by-frame
    for (let frame = 0; frame <= totalFrames; frame++) {
      const t = frame / fps;

      // Draw background
      ctx.fillStyle = project.settings.backgroundColor;
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);

      // Draw each layer
      for (const layer of project.layers) {
        if (!layer.visible) continue;
        const state = computeLayerState(layer, t, project.settings.duration);
        renderLayerToCanvas(ctx, layer, state);
      }

      setProgress(Math.round((frame / totalFrames) * 100));
      // Give MediaRecorder time to capture each frame
      await new Promise((resolve) => setTimeout(resolve, Math.max(10, frameInterval * 0.4)));
    }

    recorder.stop();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Film size={22} />
            </span>
            <span>Exportar Proyecto</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 16 }}>
            <button
              className="btn"
              style={{
                background: activeTab === 'video' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                borderColor: activeTab === 'video' ? 'var(--neon-cyan)' : 'transparent',
                color: activeTab === 'video' ? 'var(--neon-cyan)' : 'var(--text-muted)',
              }}
              onClick={() => setActiveTab('video')}
            >
              <Film size={14} /> Renderizar Vídeo (1080×1920)
            </button>
            <button
              className="btn"
              style={{
                background: activeTab === 'json' ? 'rgba(247, 37, 133, 0.15)' : 'transparent',
                borderColor: activeTab === 'json' ? 'var(--neon-magenta)' : 'transparent',
                color: activeTab === 'json' ? 'var(--neon-magenta)' : 'var(--text-muted)',
              }}
              onClick={() => setActiveTab('json')}
            >
              <Code size={14} /> Scene JSON (FFmpeg / API)
            </button>
          </div>

          {activeTab === 'video' ? (
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Exporta la animación determinista completa a <strong>1080×1920 (9:16) a {project.settings.fps} FPS</strong> con todos los efectos (Glow, Light Sweep, RGB Split, Glitch).
              </p>

              {isExporting ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)' }}>
                  <Loader2 size={32} className="spin" color="var(--neon-cyan)" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Renderizando fotogramas... {progress}%</div>
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta))', transition: 'width 0.1s linear' }} />
                  </div>
                </div>
              ) : videoUrl ? (
                <div style={{ textAlign: 'center', padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--neon-green)', marginBottom: 12 }}>
                    ✓ ¡Vídeo renderizado con éxito!
                  </div>
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    style={{ width: 180, borderRadius: 8, border: '1px solid var(--border-accent)', boxShadow: '0 0 20px rgba(0,240,255,0.2)', marginBottom: 16 }}
                  />
                  <div>
                    <a
                      href={videoUrl}
                      download={`${project.settings.name.toLowerCase().replace(/\s+/g, '_')}_1080x1920.webm`}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', textDecoration: 'none' }}
                    >
                      <Download size={16} /> Descargar Archivo de Vídeo
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 14 }} onClick={handleRenderVideo}>
                    <Play size={16} /> Iniciar Renderizado Ahora
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                Este esquema JSON determinista es consumible por el worker de backend <strong>FFmpeg</strong> o la API de renderizado remoto.
              </p>
              <div style={{ position: 'relative' }}>
                <pre
                  style={{
                    background: '#090a10',
                    border: '1px solid var(--border-subtle)',
                    padding: 14,
                    borderRadius: 6,
                    maxHeight: 280,
                    overflowY: 'auto',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#a5b4fc',
                  }}
                >
                  {JSON.stringify(getCleanSceneJson(), null, 2)}
                </pre>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button className="btn" onClick={handleCopyJson}>
                  {jsonCopied ? <Check size={14} color="var(--neon-green)" /> : <Code size={14} />}
                  {jsonCopied ? '¡Copiado!' : 'Copiar JSON'}
                </button>
                <button className="btn" onClick={handleDownloadJson}>
                  <Download size={14} /> Descargar .json
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
