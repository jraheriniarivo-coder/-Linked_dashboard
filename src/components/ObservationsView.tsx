import React, { useState } from 'react';
import { Check, Edit3, Search } from 'lucide-react';
import { LearnerAnalysis, Observation } from '../types/dashboard';

interface Props {
  analyses: LearnerAnalysis[];
  focusedEmail: string | null;
  onUpdateObservation: (email: string, field: keyof Observation, value: string) => void;
}

const FIELDS: Array<{ key: keyof Observation; label: string; placeholder: string }> = [
  {
    key: 'participation',
    label: 'Participation en formation',
    placeholder: 'Ex. Très participatif, pose des questions pertinentes…',
  },
  {
    key: 'forces',
    label: 'Points forts observés',
    placeholder: 'Ex. Excellente écoute active, bonne maîtrise du ton…',
  },
  {
    key: 'axes',
    label: 'Axes à travailler',
    placeholder: 'Ex. Doit travailler la fermeté sans agressivité, techniques de désamorçage…',
  },
  {
    key: 'engagement',
    label: 'Engagement final (à chaud)',
    placeholder: "Ex. S'engage à appliquer les 7 temps dès demain…",
  },
  {
    key: 'global',
    label: 'Observation générale / synthèse formateur',
    placeholder: 'Synthèse formateur à intégrer dans le rapport client…',
  },
];

export const ObservationsView: React.FC<Props> = ({
  analyses,
  focusedEmail,
  onUpdateObservation,
}) => {
  const [query, setQuery] = useState('');

  if (analyses.length === 0) {
    return (
      <div className="bg-white border border-dashed border-[#cddadd] rounded-2xl py-14 px-6 text-center">
        <Edit3 className="w-10 h-10 text-[#9db4b9] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#096475]">Aucune fiche d’observation</h3>
        <p className="text-sm text-[#6d7d83] mt-1">
          Importez des apprenants ou changez de filtre de vague pour saisir vos observations.
        </p>
      </div>
    );
  }

  const visible = analyses.filter((a) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (a.learner.name || '').toLowerCase().includes(q) ||
      (a.learner.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <section className="bg-white border border-[#e1e9eb] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#096475]">Notes d’observation formateur</h2>
          <p className="text-sm text-[#6d7d83] mt-1">
            Vos observations sont enregistrées automatiquement et enrichissent directement les bilans individuels du rapport client.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6d7d83] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrer par apprenant…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#d6e1e3] focus:outline-none focus:border-[#00afa9]"
          />
        </div>
      </section>

      <div className="space-y-5">
        {visible.map((a) => {
          const emailKey = a.learner.email || a.emailKey;
          const isFocused = focusedEmail === a.emailKey;
          const completedFields = FIELDS.filter((f) => Boolean(a.observation[f.key]?.trim())).length;

          return (
            <article
              key={a.emailKey}
              className={`bg-white rounded-2xl p-6 border transition-colors ${
                isFocused ? 'border-[#00afa9]' : 'border-[#e1e9eb]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-5 border-b border-[#edf2f3]">
                <div>
                  <h3 className="text-lg font-black text-[#096475]">{a.learner.name || '—'}</h3>
                  <div className="text-xs text-[#6d7d83] mt-0.5">
                    {a.learner.email || ''} · {a.learner.wave || 'Sans vague'} ·{' '}
                    {a.learner.seniority || 'Ancienneté N/C'}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <span className="text-[#47585e]">
                    Pré-quiz : <strong>{a.hasPre ? `${a.prePct}%` : '—'}</strong>
                  </span>
                  <span className="text-[#096475]">
                    Final : <strong>{a.hasPost ? `${a.postPct}%` : '—'}</strong>
                  </span>
                  {a.hasSim && (
                    <span className="text-[#b45309]">
                      Simulation : <strong>{a.simPct}%</strong>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[#008c87] font-sans font-bold">
                    <Check className="w-3.5 h-3.5" />
                    {completedFields}/{FIELDS.length} champs
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className={field.key === 'global' ? 'md:col-span-2' : ''}
                  >
                    <label className="block text-xs font-bold text-[#47585e] mb-1.5">
                      {field.label}
                    </label>
                    <textarea
                      value={a.observation[field.key] || ''}
                      onChange={(e) => onUpdateObservation(emailKey, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full min-h-[78px] p-3 rounded-xl border border-[#d6e1e3] text-sm text-[#1d2b30] bg-[#fafcfd] focus:outline-none focus:border-[#00afa9] focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
