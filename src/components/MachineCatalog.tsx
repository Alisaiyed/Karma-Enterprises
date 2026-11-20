import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Check, Scale, Search } from 'lucide-react';
import { DriveCategory, TRACTION_MACHINES, TractionMachine } from '../data/machines';
import { filterCatalog } from '../utils/machineEngine';

interface MachineCatalogProps {
  compareIds: string[];
  onToggleCompare: (machineId: string) => void;
  onInspectMachine: (machine: TractionMachine) => void;
  onAddToQuote: (modelName: string) => void;
}

const APPLICATION_OPTIONS = [
  'all',
  'Residential',
  'Commercial',
  'Hospital & High-Traffic',
  'Heavy Freight',
];

export const MachineCatalog: React.FC<MachineCatalogProps> = ({
  compareIds,
  onToggleCompare,
  onInspectMachine,
  onAddToQuote,
}) => {
  const [category, setCategory] = useState<'all' | DriveCategory>('all');
  const [application, setApplication] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = useMemo(
    () => filterCatalog(TRACTION_MACHINES, category, searchQuery, application),
    [category, searchQuery, application]
  );

  const gearedCount = TRACTION_MACHINES.filter((m) => m.category === 'geared').length;
  const gearlessCount = TRACTION_MACHINES.filter((m) => m.category === 'gearless').length;

  return (
    <section id="catalog" className="scroll-mt-16 bg-[#F4F5F7] py-14 sm:py-16 lg:py-20 border-b border-[#D8DCE3]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-8 border-b border-[#CFD4DC]">
          <div>
            <p className="text-xs font-semibold text-[#5A606B] tracking-wide">
              Complete Engineering Portfolio · 18 Production Models
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F2124] tracking-tight mt-1">
              Traction Machine <span className="text-[#B5121B]">Catalog</span>
            </h2>
          </div>

          <p className="text-sm text-[#5A606B] max-w-md leading-relaxed">
            Inspect full VVVF motor parameters, dimensional CAD blueprints, and rope/sheave
            specifications. Select up to three machines to compare side by side.
          </p>
        </div>

        {/* Interactive Filter Toolbar (100% overflow-safe down to 360px) */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Segmented Series Tabs */}
          <div
            role="tablist"
            aria-label="Traction machine series filter"
            className="flex flex-wrap sm:inline-flex items-center gap-1 p-1 bg-white border border-[#D8DCE3] rounded-[2px] w-full sm:w-auto self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={category === 'all'}
              onClick={() => setCategory('all')}
              className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
                category === 'all'
                  ? 'bg-[#1F2124] text-white'
                  : 'text-[#3A3F47] hover:text-[#1F2124]'
              }`}
            >
              All Models ({TRACTION_MACHINES.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={category === 'geared'}
              onClick={() => setCategory('geared')}
              className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
                category === 'geared'
                  ? 'bg-[#B5121B] text-white'
                  : 'text-[#3A3F47] hover:text-[#1F2124]'
              }`}
            >
              Geared · KING ({gearedCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={category === 'gearless'}
              onClick={() => setCategory('gearless')}
              className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
                category === 'gearless'
                  ? 'bg-[#B5121B] text-white'
                  : 'text-[#3A3F47] hover:text-[#1F2124]'
              }`}
            >
              Gearless · PRINCE ({gearlessCount})
            </button>
          </div>

          {/* Search + Application Select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <label htmlFor="catalog-search" className="sr-only">
                Search models by name, load, or power
              </label>
              <Search
                className="w-4 h-4 text-[#5A606B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model, kg, or kW..."
                className="w-full sm:w-60 pl-9 pr-3 py-2.5 text-sm bg-white border border-[#C8CDD6] rounded-[2px] text-[#1F2124] placeholder:text-[#7B828E] focus:outline-none focus:border-[#B5121B]"
              />
            </div>

            <div className="flex-1 sm:flex-initial">
              <label htmlFor="catalog-application" className="sr-only">
                Filter by building application
              </label>
              <select
                id="catalog-application"
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                className="w-full sm:w-48 px-3 py-2.5 text-sm bg-white border border-[#C8CDD6] rounded-[2px] text-[#1F2124] focus:outline-none focus:border-[#B5121B]"
              >
                {APPLICATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'all' ? 'All Applications' : opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#5A606B]">
          <span data-testid="catalog-count" className="tabular-nums">
            Showing {filtered.length} of {TRACTION_MACHINES.length} traction machines
          </span>
          {(category !== 'all' || application !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setApplication('all');
                setSearchQuery('');
              }}
              className="text-[#B5121B] font-semibold hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="mt-8 bg-white border border-[#D8DCE3] rounded-[2px] p-8 sm:p-12 text-center">
            <h3 className="font-display text-2xl font-bold text-[#1F2124]">
              No traction machines match those filters
            </h3>
            <p className="text-sm text-[#5A606B] mt-2">
              Try clearing your search query or switching to All Models to inspect the full KING &amp; PRINCE lineup.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setApplication('all');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] cursor-pointer"
            >
              Show All 18 Models
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((machine) => {
              const isCompared = compareIds.includes(machine.id);
              const compareLimitReached = !isCompared && compareIds.length >= 3;

              return (
                <article
                  key={machine.id}
                  data-testid={`machine-card-${machine.id}`}
                  className="group bg-white border border-[#D8DCE3] hover:border-[#1F2124] rounded-[2px] flex flex-col justify-between transition-colors duration-150 overflow-hidden"
                >
                  {/* Top PDF-Style Header Band + Clean Unboxed Studio Stage */}
                  <div className="p-4 sm:p-5 pb-4">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A606B]">
                      <span className="truncate font-medium">
                        {machine.category === 'geared' ? 'Geared Worm Drive' : 'Gearless MRL PMSM'}
                      </span>
                      <span className="truncate text-right text-[#6B7280]">{machine.applicationClass}</span>
                    </div>

                    {/* PDF Exact Two-Tone Model Title: KING / PRINCE + Crimson Number */}
                    <h3 className="font-display text-3xl font-bold tracking-tight mt-1 leading-none">
                      <span className="text-[#1F2124]">{machine.series} </span>
                      <span className="text-[#B5121B] tabular-nums">{machine.modelNumber}</span>
                    </h3>

                    <p className="text-xs text-[#5A606B] mt-2 leading-relaxed min-h-[2.25rem]">
                      {machine.tagline}
                    </p>

                    {/* Clean Unboxed Studio Stage (No nested box-inside-box) */}
                    <div className="mt-3 py-3 flex items-center justify-center h-44">
                      <img
                        src={machine.imageUrl}
                        alt={`KAYNOXX ${machine.model} ${machine.category} elevator traction machine`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* 4-Cell Tabular Spec Ledger */}
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3.5 border-t border-[#E2E5EA] text-xs">
                      <div>
                        <dt className="text-[#6B7280]">Duty Load</dt>
                        <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                          {machine.dutyLoadMinKg === machine.dutyLoadMaxKg
                            ? `${machine.dutyLoadMaxKg} kg`
                            : `${machine.dutyLoadMinKg}–${machine.dutyLoadMaxKg} kg`}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6B7280]">Max Static Load</dt>
                        <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                          {machine.maxStaticLoadKg.toLocaleString()} kg
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6B7280]">Power Range</dt>
                        <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                          {machine.powerRangeLabel}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6B7280]">Speed / Weight</dt>
                        <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                          {machine.speedMaxMs.toFixed(2)} m/s · {machine.weightKg} kg
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-4 sm:px-5 py-3 bg-[#F7F8FA] border-t border-[#E2E5EA] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onInspectMachine(machine)}
                      aria-label={`View specs and CAD blueprint for ${machine.model}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1F2124] hover:bg-[#B5121B] rounded-[2px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Specs &amp; CAD</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={compareLimitReached}
                        onClick={() => onToggleCompare(machine.id)}
                        aria-label={
                          isCompared
                            ? `Remove ${machine.model} from comparison`
                            : `Compare ${machine.model}`
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-[2px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isCompared
                            ? 'bg-[#FEF2F2] border-[#B5121B] text-[#B5121B]'
                            : compareLimitReached
                            ? 'bg-white border-[#E2E5EA] text-[#9CA3AF] cursor-not-allowed'
                            : 'bg-white border-[#C8CDD6] text-[#3A3F47] hover:border-[#1F2124]'
                        }`}
                      >
                        {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onAddToQuote(machine.model)}
                        aria-label={`Request quote for ${machine.model}`}
                        className="px-2.5 py-2 text-xs font-semibold text-[#B5121B] hover:bg-[#FEF2F2] rounded-[2px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Quote
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
