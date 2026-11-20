import React, { useEffect, useState } from 'react';
import { Check, Download, FileText, Scale, X, ZoomIn, ZoomOut } from 'lucide-react';
import { COMPANY_INFO, TractionMachine } from '../data/machines';
import { formatSpecSheetText } from '../utils/machineEngine';

interface MachineDetailModalProps {
  machine: TractionMachine | null;
  isCompared: boolean;
  compareFull: boolean;
  onClose: () => void;
  onToggleCompare: (machineId: string) => void;
  onRequestQuote: (modelName: string) => void;
}

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({
  machine,
  isCompared,
  compareFull,
  onClose,
  onToggleCompare,
  onRequestQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'cad'>('specs');
  const [cadZoom, setCadZoom] = useState<number>(1);

  useEffect(() => {
    setActiveTab('specs');
    setCadZoom(1);
  }, [machine?.id]);

  useEffect(() => {
    if (!machine) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [machine, onClose]);

  if (!machine) return null;

  const handleDownloadSpecText = () => {
    const content = formatSpecSheetText(machine);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KAYNOXX-${machine.id}-datasheet.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="machine-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#181A1D]/80 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl max-h-[94vh] sm:max-h-[90vh] rounded-[2px] border border-[#C8CDD6] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (PDF Sheet Header Styling) */}
        <div className="bg-[#F4F5F7] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#D8DCE3] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-[#5A606B]">
              <span>{machine.category === 'geared' ? 'Geared Traction Machine' : 'Gearless MRL Traction Machine'}</span>
              <span aria-hidden="true">·</span>
              <span>{machine.applicationClass}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Catalog Page {machine.pdfPage}</span>
            </div>
            <h2
              id="machine-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold leading-none mt-1"
            >
              <span className="text-[#1F2124]">{machine.series} </span>
              <span className="text-[#B5121B]">{machine.modelNumber}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${machine.model} datasheet`}
            className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-[2px] text-[#3A3F47] hover:bg-[#E2E5EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 bg-white border-b border-[#D8DCE3] flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Datasheet sections"
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto max-w-full"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'specs'}
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#B5121B] text-[#1F2124]'
                  : 'border-transparent text-[#5A606B] hover:text-[#1F2124]'
              }`}
            >
              Specifications &amp; Table
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cad'}
              onClick={() => setActiveTab('cad')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'cad'
                  ? 'border-[#B5121B] text-[#1F2124]'
                  : 'border-transparent text-[#5A606B] hover:text-[#1F2124]'
              }`}
            >
              CAD Drawing (mm)
            </button>
          </div>

          {activeTab === 'cad' && (
            <div className="flex items-center gap-1.5 pb-2">
              <button
                type="button"
                aria-label="Zoom out CAD blueprint"
                disabled={cadZoom <= 1}
                onClick={() => setCadZoom((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100))}
                className="p-1.5 rounded-[2px] border border-[#C8CDD6] text-[#3A3F47] hover:border-[#1F2124] disabled:opacity-40 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-[#3A3F47] w-11 text-center tabular-nums">
                {Math.round(cadZoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in CAD blueprint"
                disabled={cadZoom >= 2}
                onClick={() => setCadZoom((z) => Math.min(2, Math.round((z + 0.25) * 100) / 100))}
                className="p-1.5 rounded-[2px] border border-[#C8CDD6] text-[#3A3F47] hover:border-[#1F2124] disabled:opacity-40 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'specs' ? (
            <div className="space-y-8">
              {/* Top Summary Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 bg-white border border-[#E2E5EA] rounded-lg p-5 flex items-center justify-center h-60">
                  <img
                    src={machine.imageUrl}
                    alt={`KAYNOXX ${machine.model} mechanical assembly`}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="md:col-span-7">
                  <p className="text-sm text-[#3A3F47] leading-relaxed mb-4">
                    {machine.tagline}
                  </p>
                  <div className="border border-[#E2E5EA] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-[#ECEEF2]">
                        <tr className="bg-[#F9FAFB]">
                          <th className="text-left font-medium text-[#5A606B] px-4 py-2.5 w-1/2">Max Static Load</th>
                          <td className="font-mono font-semibold text-[#1F2124] px-4 py-2.5 tabular-nums">{machine.maxStaticLoadKg.toLocaleString()} kg</td>
                        </tr>
                        <tr>
                          <th className="text-left font-medium text-[#5A606B] px-4 py-2.5">Power Range</th>
                          <td className="font-mono font-semibold text-[#1F2124] px-4 py-2.5 tabular-nums">{machine.powerRangeLabel}</td>
                        </tr>
                        <tr className="bg-[#F9FAFB]">
                          <th className="text-left font-medium text-[#5A606B] px-4 py-2.5">Supply / Brake Voltage</th>
                          <td className="font-mono font-semibold text-[#1F2124] px-4 py-2.5 tabular-nums">{machine.voltage} · {machine.brakeVoltage}</td>
                        </tr>
                        <tr>
                          <th className="text-left font-medium text-[#5A606B] px-4 py-2.5">Sheave Options</th>
                          <td className="font-mono font-semibold text-[#1F2124] px-4 py-2.5 tabular-nums">
                            {machine.sheaveOptionsMm.map((s) => `Φ${s} mm`).join(', ')}
                          </td>
                        </tr>
                        <tr className="bg-[#F9FAFB]">
                          <th className="text-left font-medium text-[#5A606B] px-4 py-2.5">
                            {machine.oilCapacityLtr ? 'Oil Capacity' : 'Lubrication System'}
                          </th>
                          <td className="font-mono font-semibold text-[#1F2124] px-4 py-2.5 tabular-nums">
                            {machine.oilCapacityLtr ? `${machine.oilCapacityLtr} Ltr (Approx)` : 'Oil-Free Sealed Bearings'}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-left font-medium text-[#5A606B] px-4 py-2.5">Machine Weight &amp; Footprint</th>
                          <td className="font-mono font-semibold text-[#1F2124] px-4 py-2.5 tabular-nums">
                            {machine.weightKg} kg · {machine.dimensionsMm} mm
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Performance Configuration Matrix (PDF Exact Table) */}
              <div>
                <h3 className="font-display text-xl font-bold text-[#1F2124] mb-3">
                  Rated Operating Configurations
                </h3>
                <div className="overflow-x-auto border border-[#E2E5EA] rounded-lg">
                  <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-[#B5121B] text-white font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Duty Load</th>
                        <th className="px-3.5 py-2.5">Roping</th>
                        <th className="px-3.5 py-2.5">Speed</th>
                        <th className="px-3.5 py-2.5">Travel</th>
                        {machine.category === 'geared' && <th className="px-3.5 py-2.5">Gear Ratio</th>}
                        <th className="px-3.5 py-2.5">Sheave</th>
                        <th className="px-3.5 py-2.5">Rope × Grv</th>
                        <th className="px-3.5 py-2.5">Power</th>
                        <th className="px-3.5 py-2.5">Current</th>
                        <th className="px-3.5 py-2.5">Duty / IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECEEF2] font-mono tabular-nums text-[#1F2124]">
                      {machine.configs.map((cfg, i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                          <td className="px-3.5 py-2.5 font-semibold">
                            {cfg.loadKg} kg{cfg.persons ? ` (${cfg.persons}P)` : ''}
                          </td>
                          <td className="px-3.5 py-2.5">{cfg.roping}</td>
                          <td className="px-3.5 py-2.5">{cfg.speedMs.toFixed(2)} m/s</td>
                          <td className="px-3.5 py-2.5">≤ {cfg.maxTravelM} m</td>
                          {machine.category === 'geared' && (
                            <td className="px-3.5 py-2.5">{cfg.ratio || '—'}</td>
                          )}
                          <td className="px-3.5 py-2.5">Φ{cfg.sheaveMm} mm</td>
                          <td className="px-3.5 py-2.5">
                            {cfg.ropeSpec} × {cfg.grooves}
                          </td>
                          <td className="px-3.5 py-2.5 font-semibold text-[#B5121B]">
                            {cfg.powerKw} kW{cfg.powerHp ? ` (${cfg.powerHp} HP)` : ''}
                          </td>
                          <td className="px-3.5 py-2.5">{cfg.amp ? `${cfg.amp} A` : '—'}</td>
                          <td className="px-3.5 py-2.5">
                            {cfg.rating} · {cfg.ipClass}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-[#6B7280] mt-2">
                  All models feature Class F insulation, 50% counterweight balance, and factory full-load thermal inspection.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A606B]">
                <span>
                  Orthographic engineering blueprint — <strong className="text-[#1F2124]">all dimensions in mm</strong> ({machine.dimensionsMm} mm envelope).
                </span>
                <span className="font-mono">Source: Official KAYNOXX Catalog p.{machine.pdfPage}</span>
              </div>
              <div className="blueprint-grid-bg border border-[#D4D8DF] rounded-lg p-4 overflow-auto max-h-[58vh] bg-white">
                <div
                  className="mx-auto flex items-center justify-center transition-all duration-200"
                  style={cadZoom > 1 ? { width: `${cadZoom * 100}%` } : undefined}
                >
                  <img
                    src={machine.cadUrl}
                    alt={`KAYNOXX ${machine.model} dimensional CAD blueprint drawing`}
                    referrerPolicy="no-referrer"
                    className={
                      cadZoom === 1
                        ? 'max-h-[50vh] w-auto max-w-full object-contain mx-auto mix-blend-multiply'
                        : 'w-full h-auto object-contain mx-auto mix-blend-multiply'
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F4F5F7] border-t border-[#D8DCE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSpecText}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1F2124] bg-white border border-[#C8CDD6] hover:border-[#1F2124] rounded-[2px] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Spec (.txt)</span>
            </button>
            <a
              href={COMPANY_INFO.catalogPdfUrl}
              download="KAYNOXX-Elevator-Traction-Machines-Catalog.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1F2124] bg-white border border-[#C8CDD6] hover:border-[#1F2124] rounded-[2px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Catalog PDF</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!isCompared && compareFull}
              onClick={() => onToggleCompare(machine.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-[2px] border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#FEF2F2] border-[#B5121B] text-[#B5121B]'
                  : compareFull
                  ? 'bg-white border-[#E2E5EA] text-[#9CA3AF] cursor-not-allowed'
                  : 'bg-white border-[#C8CDD6] text-[#1F2124] hover:border-[#1F2124]'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'In Comparison' : 'Add to Compare'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onRequestQuote(machine.model);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors cursor-pointer whitespace-nowrap"
            >
              Request Quote for {machine.model}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
