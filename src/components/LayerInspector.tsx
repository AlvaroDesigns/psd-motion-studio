import React, { useState } from 'react';
import type {
  SceneLayer,
  InAnimationType,
  LoopAnimationType,
  OutAnimationType,
  EffectType,
  LayerEffectConfig,
} from '../types/scene';
import {
  Sparkles,
  Film,
  PlayCircle,
  StopCircle,
  RefreshCw,
  Layers,
  Sliders,
  Filter,
  Activity,
} from 'lucide-react';

interface LayerInspectorProps {
  layer: SceneLayer | null;
  onUpdateLayer: (layer: SceneLayer) => void;
  totalDuration: number;
}

export const LayerInspector: React.FC<LayerInspectorProps> = ({
  layer,
  onUpdateLayer,
  totalDuration,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'behaviors' | 'filters'>('behaviors');

  if (!layer) {
    return (
      <div
        className="am-inspector"
        style={{ alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: 'var(--am-text-dim)' }}
      >
        <Layers size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
        <p style={{ fontSize: 12 }}>Selecciona una capa para inspeccionar y configurar sus propiedades.</p>
      </div>
    );
  }

  const toggleEffect = (type: EffectType) => {
    const existing = layer.effects.find((e) => e.type === type);
    let newEffects: LayerEffectConfig[];
    if (existing) {
      newEffects = layer.effects.map((e) => (e.type === type ? { ...e, enabled: !e.enabled } : e));
    } else {
      const newEff: LayerEffectConfig = {
        id: `eff_${type}_${Date.now()}`,
        type,
        enabled: true,
        start: 0,
        duration: totalDuration,
        intensity: 1.0,
        color: type === 'glowNeon' ? '#23C83C' : undefined,
      };
      newEffects = [...layer.effects, newEff];
    }
    onUpdateLayer({ ...layer, effects: newEffects });
  };

  const updateEffectParam = (type: EffectType, updates: Partial<LayerEffectConfig>) => {
    const newEffects = layer.effects.map((e) => (e.type === type ? { ...e, ...updates } : e));
    onUpdateLayer({ ...layer, effects: newEffects });
  };

  const hasEffect = (type: EffectType) => {
    const eff = layer.effects.find((e) => e.type === type);
    return eff && eff.enabled;
  };

  return (
    <div className="am-inspector">
      {/* HEADER: Layer Name & Role Badge (No Collisions) */}
      <div className="am-inspector-header">
        <span>PROPIEDADES DE CAPA</span>
        <span className="am-role-badge">{layer.role}</span>
      </div>

      {/* INSPECTOR SUB-TABS: [ Properties | Behaviors | Filters ] (Exact Apple Motion style) */}
      <div className="am-inspector-tabs">
        <button
          className={`am-insp-tab ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          <Sliders size={11} /> Properties
        </button>
        <button
          className={`am-insp-tab ${activeTab === 'behaviors' ? 'active' : ''}`}
          onClick={() => setActiveTab('behaviors')}
        >
          <Activity size={11} /> Behaviors
        </button>
        <button
          className={`am-insp-tab ${activeTab === 'filters' ? 'active' : ''}`}
          onClick={() => setActiveTab('filters')}
        >
          <Filter size={11} /> Filters
        </button>
      </div>

      {/* TAB 1: PROPERTIES (Transform, Name, Opacity, Blend) */}
      {activeTab === 'properties' && (
        <div className="am-section-card">
          <div className="am-field-group">
            <div className="am-field-label-row">
              <span>Nombre de Capa</span>
            </div>
            <input
              type="text"
              className="am-input"
              value={layer.name}
              onChange={(e) => onUpdateLayer({ ...layer, name: e.target.value })}
            />
          </div>

          <div className="am-field-group">
            <div className="am-field-label-row">
              <span>Opacidad</span>
              <span className="am-field-value-badge">{Math.round(layer.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              className="am-slider"
              value={layer.opacity}
              onChange={(e) => onUpdateLayer({ ...layer, opacity: parseFloat(e.target.value) })}
            />
          </div>

          <div className="am-field-group">
            <div className="am-field-label-row">
              <span>Modo de Fusión</span>
            </div>
            <select
              className="am-select"
              value={layer.blendMode}
              onChange={(e) => onUpdateLayer({ ...layer, blendMode: e.target.value as GlobalCompositeOperation })}
            >
              <option value="source-over">Normal</option>
              <option value="screen">Screen (Trama)</option>
              <option value="overlay">Overlay (Superponer)</option>
              <option value="lighter">Lighter (Añadir)</option>
              <option value="multiply">Multiply (Multiplicar)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
            <div className="am-field-group">
              <span style={{ fontSize: 10, color: 'var(--am-text-faint)' }}>Posición X</span>
              <div className="am-field-value-badge" style={{ padding: '5px 8px', textAlign: 'center' }}>
                {layer.x} px
              </div>
            </div>
            <div className="am-field-group">
              <span style={{ fontSize: 10, color: 'var(--am-text-faint)' }}>Posición Y</span>
              <div className="am-field-value-badge" style={{ padding: '5px 8px', textAlign: 'center' }}>
                {layer.y} px
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEHAVIORS (In Animation, Continuous Loop, Out Animation) */}
      {activeTab === 'behaviors' && (
        <>
          {/* ASIGNACIÓN A DIAPOSITIVA (STORYBOARD SLIDE) */}
          <div className="am-section-card" style={{ border: '1px solid #1a3a28', background: '#0b1611', marginBottom: 12 }}>
            <div className="am-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--movent-bright)' }}>
                <Film size={13} /> ASIGNACIÓN A DIAPOSITIVA
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
              <button
                type="button"
                className={'am-tool-btn ' + (layer.inAnimation.start < 1.0 && layer.outAnimation.start < 3.0 && layer.outAnimation.type !== 'none' ? 'active' : '')}
                style={{
                  padding: '6px 8px',
                  fontSize: 10,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: (layer.inAnimation.start < 1.0 && layer.outAnimation.start < 3.0 && layer.outAnimation.type !== 'none') ? '#184729' : '#141d17',
                  border: (layer.inAnimation.start < 1.0 && layer.outAnimation.start < 3.0 && layer.outAnimation.type !== 'none') ? '1px solid var(--movent-bright)' : '1px solid #24352a',
                  color: '#fff',
                }}
                onClick={() => {
                  onUpdateLayer({
                    ...layer,
                    inAnimation: { ...layer.inAnimation, start: 0.1, duration: 0.8 },
                    outAnimation: { ...layer.outAnimation, start: 2.1, duration: 0.4 },
                  });
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--movent-bright)' }}>1. Intro Logo</span>
                <span style={{ fontSize: 9, opacity: 0.7 }}>0.1s — 2.5s</span>
              </button>

              <button
                type="button"
                className={'am-tool-btn ' + (layer.inAnimation.start >= 2.0 ? 'active' : '')}
                style={{
                  padding: '6px 8px',
                  fontSize: 10,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: (layer.inAnimation.start >= 2.0) ? '#184729' : '#141d17',
                  border: (layer.inAnimation.start >= 2.0) ? '1px solid var(--movent-bright)' : '1px solid #24352a',
                  color: '#fff',
                }}
                onClick={() => {
                  onUpdateLayer({
                    ...layer,
                    inAnimation: { ...layer.inAnimation, start: 2.5, duration: 0.85 },
                    outAnimation: { ...layer.outAnimation, start: Math.max(2.6, totalDuration - 0.8), duration: 0.8 },
                  });
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--movent-bright)' }}>2. Flyer Principal</span>
                <span style={{ fontSize: 9, opacity: 0.7 }}>2.5s — {totalDuration.toFixed(1)}s</span>
              </button>
            </div>

            <button
              type="button"
              className={'am-tool-btn ' + (layer.inAnimation.start < 1.0 && (layer.outAnimation.start >= 4.0 || layer.outAnimation.type === 'none') ? 'active' : '')}
              style={{
                width: '100%',
                padding: '4px 8px',
                fontSize: 10,
                background: (layer.inAnimation.start < 1.0 && (layer.outAnimation.start >= 4.0 || layer.outAnimation.type === 'none')) ? '#184729' : '#141d17',
                border: (layer.inAnimation.start < 1.0 && (layer.outAnimation.start >= 4.0 || layer.outAnimation.type === 'none')) ? '1px solid var(--movent-bright)' : '1px solid #24352a',
                color: (layer.inAnimation.start < 1.0 && (layer.outAnimation.start >= 4.0 || layer.outAnimation.type === 'none')) ? '#fff' : '#aaa',
              }}
              onClick={() => {
                onUpdateLayer({
                  ...layer,
                  inAnimation: { ...layer.inAnimation, start: 0, duration: 0.8 },
                  outAnimation: { ...layer.outAnimation, start: Math.max(0.9, totalDuration - 0.8), duration: 0.8 },
                });
              }}
            >
              Fondo Continuo (Visible en ambas diapositivas)
            </button>
          </div>
          {/* 1. ENTRADA (IN ANIMATION) */}
          <div className="am-section-card">
            <div className="am-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--movent-bright)' }}>
                <PlayCircle size={13} /> ANIMACIÓN DE ENTRADA
              </span>
            </div>

            <div className="am-field-group">
              <div className="am-field-label-row">
                <span>Efecto</span>
              </div>
              <select
                className="am-select"
                value={layer.inAnimation.type}
                onChange={(e) =>
                  onUpdateLayer({
                    ...layer,
                    inAnimation: { ...layer.inAnimation, type: e.target.value as InAnimationType },
                  })
                }
              >
                <option value="none">Ninguno</option>
                <option value="smoothSlideUp">✨ Smooth Slide Up (Suave)</option>
                <option value="smoothSlideDown">✨ Smooth Slide Down (Suave)</option>
                <option value="softScale">✨ Soft Scale (Escala sutil)</option>
                <option value="smoothDrift">✨ Smooth Drift (Deriva)</option>
                <option value="fadeIn">Fade In (Aparición)</option>
                <option value="slideDownFade">Slide Down + Fade</option>
                <option value="slideUpFade">Slide Up + Fade</option>
                <option value="slideLeft">Slide Left</option>
                <option value="slideRight">Slide Right</option>
                <option value="scaleFade">Scale + Fade</option>
                <option value="neonReveal">Neon Reveal</option>
                <option value="pop">Pop (Bounce)</option>
                <option value="glitchIn">Glitch In</option>
                <option value="zoomBurst">Zoom Burst</option>
                <option value="bassDropIn">⚡ Bass Drop In (Caída sísmica)</option>
                <option value="strobeIn">⚡ Strobe In (Ráfaga estroboscópica)</option>
                <option value="whipPan">⚡ Whip Pan (Latigazo rápido)</option>
              </select>
            </div>

            {layer.inAnimation.type !== 'none' && (
              <>
                <div className="am-field-group">
                  <div className="am-field-label-row">
                    <span>Inicio</span>
                    <span className="am-field-value-badge">{layer.inAnimation.start.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, totalDuration - 0.5)}
                    step="0.05"
                    className="am-slider"
                    value={layer.inAnimation.start}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...layer,
                        inAnimation: { ...layer.inAnimation, start: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>

                <div className="am-field-group">
                  <div className="am-field-label-row">
                    <span>Duración</span>
                    <span className="am-field-value-badge">{layer.inAnimation.duration.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    className="am-slider"
                    value={layer.inAnimation.duration}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...layer,
                        inAnimation: { ...layer.inAnimation, duration: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>

                <div className="am-field-group">
                  <div className="am-field-label-row">
                    <span>Curva (Easing)</span>
                  </div>
                  <select
                    className="am-select"
                    value={layer.inAnimation.easing}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...layer,
                        inAnimation: { ...layer.inAnimation, easing: e.target.value as any },
                      })
                    }
                  >
                    <option value="easeOutExpo">⚡ Ease Out Expo (Apple / Ultra Suave)</option>
                    <option value="easeInOutSine">🌊 Ease In-Out Sine (Sedoso / Orgánico)</option>
                    <option value="easeOutSine">🍃 Ease Out Sine (Desaceleración pura)</option>
                    <option value="easeInOutCubic">✨ Ease In-Out Cubic (Elegante)</option>
                    <option value="easeOutCubic">Ease Out Cubic (Fluido)</option>
                    <option value="easeOutBack">Ease Out Back (Snappy / Pop)</option>
                    <option value="easeOutQuad">Ease Out Quad (Suave)</option>
                    <option value="elasticOut">Elastic Out (Rebote elástico)</option>
                    <option value="linear">Lineal</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* 2. CONTINUO (LOOP) */}
          <div className="am-section-card">
            <div className="am-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffb703' }}>
                <RefreshCw size={13} /> MOVIMIENTO CONTINUO (LOOP)
              </span>
            </div>

            <div className="am-field-group">
              <div className="am-field-label-row">
                <span>Tipo de Loop</span>
              </div>
              <select
                className="am-select"
                value={layer.loopAnimation.type}
                onChange={(e) =>
                  onUpdateLayer({
                    ...layer,
                    loopAnimation: { ...layer.loopAnimation, type: e.target.value as LoopAnimationType },
                  })
                }
              >
                <option value="none">Ninguno (Estático)</option>
                <option value="softFloat">🌊 Soft Float (Flotación ultra suave)</option>
                <option value="breathing">🫁 Breathing (Respiración sutil)</option>
                <option value="gentleDrift">🍃 Gentle Drift (Deriva pausada)</option>
                <option value="pendulumSwing">⚖️ Pendulum Swing (Balanceo sutil)</option>
                <option value="slowZoom">Slow Zoom (Zoom lento)</option>
                <option value="slowRotate">Slow Rotate (Giro sutil)</option>
                <option value="floatParallax">Float Parallax (Flotación dinámica)</option>
                <option value="loopPulse">Loop Pulse (Latido rítmico)</option>
                <option value="neonFlicker">Neon Flicker (Parpadeo)</option>
                <option value="bassDropBeat">🔊 Bass Drop Kick (Bombo 140 BPM)</option>
                <option value="strobeFlicker">⚡ Strobe Club (Flash estroboscópico)</option>
                <option value="earthquakeShake">🌋 Earthquake Shake (Subwoofer)</option>
              </select>
            </div>

            {layer.loopAnimation.type !== 'none' && (
              <div className="am-field-group">
                <div className="am-field-label-row">
                  <span>Intensidad</span>
                  <span className="am-field-value-badge">{(layer.loopAnimation.intensity || 1.0).toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  className="am-slider"
                  value={layer.loopAnimation.intensity || 1.0}
                  onChange={(e) =>
                    onUpdateLayer({
                      ...layer,
                      loopAnimation: { ...layer.loopAnimation, intensity: parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* 3. SALIDA (OUT ANIMATION) */}
          <div className="am-section-card">
            <div className="am-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f43f5e' }}>
                <StopCircle size={13} /> ANIMACIÓN DE SALIDA
              </span>
            </div>

            <div className="am-field-group">
              <div className="am-field-label-row">
                <span>Efecto</span>
              </div>
              <select
                className="am-select"
                value={layer.outAnimation.type}
                onChange={(e) =>
                  onUpdateLayer({
                    ...layer,
                    outAnimation: { ...layer.outAnimation, type: e.target.value as OutAnimationType },
                  })
                }
              >
                <option value="none">Ninguno</option>
                <option value="smoothFadeOut">✨ Smooth Fade Out (Disolución suave)</option>
                <option value="smoothScaleDown">✨ Smooth Scale Down (Encogimiento sutil)</option>
                <option value="smoothSlideOutUp">✨ Smooth Slide Out Up (Elevación suave)</option>
                <option value="fadeOut">Fade Out (Desvanecer)</option>
                <option value="slideOut">Slide Out (Deslizar)</option>
                <option value="scaleOut">Scale Out (Colapso)</option>
                <option value="zoomOut">Zoom Out (Escape)</option>
                <option value="blurOut">Blur Out (Desenfoque)</option>
                <option value="glitchOut">Glitch Out (Interferencia)</option>
                <option value="neonOut">Neon Out (Destello y apagado)</option>
              </select>
            </div>

            {layer.outAnimation.type !== 'none' && (
              <>
                <div className="am-field-group">
                  <div className="am-field-label-row">
                    <span>Inicio Salida</span>
                    <span className="am-field-value-badge">{layer.outAnimation.start.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max={totalDuration}
                    step="0.05"
                    className="am-slider"
                    value={layer.outAnimation.start}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...layer,
                        outAnimation: { ...layer.outAnimation, start: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>

                <div className="am-field-group">
                  <div className="am-field-label-row">
                    <span>Duración</span>
                    <span className="am-field-value-badge">{layer.outAnimation.duration.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.05"
                    className="am-slider"
                    value={layer.outAnimation.duration}
                    onChange={(e) =>
                      onUpdateLayer({
                        ...layer,
                        outAnimation: { ...layer.outAnimation, duration: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* TAB 3: FILTERS & SPECIAL EFFECTS */}
      {activeTab === 'filters' && (
        <div className="am-section-card">
          <div className="am-section-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--movent-bright)' }}>
              <Sparkles size={13} /> EFECTOS ESPECIALES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Glow / Neon */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className={`am-effect-row ${hasEffect('glowNeon') ? 'active' : ''}`}>
                <span style={{ fontWeight: 600 }}>Glow / Neon (Brillo)</span>
                <label className="am-switch">
                  <input
                    type="checkbox"
                    checked={!!hasEffect('glowNeon')}
                    onChange={() => toggleEffect('glowNeon')}
                  />
                  <span className="am-switch-slider" />
                </label>
              </div>

              {hasEffect('glowNeon') && (
                <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="am-field-label-row">
                    <span style={{ fontSize: 10 }}>Color de Neón</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { name: 'Verde Movent', hex: '#23C83C' },
                      { name: 'Cian Eléctrico', hex: '#00f0ff' },
                      { name: 'Rosa Neón', hex: '#f72585' },
                      { name: 'Oro Brillante', hex: '#ffd166' },
                      { name: 'Blanco Flash', hex: '#ffffff' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateEffectParam('glowNeon', { color: c.hex })}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          background: c.hex,
                          border: (layer.effects.find((e) => e.type === 'glowNeon')?.color || '#23C83C') === c.hex ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          boxShadow: '0 0 8px ' + c.hex + '88',
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  <div className="am-field-label-row" style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 10 }}>Intensidad Brillo Neón</span>
                    <span className="am-field-value-badge">
                      {(layer.effects.find((e) => e.type === 'glowNeon')?.intensity || 1.0).toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    className="am-slider"
                    value={layer.effects.find((e) => e.type === 'glowNeon')?.intensity || 1.0}
                    onChange={(e) => updateEffectParam('glowNeon', { intensity: parseFloat(e.target.value) })}
                  />
                </div>
              )}
            </div>

            {/* Light Sweep */}
            <div className={`am-effect-row ${hasEffect('lightSweep') ? 'active' : ''}`}>
              <span style={{ fontWeight: 600 }}>Light Sweep (Haz de luz)</span>
              <label className="am-switch">
                <input
                  type="checkbox"
                  checked={!!hasEffect('lightSweep')}
                  onChange={() => toggleEffect('lightSweep')}
                />
                <span className="am-switch-slider" />
              </label>
            </div>

            {/* Flash */}
            <div className={`am-effect-row ${hasEffect('flash') ? 'active' : ''}`}>
              <span style={{ fontWeight: 600 }}>Flash (Destello estroboscópico)</span>
              <label className="am-switch">
                <input
                  type="checkbox"
                  checked={!!hasEffect('flash')}
                  onChange={() => toggleEffect('flash')}
                />
                <span className="am-switch-slider" />
              </label>
            </div>

            {/* RGB Split */}
            <div className={`am-effect-row ${hasEffect('rgbSplit') ? 'active' : ''}`}>
              <span style={{ fontWeight: 600 }}>RGB Split / Aberración cromática</span>
              <label className="am-switch">
                <input
                  type="checkbox"
                  checked={!!hasEffect('rgbSplit')}
                  onChange={() => toggleEffect('rgbSplit')}
                />
                <span className="am-switch-slider" />
              </label>
            </div>

            {/* Glitch */}
            <div className={`am-effect-row ${hasEffect('glitch') ? 'active' : ''}`}>
              <span style={{ fontWeight: 600 }}>Glitch (Scanlines & Slices)</span>
              <label className="am-switch">
                <input
                  type="checkbox"
                  checked={!!hasEffect('glitch')}
                  onChange={() => toggleEffect('glitch')}
                />
                <span className="am-switch-slider" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
