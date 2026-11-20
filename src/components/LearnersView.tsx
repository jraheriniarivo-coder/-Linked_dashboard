import React, { useMemo, useState } from 'react';
import { CheckCircle2, Search, Users } from 'lucide-react';
import { LearnerAnalysis } from '../types/dashboard';

interface Props {
  analyses: LearnerAnalysis[];
  preAvg: number;
  postAvg: number;
  progression: number;
  onEditObservation: (emailKey: string) => void;
  onGoToImport: () => void;
}

export const LearnersView: React.FC<Props> = ({
  analyses,
  preAvg,
  postAvg,
  progression,
  onEditObservation,
  onGoToImport,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return analyses;
    return analyses.filter(
      (a) =>
        (a.learner.name || '').toLowerCase().includes(q) ||
        (a.learner.email || '').toLowerCase().includes(q) ||
        (a.learner.wave || '').toLowerCase().includes(q) ||
        (a.learner.verdict || '').toLowerCase().includes(q)
    );
  }, [analyses, query]);

  if (analyses.length === 0) {
    return (
      <div className="bg-white border border-dashed border-[#cddadd] rounded-2xl py-14 px-6 text-center">
        <Users className="w-10 h-10 text-[#9db4b9] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#096475]">Aucun apprenant dans ce groupe</h3>
        <p className="text-sm text-[#6d7d83] mt-1 mb-5">
          Importez des résultats ou chargez le jeu de démonstration pour visualiser les scores.
        </p>
        <button
          type="button"
          onClick={onGoToImport}
          className="px-5 py-2.5 rounded-lg bg-[#00afa9] text-white text-sm font-bold hover:bg-[#009690] transition-colors cursor-pointer"
        >
          Aller à l’import
        </button>
      </div>
    );
  }

  const verdictColor = (cat: string) => {
    if (cat === 'expert') return 'text-[#096475]';
    if (cat === 'maitrise') return 'text-[#008c87]';
    if (cat === 'consolidation') return 'text-[#b45309]';
    return 'text-[#c62828]';
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e1e9eb] rounded-2xl p-5">
          <div className="text-xs font-semibold text-[#6d7d83]">Apprenants affichés</div>
          <div className="text-3xl font-black text-[#096475] font-mono tabular-nums mt-1">
            {analyses.length}
          </div>
        </div>
        <div className="bg-white border border-[#e1e9eb] rounded-2xl p-5">
          <div className="text-xs font-semibold text-[#6d7d83]">Score pré-quiz moyen</div>
          <div className="text-3xl font-black text-[#1d2b30] font-mono tabular-nums mt-1">
            {preAvg}%
          </div>
        </div>
        <div className="bg-white border border-[#e1e9eb] rounded-2xl p-5">
          <div className="text-xs font-semibold text-[#6d7d83]">Score final moyen</div>
          <div className="text-3xl font-black text-[#096475] font-mono tabular-nums mt-1">
            {postAvg}%
          </div>
        </div>
        <div className="bg-white border border-[#e1e9eb] rounded-2xl p-5">
          <div className="text-xs font-semibold text-[#6d7d83]">Progression moyenne</div>
          <div
            className={`text-3xl font-black font-mono tabular-nums mt-1 ${
              progression >= 0 ? 'text-[#00afa9]' : 'text-[#c62828]'
            }`}
          >
            {progression >= 0 ? '+' : ''}
            {progression} pts
          </div>
        </div>
      </div>

      {/* Table Panel */}
      <section className="bg-white border border-[#e1e9eb] rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#edf2f3] flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#096475]">Liste des apprenants</h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#6d7d83] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un nom, vague, verdict…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#d6e1e3] focus:outline-none focus:border-[#00afa9]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f4f8f9] text-[#47585e] text-xs font-bold border-b border-[#e1e9eb]">
                <th className="py-3.5 px-4">Apprenant</th>
                <th className="py-3.5 px-4">Vague</th>
                <th className="py-3.5 px-4">Ancienneté</th>
                <th className="py-3.5 px-4 text-right">Pré-quiz</th>
                <th className="py-3.5 px-4 text-right">Final</th>
                <th className="py-3.5 px-4 text-right">Simulation</th>
                <th className="py-3.5 px-4 text-right">Progression</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4">Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f3]">
              {filtered.map((a) => {
                const hasObs = Boolean(
                  a.observation.global ||
                    a.observation.forces ||
                    a.observation.axes ||
                    a.observation.participation
                );
                return (
                  <tr
                    key={a.emailKey}
                    className="hover:bg-[#f7fbfb] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1d2b30]">{a.learner.name || '—'}</div>
                      <div className="text-xs text-[#6d7d83]">{a.learner.email || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#47585e]">{a.learner.wave || '—'}</td>
                    <td className="py-3.5 px-4 text-[#47585e]">{a.learner.seniority || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#47585e]">
                      {a.hasPre ? `${a.prePct}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#096475]">
                      {a.hasPost ? `${a.postPct}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#47585e]">
                      {a.hasSim ? `${a.simPct}%` : '—'}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-mono tabular-nums font-bold ${
                        a.progression >= 15
                          ? 'text-[#096475]'
                          : a.progression >= 0
                          ? 'text-[#008c87]'
                          : 'text-[#c62828]'
                      }`}
                    >
                      {a.hasPre && a.hasPost
                        ? `${a.progression >= 0 ? '+' : ''}${a.progression} pts`
                        : '—'}
                    </td>
                    <td className={`py-3.5 px-4 font-bold text-xs ${verdictColor(a.verdictCategory)}`}>
                      {a.learner.verdict || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onEditObservation(a.emailKey)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008c87] hover:underline cursor-pointer"
                      >
                        {hasObs ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#096475]" />
                            Renseignée
                          </>
                        ) : (
                          <span className="text-[#6d7d83]">Ajouter une note</span>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
