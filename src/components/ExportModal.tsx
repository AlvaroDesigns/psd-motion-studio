import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { SceneProject } from '../types/scene';
import { computeLayerState, renderLayerToCanvas } from '../engine/motionEngine';
import { Download, Film, Code, Check, Loader2, X, Play } from 'lucide-react';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SceneProject;
  /** A new value starts an MP4 render as soon as the export modal opens. */
  renderRequestId?: number;
}

const getFileName = (name: string) => `${name.toLowerCase().trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'proyecto'}_1080x1920.mp4`;

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project, renderRequestId = 0 }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'json'>('video');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const videoUrlRef = useRef<string | null>(null);
  const completedRequestRef = useRef(0);

  const clearVideoUrl = useCallback(() => {
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    videoUrlRef.current = null;
    setVideoUrl(null);
  }, []);

  useEffect(() => () => {
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
  }, []);

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

  const downloadVideo = useCallback((url: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = getFileName(project.settings.name);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }, [project.settings.name]);

  // High-fidelity client-side render to an actual H.264 MP4.
  const handleRenderVideo = useCallback(async () => {
    clearVideoUrl();
    setIsExporting(true);
    setProgress(0);
    setExportError(null);

    const width = project.settings.width;
    const height = project.settings.height;
    const fps = project.settings.fps;
    const totalFrames = Math.ceil(project.settings.duration * fps);

    // Offscreen render canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      setExportError('No se pudo crear el lienzo de renderizado.');
      setIsExporting(false);
      return;
    }

    const renderFrame = (frame: number) => {
      const t = frame / fps;
      ctx.fillStyle = project.settings.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      for (const layer of project.layers) {
        if (!layer.visible) continue;
        const state = computeLayerState(layer, t, project.settings.duration);
        renderLayerToCanvas(ctx, layer, state);
      }
    };

    const finish = (blob: Blob) => {
      if (blob.size === 0) throw new Error('El codificador no ha producido datos de vídeo.');
      const url = URL.createObjectURL(blob);
      videoUrlRef.current = url;
      setVideoUrl(url);
      setProgress(100);
      setIsExporting(false);
      // The Export action should result in an MP4 download, without a second click.
      downloadVideo(url);
    };

    try {
      const encoderConfig: VideoEncoderConfig = {
        codec: 'avc1.4d002a', // H.264 Main Profile, Level 4.2
        width,
        height,
        bitrate: 14_000_000,
        framerate: fps,
      };

      // WebCodecs is the reliable path because mp4-muxer receives real H.264 chunks.
      if (typeof window !== 'undefined' && 'VideoEncoder' in window && 'VideoFrame' in window) {
        const support = await VideoEncoder.isConfigSupported(encoderConfig);
        if (support.supported) {
          const target = new ArrayBufferTarget();
          const muxer = new Muxer({
            target,
            video: { codec: 'avc', width, height },
            fastStart: 'in-memory',
          });

          const videoEncoder = new VideoEncoder({
            output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            error: (error) => console.error('VideoEncoder error:', error),
          });

          videoEncoder.configure(encoderConfig);

          for (let frame = 0; frame < totalFrames; frame++) {
            renderFrame(frame);
            const videoFrame = new VideoFrame(offscreen, {
              timestamp: Math.round((frame / fps) * 1_000_000),
              duration: Math.round(1_000_000 / fps),
            });
            videoEncoder.encode(videoFrame, { keyFrame: frame % (fps * 2) === 0 });
            videoFrame.close();

            setProgress(Math.round(((frame + 1) / totalFrames) * 98));

            // Keep the UI responsive while encoding a long project.
            if (frame % 4 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
          }

          await videoEncoder.flush();
          videoEncoder.close();
          muxer.finalize();
          finish(new Blob([target.buffer], { type: 'video/mp4' }));
          return;
        }
      }

      // Safari can expose an MP4 MediaRecorder even without WebCodecs. Never relabel
      // WebM as .mp4: that produces files that fail in QuickTime and social apps.
      if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported('video/mp4')) {
        throw new Error('Este navegador no puede codificar H.264/MP4. Abre el proyecto en Chrome o Edge actualizado e inténtalo de nuevo.');
      }

      const stream = offscreen.captureStream(fps);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/mp4',
        videoBitsPerSecond: 14000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const completed = new Promise<void>((resolve, reject) => {
        recorder.onstop = () => {
          try {
            finish(new Blob(chunks, { type: 'video/mp4' }));
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        recorder.onerror = () => reject(new Error('MediaRecorder no ha podido codificar el MP4.'));
      });

      recorder.start();
      const frameInterval = 1000 / fps;
      const track = stream.getVideoTracks()[0];
      for (let frame = 0; frame < totalFrames; frame++) {
        renderFrame(frame);
        (track as MediaStreamTrack & { requestFrame?: () => void } | undefined)?.requestFrame?.();
        setProgress(Math.round(((frame + 1) / totalFrames) * 98));
        await new Promise((resolve) => setTimeout(resolve, frameInterval));
      }
      recorder.stop();
      await completed;
    } catch (err) {
      console.error('Error rendering video:', err);
      setExportError(err instanceof Error ? err.message : 'No se ha podido renderizar el vídeo MP4.');
      setIsExporting(false);
    }
  }, [clearVideoUrl, downloadVideo, project]);

  useEffect(() => {
    if (isOpen && renderRequestId > 0 && completedRequestRef.current !== renderRequestId) {
      completedRequestRef.current = renderRequestId;
      void handleRenderVideo();
    }
  }, [handleRenderVideo, isOpen, renderRequestId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--am-border)', paddingBottom: 10, marginBottom: 16 }}>
            <button
              className="btn"
              style={{
                background: activeTab === 'video' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                borderColor: activeTab === 'video' ? '#3b82f6' : 'transparent',
                color: activeTab === 'video' ? '#93c5fd' : 'var(--am-text-dim)',
              }}
              onClick={() => setActiveTab('video')}
            >
              <Film size={14} /> Renderizar Vídeo MP4 (1080×1920)
            </button>
            <button
              className="btn"
              style={{
                background: activeTab === 'json' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                borderColor: activeTab === 'json' ? '#a855f7' : 'transparent',
                color: activeTab === 'json' ? '#d8b4fe' : 'var(--am-text-dim)',
              }}
              onClick={() => setActiveTab('json')}
            >
              <Code size={14} /> Scene JSON (FFmpeg / API)
            </button>
          </div>

          {activeTab === 'video' ? (
            <div>
              <p style={{ fontSize: 13, color: 'var(--am-text-dim)', marginBottom: 16 }}>
                Exporta la animación determinista completa a <strong>MP4 (H.264) a 1080×1920 (9:16) a {project.settings.fps} FPS</strong> con todos los efectos (Glow, Light Sweep, RGB Split, Glitch) listo para Stories, Reels y QuickTime.
              </p>

              {isExporting ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', background: '#111218', borderRadius: 8, border: '1px solid var(--am-border)' }}>
                  <Loader2 size={32} className="spin" color="#3b82f6" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Renderizando vídeo MP4... {progress}%</div>
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', transition: 'width 0.1s linear' }} />
                  </div>
                </div>
              ) : exportError ? (
                <div style={{ textAlign: 'center', padding: 20, background: 'rgba(239, 68, 68, 0.08)', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.35)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fca5a5', marginBottom: 8 }}>No se ha podido crear el MP4</div>
                  <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--am-text-dim)', lineHeight: 1.45 }}>{exportError}</p>
                  <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: 13 }} onClick={handleRenderVideo}>
                    <Play size={15} /> Reintentar renderizado MP4
                  </button>
                </div>
              ) : videoUrl ? (
                <div style={{ textAlign: 'center', padding: 16, background: '#111218', borderRadius: 8, border: '1px solid var(--am-border)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80', marginBottom: 12 }}>
                    ✓ ¡Vídeo MP4 renderizado con éxito!
                  </div>
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    style={{ width: 180, borderRadius: 8, border: '1px solid #384058', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)', marginBottom: 16 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <a
                      href={videoUrl}
                      download={getFileName(project.settings.name)}
                      className="btn btn-primary"
                      style={{ padding: '9px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
                    >
                      <Download size={16} /> Descargar Archivo MP4
                    </a>
                    <span style={{ fontSize: 11, color: 'var(--am-text-dim)' }}>
                      Formato: <strong>MP4 (H.264)</strong> • 1080×1920 (9:16) • {project.settings.fps} FPS
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 14 }} onClick={handleRenderVideo}>
                    <Play size={16} /> Iniciar Renderizado MP4
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: 'var(--am-text-dim)', marginBottom: 12 }}>
                Este esquema JSON determinista es consumible por el worker de backend <strong>FFmpeg</strong> o la API de renderizado remoto.
              </p>
              <div style={{ position: 'relative' }}>
                <pre
                  style={{
                    background: '#090a10',
                    border: '1px solid var(--am-border)',
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
                  {jsonCopied ? <Check size={14} color="#4ade80" /> : <Code size={14} />}
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
