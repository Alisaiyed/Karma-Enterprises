import React from 'react';
import { Scale, Trash2, X } from 'lucide-react';
import { TractionMachine } from '../data/machines';

interface CompareDrawerProps {
  machines: TractionMachine[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRemove: (machineId: string) => void;
  onClearAll: () => void;
  onRequestQuoteAll: (models: string[]) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  machines,
  isOpen,
  onOpen,
  onClose,
  onRemove,
  onClearAll,
  onRequestQuoteAll,
}) => {
  if (machines.length === 0) return null;

  return (
    <>
      {/* Compact Bottom-Right Floating Comparison Trigger (only renders when user selects machines) */}
      {!isOpen && (
        <div
          data-testid="compare-floating-bar"
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 z-40 bg-[#181A1D] text-white border border-white/15 rounded-[2px] shadow-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-3 no-print"
        >
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-[#B5121B] shrink-0" />
            <span className="font-semibold whitespace-nowrap">
              Compare ({machines.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpen}
              className="px-3 py-1.5 text-xs font-semibold bg-[#B5121B] hover:bg-[#8F0D14] text-white rounded-[2px] transition-colors whitespace-nowrap cursor-pointer"
            >
              Open Table
            </button>

            <button
              type="button"
              onClick={onClearAll}
              aria-label="Clear all compared machines"
              className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#181A1D]/80 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <div
            className="bg-white w-full max-w-5xl max-h-[92vh] sm:max-h-[88vh] rounded-[2px] border border-[#C8CDD6] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#F4F5F7] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#D8DCE3] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#5A606B]">Side-by-Side Engineering Evaluation</p>
                <h2 id="compare-modal-title" className="font-display text-xl sm:text-2xl font-bold text-[#1F2124]">
                  Compare Traction Machines ({machines.length}/3)
                </h2>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#5A606B] hover:text-[#B5121B] cursor-pointer whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close comparison table"
                  className="w-9 h-9 inline-flex items-center justify-center rounded-[2px] text-[#3A3F47] hover:bg-[#E2E5EA] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E5EA]">
                    <th className="text-left py-3 pr-4 text-xs font-semibold text-[#5A606B] w-44 align-bottom">
                      Parameter
                    </th>
                    {machines.map((m) => (
                      <th key={m.id} className="text-left px-4 py-3 align-top min-w-[210px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[11px] font-medium text-[#5A606B]">
                              {m.category === 'geared' ? 'Geared · KING' : 'Gearless · PRINCE'}
                            </div>
                            <div className="font-display text-2xl font-bold leading-tight">
                              <span className="text-[#1F2124]">{m.series} </span>
                              <span className="text-[#B5121B]">{m.modelNumber}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(m.id)}
                            aria-label={`Remove ${m.model} from comparison`}
                            className="p-1 text-[#6B7280] hover:text-[#B5121B] cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 h-28 bg-white border border-[#ECEEF2] rounded p-2 flex items-center justify-center">
                          <img
                            src={m.imageUrl}
                            alt={`KAYNOXX ${m.model}`}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEEF2] font-mono text-xs tabular-nums">
                  {[
                    {
                      label: 'Application Class',
                      render: (m: TractionMachine) => m.applicationClass,
                    },
                    {
                      label: 'Duty Load Range',
                      render: (m: TractionMachine) =>
                        m.dutyLoadMinKg === m.dutyLoadMaxKg
                          ? `${m.dutyLoadMaxKg} kg`
                          : `${m.dutyLoadMinKg}–${m.dutyLoadMaxKg} kg`,
                    },
                    {
                      label: 'Max Static Load',
                      render: (m: TractionMachine) => `${m.maxStaticLoadKg.toLocaleString()} kg`,
                    },
                    {
                      label: 'Power Range',
                      render: (m: TractionMachine) => m.powerRangeLabel,
                    },
                    {
                      label: 'Speed Range',
                      render: (m: TractionMachine) =>
                        m.speedMinMs === m.speedMaxMs
                          ? `${m.speedMaxMs.toFixed(2)} m/s`
                          : `${m.speedMinMs.toFixed(2)}–${m.speedMaxMs.toFixed(2)} m/s`,
                    },
                    {
                      label: 'Max Travel Height',
                      render: (m: TractionMachine) => `≤ ${m.maxTravelM} m`,
                    },
                    {
                      label: 'Sheave Diameters',
                      render: (m: TractionMachine) => m.sheaveOptionsMm.map((s) => `Φ${s} mm`).join(', '),
                    },
                    {
                      label: 'Brake Voltage',
                      render: (m: TractionMachine) => m.brakeVoltage,
                    },
                    {
                      label: 'Lubrication',
                      render: (m: TractionMachine) =>
                        m.oilCapacityLtr ? `${m.oilCapacityLtr} Ltr Oil` : 'Oil-Free PMSM',
                    },
                    {
                      label: 'Machine Weight',
                      render: (m: TractionMachine) => `${m.weightKg} kg`,
                    },
                    {
                      label: 'Envelope (L×W×H)',
                      render: (m: TractionMachine) => `${m.dimensionsMm} mm`,
                    },
                  ].map((row, idx) => (
                    <tr key={row.label} className={idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                      <td className="py-3 pr-4 font-sans font-medium text-[#5A606B]">{row.label}</td>
                      {machines.map((m) => (
                        <td key={m.id} className="px-4 py-3 font-semibold text-[#1F2124]">
                          {row.render(m)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F4F5F7] border-t border-[#D8DCE3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs text-[#5A606B]">
                Need sizing assistance across these models? Include all selected units in one quote request.
              </span>
              <button
                type="button"
                onClick={() => {
                  onRequestQuoteAll(machines.map((m) => m.model));
                  onClose();
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors whitespace-nowrap cursor-pointer"
              >
                Request Quote for {machines.length} Model{machines.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
