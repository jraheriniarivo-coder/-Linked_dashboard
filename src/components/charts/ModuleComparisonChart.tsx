import React, { useState } from 'react';
import { ModuleMetric } from '../../types/dashboard';

interface Props {
  modules: ModuleMetric[];
}

export const ModuleComparisonChart: React.FC<Props> = ({ modules }) => {
  const [mode, setMode] = useState<'bars' | 'radar'>('bars');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const hasData = modules.some((m) => m.postCount > 0 || m.preCount > 0);
  if (!hasData) {
    return (
      <div className="py-10 text-center text-sm text-[#6d7d83] border border-dashed border-[#d6e1e3] rounded-xl">
        Les scores détaillés par module (J1 à J4) ne sont pas renseignés dans cet import.
      </div>
    );
  }

  const activeModule = modules.find((m) => m.key === hoveredKey) || null;

  // Radar geometry
  const cx = 190;
  const cy = 155;
  const maxR = 105;
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  const radarPoint = (pct: number, idx: number) => {
    const r = (Math.max(0, Math.min(100, pct)) / 100) * maxR;
    return {
      x: cx + r * Math.cos(angles[idx]),
      y: cy + r * Math.sin(angles[idx]),
    };
  };

  const prePolygon = modules
    .map((m, i) => {
      const p = radarPoint(m.prePct, i);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const postPolygon = modules
    .map((m, i) => {
      const p = radarPoint(m.postPct, i);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-base font-bold text-[#096475]">
            Maîtrise comparée par pilier (J1 à J4)
          </h4>
          <p className="text-xs text-[#6d7d83]">
            Comparaison des scores normalisés en % entre l’entrée et la sortie de formation.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-[#eef3f4] rounded-lg border border-[#dce6e8] no-print">
          <button
            type="button"
            onClick={() => setMode('bars')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
              mode === 'bars'
                ? 'bg-white text-[#096475] shadow-xs'
                : 'text-[#52636a] hover:text-[#096475]'
            }`}
          >
            Barres comparatives
          </button>
          <button
            type="button"
            onClick={() => setMode('radar')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
              mode === 'radar'
                ? 'bg-white text-[#096475] shadow-xs'
                : 'text-[#52636a] hover:text-[#096475]'
            }`}
          >
            Radar 4 axes
          </button>
        </div>
      </div>

      {mode === 'bars' ? (
        <div className="space-y-4">
          {modules.map((mod) => {
            const isHovered = hoveredKey === mod.key;
            return (
              <div
                key={mod.key}
                onMouseEnter={() => setHoveredKey(mod.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`rounded-xl p-3 border transition-colors ${
                  isHovered
                    ? 'bg-[#f4f9fa] border-[#00afa9]'
                    : 'bg-[#fafcfd] border-[#e8eff1]'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-[#00afa9] mr-2">{mod.dayLabel}</span>
                    <span className="text-sm font-bold text-[#1d2b30]">{mod.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                    <span className="text-[#6d7d83]">Départ {mod.prePct}%</span>
                    <span className="text-[#096475] font-bold">Final {mod.postPct}%</span>
                    <span
                      className={`font-bold ${
                        mod.delta >= 0 ? 'text-[#00afa9]' : 'text-[#c62828]'
                      }`}
                    >
                      {mod.delta >= 0 ? '+' : ''}
                      {mod.delta} pts
                    </span>
                  </div>
                </div>

                {/* Dual bars */}
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded-full bg-[#e8eff1] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#94a3b8] transition-all duration-300"
                      style={{ width: `${mod.prePct}%` }}
                    />
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#e8eff1] overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#096475] to-[#00afa9] transition-all duration-300"
                      style={{ width: `${mod.postPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 380 310"
            className="w-full max-w-[380px] h-auto select-none"
            role="img"
            aria-label="Radar des compétences sur les 4 modules"
          >
            {/* Concentric rings */}
            {[25, 50, 75, 100].map((lvl) => {
              const r = (lvl / 100) * maxR;
              const pts = angles
                .map((a) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
                .join(' ');
              return (
                <g key={lvl}>
                  <polygon
                    points={pts}
                    fill="none"
                    stroke={lvl === 50 ? '#cbd5e1' : '#e5ecee'}
                    strokeDasharray={lvl === 50 ? '3 3' : undefined}
                    strokeWidth={1}
                  />
                  <text
                    x={cx + 4}
                    y={cy - r + 10}
                    className="fill-[#94a3b8] text-[9px] font-mono"
                  >
                    {lvl}%
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            {angles.map((a, idx) => (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={cx + maxR * Math.cos(a)}
                y2={cy + maxR * Math.sin(a)}
                stroke="#dce5e7"
                strokeWidth={1}
              />
            ))}

            {/* Pre area */}
            <polygon
              points={prePolygon}
              fill="rgba(148, 163, 184, 0.22)"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="4 3"
            />

            {/* Post area */}
            <polygon
              points={postPolygon}
              fill="rgba(0, 175, 169, 0.22)"
              stroke="#096475"
              strokeWidth={2.5}
            />

            {/* Interactive vertices & labels */}
            {modules.map((mod, idx) => {
              const pPost = radarPoint(mod.postPct, idx);
              const labelDist = maxR + 24;
              const lx = cx + labelDist * Math.cos(angles[idx]);
              const ly = cy + labelDist * Math.sin(angles[idx]);
              const anchor =
                idx === 1 ? 'start' : idx === 3 ? 'end' : 'middle';

              return (
                <g
                  key={mod.key}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredKey(mod.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <circle
                    cx={pPost.x}
                    cy={pPost.y}
                    r={hoveredKey === mod.key ? 6.5 : 5}
                    fill="#00afa9"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <text
                    x={lx}
                    y={ly + (idx === 0 ? -4 : idx === 2 ? 8 : 4)}
                    textAnchor={anchor}
                    className="fill-[#096475] text-[11px] font-bold"
                  >
                    {mod.dayLabel} ({mod.postPct}%)
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex items-center gap-6 text-xs text-[#47585e] mt-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#64748b] inline-block" />
              Pré-quiz
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#096475] inline-block" />
              Quiz final
            </span>
          </div>
        </div>
      )}

      {activeModule && (
        <div className="mt-3 rounded-lg bg-[#f4f8f9] border border-[#e1e9eb] px-3.5 py-2.5 text-xs text-[#47585e]">
          <strong className="text-[#096475]">{activeModule.dayLabel} · {activeModule.title} :</strong>{' '}
          {activeModule.description}
        </div>
      )}
    </div>
  );
};
