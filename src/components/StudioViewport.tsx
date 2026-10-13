import React, { useEffect, useRef } from 'react';
import type { SceneProject } from '../types/scene';
import { computeLayerState, renderLayerToCanvas } from '../engine/motionEngine';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MousePointer,
  Move3d,
  Hand,
  Type,
  ChevronDown,
} from 'lucide-react';

interface StudioViewportProps {
  project: SceneProject;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRewind: () => void;
  onSeek: (time: number) => void;
  selectedLayerId: string | null;
}

export const StudioViewport: React.FC<StudioViewportProps> = ({
  project,
  currentTime,
  isPlaying,
  onTogglePlay,
  onRewind,
  onSeek,
  selectedLayerId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

        // Clear background
    ctx.fillStyle = project.settings.backgroundColor || '#030907';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Empty canvas guide when no layers loaded
    if (project.layers.length === 0) {
      ctx.strokeStyle = 'rgba(35, 200, 60, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 120) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#a2c2b0';
      ctx.font = '700 38px "Outfit", sans-serif';
      ctx.fillText('LIENZO 9:16 (1080×1920)', canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillStyle = '#627c6f';
      ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Arrastra un archivo PSD aquí o usa "Import PSD"', canvas.width / 2, canvas.height / 2 + 20);
      ctx.restore();
      return;
    }

    // Render layers back to front
    for (const layer of project.layers) {
      if (!layer.visible) continue;
      const state = computeLayerState(layer, currentTime, project.settings.duration);
      renderLayerToCanvas(ctx, layer, state);

      // Apple Motion style selection highlight (only when paused/editing, hidden during playback)
      if (layer.id === selectedLayerId && state.visible && !isPlaying) {
        ctx.save();
        ctx.strokeStyle = 'rgba(35, 200, 60, 0.75)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 5]);
        const cx = layer.x + layer.width / 2 + state.translateX;
        const cy = layer.y + layer.height / 2 + state.translateY;
        ctx.translate(cx, cy);
        if (state.rotation !== 0) ctx.rotate((state.rotation * Math.PI) / 180);
        ctx.scale(state.scaleX, state.scaleY);
        ctx.strokeRect(-layer.width / 2 - 3, -layer.height / 2 - 3, layer.width + 6, layer.height + 6);
        ctx.restore();
      }
    }
  }, [project, currentTime, selectedLayerId, isPlaying]);

  // Frame count calculation (e.g. 000104 like Apple Motion in Image 2)
  const currentFrame = Math.round(currentTime * project.settings.fps);
  const formattedFrame = currentFrame.toString().padStart(6, '0');

  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Canvas Top Bar - Apple Motion dropdowns */}
      <div className="am-canvas-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="am-canvas-dropdown">
            <span>Main Story (1080×1920)</span>
            <ChevronDown size={11} />
          </div>
          <div className="am-canvas-dropdown" style={{ color: 'var(--am-text-dim)' }}>
            <span>Camera 1</span>
            <ChevronDown size={11} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--am-text-dim)' }}>
          <span>{project.settings.fps} FPS</span>
          <span style={{ color: 'var(--movent-bright)' }}>9:16 Vertical</span>
        </div>
      </div>

      {/* Center 9:16 Stage with Apple Motion Yellow/Green selection box */}
      <div className="am-viewport-stage">
        <div className="am-canvas-frame">
          <canvas
            ref={canvasRef}
            width={project.settings.width}
            height={project.settings.height}
          />
        </div>
      </div>

      {/* SUB-CANVAS TRANSPORT & TOOLS BAR (Exact match to Image 2) */}
      <div className="am-transport-bar">
        {/* Left Tools (Pointer, 3D, Hand, Text) */}
        <div className="am-tools-group">
          <button className="am-tool-btn active" title="Select Tool (A)">
            <MousePointer size={13} />
          </button>
          <button className="am-tool-btn" title="3D Transform Tool">
            <Move3d size={13} />
          </button>
          <button className="am-tool-btn" title="Hand Tool (H)">
            <Hand size={13} />
          </button>
          <button className="am-tool-btn" title="Text Tool (T)">
            <Type size={13} />
          </button>
        </div>

        {/* Center Transport Controls + Digital Frame Readout */}
        <div className="am-transport-controls">
          <button className="am-tool-btn" onClick={onRewind} title="First Frame (Home)">
            <SkipBack size={13} />
          </button>

          <button
            className="am-tool-btn"
            style={{
              background: isPlaying ? 'rgba(35, 200, 60, 0.2)' : '#262833',
              color: isPlaying ? 'var(--movent-bright)' : '#fff',
              borderRadius: '50%',
              width: 28,
              height: 28,
              padding: 0,
              justifyContent: 'center',
            }}
            onClick={onTogglePlay}
            title={isPlaying ? 'Pausa (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}
          </button>

          <button
            className="am-tool-btn"
            onClick={() => onSeek(Math.min(project.settings.duration, currentTime + 0.1))}
            title="Step Forward"
          >
            <SkipForward size={13} />
          </button>

          {/* Apple Motion Frame Readout (000104 in Image 2) */}
          <div className="am-timecode-box">
            <span>{formattedFrame}</span>
            <span style={{ color: 'var(--am-text-faint)', fontSize: 10 }}>F</span>
          </div>

          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--am-text-dim)', marginLeft: 4 }}>
            {formatTimecode(currentTime)}
          </div>
        </div>

        {/* Right Scrubber slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 140 }}>
          <input
            type="range"
            min="0"
            max={project.settings.duration}
            step="0.03"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--movent-bright)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};
