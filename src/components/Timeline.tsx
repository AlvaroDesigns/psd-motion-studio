import React, { useRef, useState, useEffect } from 'react';
import type { SceneProject, SceneLayer } from '../types/scene';
import {
  Check,
  Lock,
  Unlock,
  Magnet,
  Scissors,
  Plus,
  Film,
  Zap,
} from 'lucide-react';

interface TimelineProps {
  project: SceneProject;
  currentTime: number;
  duration: number;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onSeek: (time: number) => void;
  onUpdateLayer: (updatedLayer: SceneLayer) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentTime,
  duration,
  selectedLayerId,
  onSelectLayer,
  onSeek,
  onUpdateLayer,
}) => {
  const tracksContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(140);
  const [timelineView, setTimelineView] = useState<'tracks' | 'keyframes'>('tracks');
  const [draggingClip, setDraggingClip] = useState<{
    layerId: string;
    clipType: 'in' | 'out';
    startX: number;
    initialStart: number;
    initialDuration: number;
    isResizing?: boolean;
  } | null>(null);

  const [draggingKeyframe, setDraggingKeyframe] = useState<{
    layerId: string;
    keyType: 'inStart' | 'inEnd' | 'outStart' | 'outEnd';
    startX: number;
    initialTime: number;
  } | null>(null);

  const pxPerSec = zoomLevel;

  const slides = project.slides && project.slides.length > 0 ? project.slides : [
    { id: 'slide-1', title: 'Intro Logo Neón', startTime: 0, duration: 2.5, transition: 'neonFlash' as const },
    { id: 'slide-2', title: 'Flyer Principal', startTime: 2.5, duration: 4.5, transition: 'fade' as const },
  ];

  const handleRulerMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    updateScrubTime(e.clientX);
  };

  const updateScrubTime = (clientX: number) => {
    if (!tracksContainerRef.current) return;
    const rect = tracksContainerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newTime = Math.max(0, Math.min(duration, offsetX / pxPerSec));
    onSeek(newTime);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        updateScrubTime(e.clientX);
      } else if (draggingClip) {
        const deltaX = e.clientX - draggingClip.startX;
        const deltaTime = deltaX / pxPerSec;
        const layer = project.layers.find((l) => l.id === draggingClip.layerId);
        if (!layer) return;

        if (draggingClip.clipType === 'in') {
          if (draggingClip.isResizing) {
            const newDuration = Math.max(0.2, Math.min(3.0, draggingClip.initialDuration + deltaTime));
            onUpdateLayer({
              ...layer,
              inAnimation: { ...layer.inAnimation, duration: Number(newDuration.toFixed(2)) },
            });
          } else {
            const newStart = Math.max(0, Math.min(duration - 0.5, draggingClip.initialStart + deltaTime));
            onUpdateLayer({
              ...layer,
              inAnimation: { ...layer.inAnimation, start: Number(newStart.toFixed(2)) },
            });
          }
        } else if (draggingClip.clipType === 'out') {
          if (draggingClip.isResizing) {
            const newDuration = Math.max(0.2, Math.min(2.5, draggingClip.initialDuration + deltaTime));
            onUpdateLayer({
              ...layer,
              outAnimation: { ...layer.outAnimation, duration: Number(newDuration.toFixed(2)) },
            });
          } else {
            const newStart = Math.max(1.0, Math.min(duration - 0.2, draggingClip.initialStart + deltaTime));
            onUpdateLayer({
              ...layer,
              outAnimation: { ...layer.outAnimation, start: Number(newStart.toFixed(2)) },
            });
          }
        }
      } else if (draggingKeyframe) {
        const deltaX = e.clientX - draggingKeyframe.startX;
        const deltaTime = deltaX / pxPerSec;
        const layer = project.layers.find((l) => l.id === draggingKeyframe.layerId);
        if (!layer) return;

        const newTime = Math.max(0, Math.min(duration, draggingKeyframe.initialTime + deltaTime));
        if (draggingKeyframe.keyType === 'inStart') {
          onUpdateLayer({
            ...layer,
            inAnimation: { ...layer.inAnimation, start: Number(newTime.toFixed(2)) },
          });
        } else if (draggingKeyframe.keyType === 'inEnd') {
          const newDur = Math.max(0.2, newTime - layer.inAnimation.start);
          onUpdateLayer({
            ...layer,
            inAnimation: { ...layer.inAnimation, duration: Number(newDur.toFixed(2)) },
          });
        } else if (draggingKeyframe.keyType === 'outStart') {
          onUpdateLayer({
            ...layer,
            outAnimation: { ...layer.outAnimation, start: Number(newTime.toFixed(2)) },
          });
        } else if (draggingKeyframe.keyType === 'outEnd') {
          const newDur = Math.max(0.2, newTime - layer.outAnimation.start);
          onUpdateLayer({
            ...layer,
            outAnimation: { ...layer.outAnimation, duration: Number(newDur.toFixed(2)) },
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
      setDraggingClip(null);
      setDraggingKeyframe(null);
    };

    if (isScrubbing || draggingClip || draggingKeyframe) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, draggingClip, draggingKeyframe, pxPerSec, duration, project.layers]);

  // Frame ticks (Apple Motion ruler: 1, 30, 60, 90, 120...)
  const fps = project.settings.fps;
  const totalFrames = Math.round(duration * fps);
  const frameTicks = [];
  for (let f = 0; f <= totalFrames; f += 30) {
    frameTicks.push(f);
  }

  const playheadX = currentTime * pxPerSec;

  const handleAddKeyframeAtPlayhead = () => {
    if (!selectedLayerId) return;
    const layer = project.layers.find((l) => l.id === selectedLayerId);
    if (!layer) return;

    // Adjust in or out start to current playhead
    if (currentTime < duration / 2) {
      onUpdateLayer({
        ...layer,
        inAnimation: { ...layer.inAnimation, start: Number(currentTime.toFixed(2)) },
      });
    } else {
      onUpdateLayer({
        ...layer,
        outAnimation: { ...layer.outAnimation, start: Number(currentTime.toFixed(2)) },
      });
    }
  };

  return (
    <div className="am-timeline-container">
      {/* TIMELINE TOOLBAR (Functional Tracks vs Keyframes switcher) */}
      <div className="am-timeline-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Timeline</span>

          {/* Functional Mode Switcher */}
          <div className="am-segmented-group" style={{ height: 22 }}>
            <button
              className={`am-tool-btn ${timelineView === 'tracks' ? 'active' : ''}`}
              style={{ padding: '2px 9px', fontSize: 10 }}
              onClick={() => setTimelineView('tracks')}
            >
              Tracks
            </button>
            <button
              className={`am-tool-btn ${timelineView === 'keyframes' ? 'active' : ''}`}
              style={{ padding: '2px 9px', fontSize: 10 }}
              onClick={() => setTimelineView('keyframes')}
            >
              Keyframes (Curvas)
            </button>
          </div>

          {timelineView === 'keyframes' && (
            <button
              className="am-tool-btn"
              style={{ background: '#223c2d', border: '1px solid var(--movent-bright)', color: '#fff', fontSize: 10, padding: '2px 8px' }}
              onClick={handleAddKeyframeAtPlayhead}
              title="Añadir fotograma clave en el tiempo actual"
            >
              <Plus size={11} /> + Keyframe ({currentTime.toFixed(2)}s)
            </button>
          )}
        </div>

        {/* Snapping & blade tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="am-tool-btn active" title="Snapping (N)">
            <Magnet size={11} color="var(--movent-bright)" />
          </button>
          <button className="am-tool-btn" title="Blade Tool (B)">
            <Scissors size={11} />
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, color: 'var(--am-text-dim)' }}>
          {timelineView === 'tracks' ? (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--movent-bright)' }} /> In
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--movent-teal)' }} /> Loop
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: '#bf263c' }} /> Out
              </span>
            </>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--movent-bright)' }}>
              ◆ Fotogramas Clave Arrastrables
            </span>
          )}
        </div>
      </div>

      {/* STORYBOARD / DIAPOSITIVAS STRIP */}
      <div className="am-slides-strip">
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--movent-bright)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Film size={12} /> Diapositivas:
        </span>
        {slides.map((s, idx) => {
          const isCurrent = currentTime >= s.startTime && currentTime < (s.startTime + s.duration);
          return (
            <React.Fragment key={s.id}>
              {idx > 0 && (
                <div className="am-slide-transition-badge">
                  <Zap size={10} /> {slides[idx - 1].transition === 'neonFlash' ? '⚡ Neón Flash' : '🌊 Transición'}
                </div>
              )}
              <button
                className={'am-slide-pill ' + (isCurrent ? 'active' : '')}
                onClick={() => onSeek(s.startTime)}
                title={'Saltar a ' + s.title}
              >
                <span>{idx + 1}. {s.title}</span>
                <span className="am-slide-time-badge">{s.startTime.toFixed(1)}s - {(s.startTime + s.duration).toFixed(1)}s</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* TRACKS & RULER BODY */}
      <div className="am-timeline-body">
        {/* Left Track Headers */}
        <div className="am-timeline-left-headers">
          <div style={{ height: 26, borderBottom: '1px solid var(--am-border)', background: '#1c1d25', padding: '0 8px', display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--am-text-dim)' }}>
            TRACKS ({project.layers.length})
          </div>
          <div>
            {project.layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <div
                  key={layer.id}
                  className="am-track-row"
                  style={{
                    padding: '0 8px',
                    background: isSelected ? '#1f3527' : 'transparent',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => onSelectLayer(layer.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <div
                      className={`am-check-box ${layer.visible ? 'checked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateLayer({ ...layer, visible: !layer.visible });
                      }}
                    >
                      {layer.visible && <Check size={9} strokeWidth={3} />}
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? 'var(--movent-bright)' : 'var(--am-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {layer.name}
                    </span>
                  </div>

                  <div
                    style={{ cursor: 'pointer', opacity: layer.locked ? 1 : 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateLayer({ ...layer, locked: !layer.locked });
                    }}
                  >
                    {layer.locked ? <Lock size={10} color="var(--movent-bright)" /> : <Unlock size={10} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Scrollable Timeline with Playhead */}
        <div className="am-timeline-tracks-scroll" ref={tracksContainerRef}>
          {/* Frame Time Ruler */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 26, pointerEvents: 'none', zIndex: 3 }}>
            {slides.map((s, idx) => (
              <div
                key={'ruler-' + s.id}
                style={{
                  position: 'absolute',
                  left: s.startTime * pxPerSec,
                  top: 2,
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--movent-bright)',
                  background: 'rgba(35, 200, 60, 0.1)',
                  padding: '1px 6px',
                  borderRadius: 2,
                  borderLeft: idx > 0 ? '1px dashed var(--movent-bright)' : 'none',
                }}
              >
                {idx + 1}. {s.title.split(':')[0]}
              </div>
            ))}
          </div>
          <div className="am-timeline-ruler" onMouseDown={handleRulerMouseDown}>
            {frameTicks.map((frame) => {
              const sec = frame / fps;
              return (
                <div
                  key={frame}
                  className="am-ruler-tick"
                  style={{ left: sec * pxPerSec }}
                >
                  <span>{frame === 0 ? '1' : frame}</span>
                </div>
              );
            })}
          </div>

          {/* Red Playhead Line & Needle */}
          <div className="am-playhead-line" style={{ left: playheadX }}>
            <div className="am-playhead-needle" onMouseDown={handleRulerMouseDown} />
          </div>

          {/* Layer Tracks / Keyframes */}
          <div style={{ position: 'relative' }}>
            {project.layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;

              const inStart = layer.inAnimation.start;
              const inEnd = layer.inAnimation.start + layer.inAnimation.duration;
              const outStart = layer.outAnimation.start;
              const outEnd = layer.outAnimation.start + layer.outAnimation.duration;

              const inLeft = inStart * pxPerSec;
              const inWidth = Math.max(16, layer.inAnimation.duration * pxPerSec);
              const outLeft = outStart * pxPerSec;
              const outWidth = Math.max(16, layer.outAnimation.duration * pxPerSec);
              const loopLeft = inEnd * pxPerSec;
              const loopWidth = Math.max(0, outLeft - loopLeft);

              return (
                <div
                  key={layer.id}
                  className="am-track-row"
                  style={{
                    background: isSelected ? 'rgba(35, 200, 60, 0.05)' : 'transparent',
                    width: duration * pxPerSec + 100,
                  }}
                  onClick={() => onSelectLayer(layer.id)}
                >
                  {timelineView === 'tracks' ? (
                    /* 1. TRACKS BLOCK VIEW */
                    <>
                      {/* IN CLIP */}
                      {layer.inAnimation.type !== 'none' && (
                        <div
                          className="am-track-clip am-clip-in"
                          style={{ left: inLeft, width: inWidth }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onSelectLayer(layer.id);
                            setDraggingClip({
                              layerId: layer.id,
                              clipType: 'in',
                              startX: e.clientX,
                              initialStart: inStart,
                              initialDuration: layer.inAnimation.duration,
                              isResizing: false,
                            });
                          }}
                        >
                          <span>▶ {layer.inAnimation.type}</span>
                        </div>
                      )}

                      {/* LOOP BAR */}
                      {layer.loopAnimation.type !== 'none' && loopWidth > 5 && (
                        <div
                          className="am-track-clip am-clip-loop"
                          style={{ left: loopLeft, width: loopWidth }}
                        >
                          <span>⚡ {layer.loopAnimation.type}</span>
                        </div>
                      )}

                      {/* OUT CLIP */}
                      {layer.outAnimation.type !== 'none' && (
                        <div
                          className="am-track-clip am-clip-out"
                          style={{ left: outLeft, width: outWidth }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            onSelectLayer(layer.id);
                            setDraggingClip({
                              layerId: layer.id,
                              clipType: 'out',
                              startX: e.clientX,
                              initialStart: outStart,
                              initialDuration: layer.outAnimation.duration,
                              isResizing: false,
                            });
                          }}
                        >
                          <span>◼ {layer.outAnimation.type}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    /* 2. FUNCTIONAL KEYFRAMES GRAPH VIEW */
                    <>
                      {/* Connecting Line */}
                      <div
                        className="am-keyframe-line"
                        style={{
                          left: inStart * pxPerSec,
                          width: (outEnd - inStart) * pxPerSec,
                        }}
                      />

                      {/* Keyframe 1: In Start (0% State) */}
                      <div
                        className="am-keyframe-node"
                        style={{ left: inStart * pxPerSec, top: 14 }}
                        title={`Entrada Inicio: ${inStart.toFixed(2)}s`}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSelectLayer(layer.id);
                          setDraggingKeyframe({
                            layerId: layer.id,
                            keyType: 'inStart',
                            startX: e.clientX,
                            initialTime: inStart,
                          });
                        }}
                      />

                      {/* Keyframe 2: In End (100% Active) */}
                      <div
                        className="am-keyframe-node"
                        style={{ left: inEnd * pxPerSec, top: 14 }}
                        title={`Entrada Completa: ${inEnd.toFixed(2)}s`}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSelectLayer(layer.id);
                          setDraggingKeyframe({
                            layerId: layer.id,
                            keyType: 'inEnd',
                            startX: e.clientX,
                            initialTime: inEnd,
                          });
                        }}
                      />

                      {/* Keyframe 3: Exit Start */}
                      <div
                        className="am-keyframe-node"
                        style={{ left: outStart * pxPerSec, top: 14 }}
                        title={`Salida Inicio: ${outStart.toFixed(2)}s`}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSelectLayer(layer.id);
                          setDraggingKeyframe({
                            layerId: layer.id,
                            keyType: 'outStart',
                            startX: e.clientX,
                            initialTime: outStart,
                          });
                        }}
                      />

                      {/* Keyframe 4: Exit End (0% Disappeared) */}
                      <div
                        className="am-keyframe-node"
                        style={{ left: outEnd * pxPerSec, top: 14 }}
                        title={`Salida Fin: ${outEnd.toFixed(2)}s`}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSelectLayer(layer.id);
                          setDraggingKeyframe({
                            layerId: layer.id,
                            keyType: 'outEnd',
                            startX: e.clientX,
                            initialTime: outEnd,
                          });
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER ZOOM SLIDER */}
      <div className="am-timeline-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Zoom:</span>
          <span>Small</span>
          <input
            type="range"
            min="90"
            max="300"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
            style={{ width: 100, accentColor: 'var(--movent-bright)', cursor: 'pointer' }}
          />
          <span>Large</span>
        </div>

        <div>
          <span>{project.settings.duration}s total duration • {Math.round(project.settings.duration * fps)} frames</span>
        </div>
      </div>
    </div>
  );
};
