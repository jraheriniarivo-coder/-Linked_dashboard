import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Learner } from '../types/dashboard';

interface Props {
  learnersCount: number;
  onImport: (items: Learner[]) => { added: number; updated: number };
  onLoadDemo: () => void;
  onClearAll: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onGoToReport: () => void;
}

const SAMPLE_PLACEHOLDER = `[
  {
    "name": "Rakoto Andrianina",
    "email": "rakoto@connecteo.mg",
    "wave": "Première vague",
    "seniority": "1 à 3 ans",
    "deja_formation_rc": "Oui",
    "niveau_recouvrement_pct": 55,
    "langues": "Français, Malgache",
    "pre_score_pct": 62,
    "pre_score_j1": "5/9",
    "pre_score_j2": "6/9",
    "pre_score_j3": "5/9",
    "pre_score_j4": "6/9",
    "pre_axes": "Élargir la vision au-delà de la réclamation | Approfondir la distinction satisfaction/fidélité",
    "score_pct": 84,
    "score_j1": "13/15",
    "score_j2": "13/15",
    "score_j3": "12/15",
    "score_j4": "12/15",
    "verdict": "Maîtrise",
    "axes_amelioration": "Développer la conscience du ton | Éviter le réflexe d'accusation",
    "sim_score_pct": 81,
    "sim_verdict": "Opérationnel avec aisance"
  }
]`;

export const ImportView: React.FC<Props> = ({
  learnersCount,
  onImport,
  onLoadDemo,
  onClearAll,
  onExportJSON,
  onExportCSV,
  onGoToReport,
}) => {
  const [rawJson, setRawJson] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleImport = () => {
    const trimmed = rawJson.trim();
    if (!trimmed) {
      setFeedback({
        type: 'error',
        message: 'Veuillez coller un tableau ou objet JSON avant de lancer l’import.',
      });
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const list: Learner[] = Array.isArray(parsed) ? parsed : [parsed];
      const { added, updated } = onImport(list);
      setFeedback({
        type: 'success',
        message: `${list.length} enregistrement(s) traité(s) : ${added} ajouté(s), ${updated} fusionné(s) par email.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `JSON invalide : ${(err as Error).message}`,
      });
    }
  };

  const handleLoadDemo = () => {
    onLoadDemo();
    setFeedback({
      type: 'success',
      message:
        'Jeu de démonstration Connecteo chargé (6 apprenants sur 2 vagues, avec scores J1–J4, simulations et observations).',
    });
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-[#e1e9eb] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-black text-[#096475]">
              Importer ou fusionner des données
            </h2>
            <p className="text-sm text-[#6d7d83] mt-1 max-w-2xl">
              Collez un export JSON issu de Web3Forms, Google Sheets ou du quiz Connecteo. Les profils sont automatiquement dédoublonnés et enrichis par adresse email.
            </p>
          </div>

          {learnersCount > 0 && (
            <button
              type="button"
              onClick={onGoToReport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#096475] text-white text-sm font-bold hover:bg-[#064552] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              Ouvrir le rapport narratif
            </button>
          )}
        </div>

        <textarea
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          placeholder={SAMPLE_PLACEHOLDER}
          aria-label="Données JSON à importer"
          className="w-full min-h-[240px] p-4 rounded-xl border border-[#d6e1e3] bg-[#fafcfd] font-mono text-xs text-[#1d2b30] focus:outline-none focus:border-[#00afa9] focus:bg-white transition-colors"
        />

        {feedback && (
          <div
            role="status"
            className={`mt-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2.5 border ${
              feedback.type === 'success'
                ? 'bg-[#f0faf9] border-[#b7e4e1] text-[#096475]'
                : 'bg-[#fff5f5] border-[#f5c2c2] text-[#c62828]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-5 border-t border-[#edf2f3]">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleImport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00afa9] text-white text-sm font-bold hover:bg-[#009690] transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileUp className="w-4 h-4" />
              Importer / Fusionner
            </button>

            <button
              type="button"
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#eef3f4] text-[#1d2b30] text-sm font-bold hover:bg-[#e1eaec] transition-colors cursor-pointer whitespace-nowrap"
            >
              Charger un exemple complet
            </button>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#c62828] bg-[#fff5f5] hover:bg-[#fde8e8] text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                Tout effacer
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-[#fff5f5] border border-[#f5c2c2] rounded-lg px-3 py-1.5">
                <span className="text-xs font-bold text-[#c62828]">Confirmer ?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setRawJson('');
                    setConfirmClear(false);
                    setFeedback({
                      type: 'success',
                      message: 'Toutes les données locales ont été effacées.',
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-[#c62828] text-white text-xs font-bold cursor-pointer"
                >
                  Oui, effacer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-xs font-semibold text-[#47585e] cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onExportJSON}
              disabled={learnersCount === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#d6e1e3] bg-white text-[#096475] text-sm font-bold hover:bg-[#f4f8f9] disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Exporter JSON
            </button>
            <button
              type="button"
              onClick={onExportCSV}
              disabled={learnersCount === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#d6e1e3] bg-white text-[#096475] text-sm font-bold hover:bg-[#f4f8f9] disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exporter CSV
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
