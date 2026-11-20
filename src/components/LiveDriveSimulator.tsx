import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Pause, Play } from 'lucide-react';
import { DriveCategory } from '../data/machines';
import { computeSimulatorMetrics } from '../utils/machineEngine';

const SPEED_OPTIONS = [0.65, 1.0, 1.5, 1.75];
const LOAD_OPTIONS = [408, 680, 1088, 2000];

const GEARLESS_BENEFITS = [
  {
    index: '01',
    metric: '0 m² Room',
    title: 'No Machine Room Required',
    detail: 'Compact MRL installation directly inside the hoistway eliminates rooftop slab construction.',
    icon: (
      <svg viewBox="0 0 44 44" className="w-8 h-8 shrink-0" fill="none" aria-hidden="true">
        <path d="M22 8L37 15.5L22 23L7 15.5L22 8Z" stroke="#B5121B" strokeWidth="2.1" strokeLinejoin="round" />
        <path d="M7 22.5L22 30L37 22.5" stroke="#B5121B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 29.5L22 37L37 29.5" stroke="#B5121B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    index: '02',
    metric: '−40% Loss',
    title: 'Save Energy',
    detail: 'High-efficiency PMSM direct-drive eliminates worm gear friction losses in continuous duty.',
    icon: (
      <svg viewBox="0 0 44 44" className="w-8 h-8 shrink-0" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="7" stroke="#B5121B" strokeWidth="2.1" />
        <path
          d="M22 6V11M22 33V38M6 22H11M33 22H38M10.7 10.7L14.2 14.2M29.8 29.8L33.3 33.3M33.3 10.7L29.8 14.2M14.2 29.8L10.7 33.3"
          stroke="#B5121B"
          strokeWidth="2.1"
          strokeLinecap="round"
          className="animate-gear-slow"
        />
      </svg>
    ),
  },
  {
    index: '03',
    metric: '< 54 dBA',
    title: 'Low Noise',
    detail: 'Oil-free direct drive operates quietly with zero gearbox whine or structural shaft vibration.',
    icon: (
      <svg viewBox="0 0 44 44" className="w-8 h-8 shrink-0" fill="none" aria-hidden="true">
        <path d="M8 18H15L23 11V33L15 26H8V18Z" stroke="#B5121B" strokeWidth="2.1" strokeLinejoin="round" />
        <path d="M28.5 16.5C30.8 18.8 30.8 25.2 28.5 27.5" stroke="#B5121B" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M33 12.5C37.2 16.7 37.2 27.3 33 31.5" stroke="#B5121B" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    index: '04',
    metric: '275–400 mm',
    title: 'Compact Designs',
    detail: 'Narrow machine envelope fits tight modern MRL hoistways and existing shaft retrofits.',
    icon: (
      <svg viewBox="0 0 44 44" className="w-8 h-8 shrink-0" fill="none" aria-hidden="true">
        <path d="M10 34L19 25M19 25H12M19 25V32" stroke="#B5121B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 10L25 19M25 19H32M25 19V12" stroke="#B5121B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const LiveDriveSimulator: React.FC = () => {
  const [mode, setMode] = useState<DriveCategory>('gearless');
  const [speedMs, setSpeedMs] = useState<number>(1.0);
  const [dutyLoadKg, setDutyLoadKg] = useState<number>(680);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [cabinProgress, setCabinProgress] = useState<number>(0.35);

  const metrics = computeSimulatorMetrics(mode, dutyLoadKg, speedMs);

  // Smooth cabin elevation cycle synced with speed and direction
  useEffect(() => {
    if (!isRunning) return;
    const stepMs = 80;
    const delta = (speedMs * 0.018);
    const id = window.setInterval(() => {
      setCabinProgress((prev) => {
        if (direction === 'up') {
          if (prev >= 0.88) {
            setDirection('down');
            return 0.88;
          }
          return Math.min(0.88, prev + delta);
        } else {
          if (prev <= 0.12) {
            setDirection('up');
            return 0.12;
          }
          return Math.max(0.12, prev - delta);
        }
      });
    }, stepMs);
    return () => window.clearInterval(id);
  }, [isRunning, speedMs, direction]);

  // Derived visual positions inside the SVG shaft
  const currentFloor = Math.max(1, Math.min(12, Math.round(cabinProgress * 11) + 1));
  const cabinY = 296 - cabinProgress * 170; // moves between y=296 (Floor 1) and y=126 (Floor 12)
  const counterweightY = 126 + cabinProgress * 170;
  const sheaveDurationSec = Math.max(0.45, Math.round((60 / Math.max(15, metrics.sheaveRpm)) * 100) / 100);
  const ropeDurationSec = Math.max(0.35, Math.round((1.5 / Math.max(0.5, metrics.ropeSpeedMs)) * 100) / 100);

  return (
    <section id="simulator" className="scroll-mt-16 bg-white border-b border-[#E2E5EA]">
      {/* PDF Page 11 Signature Bold Crimson Chevron Header */}
      <div className="bg-[#B5121B] text-white pt-12 pb-16 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 chevron-down-clip">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-white/85">
            Brings Big Performance
          </p>
          <h2 className="font-display font-bold text-[clamp(2rem,4.2vw,3.5rem)] leading-tight tracking-tight mt-1 [text-wrap:balance]">
            Gearless &amp; Geared Drive Architecture
          </h2>
          <p className="text-sm lg:text-base text-white/90 max-w-2xl mx-auto mt-3">
            Compare KAYNOXX permanent-magnet MRL direct-drive physics against traditional worm-geared
            traction setups in real time.
          </p>
        </div>
      </div>

      {/* 4 Page-11 Engineering Benefits Machined Spec Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pb-14">
        <div className="bg-[#D8DCE3] border border-[#D8DCE3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
          {GEARLESS_BENEFITS.map((b) => (
            <div key={b.title} className="bg-white p-5 flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[11px] font-semibold text-[#6B7280] tabular-nums">
                    {b.index} · {b.metric}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#1F2124] leading-tight mt-1">
                    {b.title}
                  </h3>
                </div>
                {b.icon}
              </div>
              <p className="text-xs sm:text-sm text-[#5A606B] leading-relaxed">{b.detail}</p>
            </div>
          ))}
        </div>

        {/* Interactive Animated SVG Traction Drive Simulator */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left: Interactive Controls + Live Engineering Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#F4F5F7] border border-[#D8DCE3] rounded-[2px] p-4 sm:p-6">
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#1F2124]">
                  Interactive Traction Drive Simulator
                </h3>
                <p className="text-sm text-[#5A606B] mt-1">
                  Toggle drive architecture, load, and speed to observe real sheave RPM, roping geometry, and acoustic output.
                </p>
              </div>

              {/* Drive Mode Segmented Switch */}
              <div>
                <span className="block text-xs font-semibold text-[#5A606B] mb-2">
                  Traction Architecture
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 bg-white border border-[#D8DCE3] rounded-[2px]">
                  <button
                    type="button"
                    onClick={() => setMode('gearless')}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${
                      mode === 'gearless'
                        ? 'bg-[#B5121B] text-white'
                        : 'text-[#3A3F47] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    Gearless MRL (2:1)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('geared');
                      if (speedMs > 1.0) setSpeedMs(1.0);
                    }}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${
                      mode === 'geared'
                        ? 'bg-[#1F2124] text-white'
                        : 'text-[#3A3F47] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    Geared Worm (1:1)
                  </button>
                </div>
              </div>

              {/* Rated Speed Controls */}
              <div>
                <span className="block text-xs font-semibold text-[#5A606B] mb-2">
                  Cabin Rated Speed (m/s)
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {SPEED_OPTIONS.map((spd) => {
                    const disabled = mode === 'geared' && spd > 1.0;
                    const active = speedMs === spd;
                    return (
                      <button
                        key={spd}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSpeedMs(spd)}
                        className={`py-2 text-xs font-mono font-medium rounded border transition-colors tabular-nums cursor-pointer ${
                          active
                            ? 'bg-[#1F2124] text-white border-[#1F2124]'
                            : disabled
                            ? 'bg-[#ECEEF2] text-[#A0A6B0] border-[#E2E5EA] cursor-not-allowed'
                            : 'bg-white text-[#1F2124] border-[#D4D8DF] hover:border-[#B5121B]'
                        }`}
                      >
                        {spd.toFixed(2)}
                      </button>
                    );
                  })}
                </div>
                {mode === 'geared' && speedMs > 1.0 && (
                  <p className="text-xs text-[#B5121B] mt-1.5">
                    Geared KING series operates up to 1.00 m/s; switch to Gearless PRINCE for 1.50–1.75 m/s.
                  </p>
                )}
              </div>

              {/* Duty Load Presets */}
              <div>
                <span className="block text-xs font-semibold text-[#5A606B] mb-2">
                  Cabin Duty Load (kg)
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {LOAD_OPTIONS.map((ld) => (
                    <button
                      key={ld}
                      type="button"
                      onClick={() => setDutyLoadKg(ld)}
                      className={`py-2 text-xs font-mono font-medium rounded border transition-colors tabular-nums cursor-pointer ${
                        dutyLoadKg === ld
                          ? 'bg-[#1F2124] text-white border-[#1F2124]'
                          : 'bg-white text-[#1F2124] border-[#D4D8DF] hover:border-[#B5121B]'
                      }`}
                    >
                      {ld} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Playback & Direction Controls */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRunning((r) => !r)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-[2px] bg-white border border-[#C8CDD6] text-[#1F2124] hover:border-[#1F2124] transition-colors cursor-pointer"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pause Drive' : 'Run Drive'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection((d) => (d === 'up' ? 'down' : 'up'))}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-[2px] bg-white border border-[#C8CDD6] text-[#1F2124] hover:border-[#1F2124] transition-colors cursor-pointer"
                >
                  {direction === 'up' ? <ArrowUp className="w-3.5 h-3.5 text-[#B5121B]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#B5121B]" />}
                  <span>Direction: {direction === 'up' ? 'Ascending' : 'Descending'}</span>
                </button>
              </div>
            </div>

            {/* Live Engineering Telemetry Readout Grid */}
            <div
              data-testid="simulator-telemetry"
              className="mt-6 pt-5 border-t border-[#D4D8DF] grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              <div>
                <div className="text-[11px] text-[#5A606B]">Sheave Speed</div>
                <div className="font-mono text-lg font-semibold text-[#1F2124] tabular-nums">
                  {metrics.sheaveRpm} RPM
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5A606B]">Rope Velocity</div>
                <div className="font-mono text-lg font-semibold text-[#1F2124] tabular-nums">
                  {metrics.ropeSpeedMs.toFixed(2)} m/s
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5A606B]">Shaft Power</div>
                <div className="font-mono text-lg font-semibold text-[#B5121B] tabular-nums">
                  {metrics.estimatedPowerKw.toFixed(1)} kW
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5A606B]">Acoustic Level</div>
                <div className="font-mono text-base font-semibold text-[#1F2124] tabular-nums">
                  ~{metrics.estimatedNoiseDb} dBA
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5A606B]">Drive Efficiency</div>
                <div className="font-mono text-base font-semibold text-[#1F2124] tabular-nums">
                  {metrics.efficiencyPct}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5A606B]">Machine Room</div>
                <div className="font-mono text-base font-semibold text-[#1F2124]">
                  {metrics.machineRoomNeeded ? 'Required' : 'MRL (None)'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Animated SVG Hoistway & Traction Sheave Engineering Cutaway */}
          <div className="lg:col-span-7 bg-[#181A1D] shaft-grid-bg rounded-[2px] border border-[#2E3238] p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div className="text-xs font-mono text-white/80">
                {mode === 'gearless'
                  ? 'PRINCE MRL · 2:1 Direct-Drive PMSM · Φ320 mm Sheave'
                  : 'KING Geared · 1:1 Worm Gearbox · Φ530 mm Sheave'}
              </div>
              <div className="font-mono text-xs text-white/70 tabular-nums">
                Floor {String(currentFloor).padStart(2, '0')} / 12 · {direction === 'up' ? 'UP' : 'DOWN'}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center py-3">
              <svg
                viewBox="0 0 620 400"
                className="w-full h-auto max-h-[410px]"
                role="img"
                aria-label={`Animated elevator shaft cutaway operating in ${mode} ${metrics.ropingLabel} mode`}
              >
                {/* Hoistway Structural Concrete Shaft Walls */}
                <rect x="70" y="18" width="330" height="366" rx="4" fill="#17191C" stroke="#3E444D" strokeWidth="2" />

                {/* Machine Room Concrete Slab (Visible only in Geared Mode!) */}
                {mode === 'geared' ? (
                  <g>
                    <rect x="70" y="18" width="330" height="84" fill="#25282E" stroke="#4D5460" strokeWidth="1.5" />
                    <line x1="70" y1="102" x2="400" y2="102" stroke="#B5121B" strokeWidth="2.5" strokeDasharray="6 4" />
                    <text x="82" y="34" fill="#E2E5EA" fontSize="10" fontFamily="JetBrains Mono, monospace">
                      OVERHEAD MACHINE ROOM
                    </text>
                  </g>
                ) : (
                  <g>
                    <line x1="70" y1="22" x2="400" y2="22" stroke="#B5121B" strokeWidth="2" />
                    <text x="82" y="38" fill="#E2E5EA" fontSize="10" fontFamily="JetBrains Mono, monospace">
                      MRL HEADROOM (NO MACHINE ROOM)
                    </text>
                  </g>
                )}

                {/* Floor Landing Markers */}
                {[12, 9, 6, 3, 1].map((fl, idx) => {
                  const y = 135 + idx * 54;
                  return (
                    <g key={fl}>
                      <line x1="70" y1={y} x2="88" y2={y} stroke="#4D5460" strokeWidth="1.5" />
                      <text x="42" y={y + 4} fill="#9CA3AF" fontSize="10" fontFamily="JetBrains Mono, monospace">
                        F{String(fl).padStart(2, '0')}
                      </text>
                    </g>
                  );
                })}

                {/* Guide Rails */}
                <line x1="175" y1="104" x2="175" y2="376" stroke="#374151" strokeWidth="3" />
                <line x1="330" y1="104" x2="330" y2="376" stroke="#374151" strokeWidth="3" />

                {/* Dead-End Rope Hitch for 2:1 Gearless MRL */}
                {mode === 'gearless' && (
                  <g>
                    <rect x="132" y="54" width="16" height="8" fill="#B5121B" rx="1" />
                    <rect x="356" y="54" width="16" height="8" fill="#B5121B" rx="1" />
                  </g>
                )}

                {/* Steel Suspension Traction Ropes (Animated flow!) */}
                <g
                  style={{ '--rope-duration': `${ropeDurationSec}s` } as React.CSSProperties}
                >
                  {mode === 'gearless' ? (
                    <>
                      {/* 2:1 Roping: Hitch -> Car Pulley -> Main Sheave -> Counterweight Pulley -> Hitch */}
                      <line
                        x1="140"
                        y1="62"
                        x2="140"
                        y2={cabinY - 6}
                        stroke="#D1D5DB"
                        strokeWidth="2.4"
                        strokeDasharray="6 6"
                        className={isRunning ? (direction === 'up' ? 'animate-rope-up' : 'animate-rope-down') : ''}
                      />
                      <line
                        x1="210"
                        y1="68"
                        x2="210"
                        y2={cabinY - 6}
                        stroke="#FACC15"
                        strokeWidth="2.4"
                        strokeDasharray="6 6"
                        className={isRunning ? (direction === 'up' ? 'animate-rope-up' : 'animate-rope-down') : ''}
                      />
                      <line
                        x1="274"
                        y1="68"
                        x2="314"
                        y2={counterweightY - 4}
                        stroke="#FACC15"
                        strokeWidth="2.4"
                        strokeDasharray="6 6"
                        className={isRunning ? (direction === 'up' ? 'animate-rope-down' : 'animate-rope-up') : ''}
                      />
                      <line
                        x1="364"
                        y1="62"
                        x2="364"
                        y2={counterweightY - 4}
                        stroke="#D1D5DB"
                        strokeWidth="2.4"
                        strokeDasharray="6 6"
                        className={isRunning ? (direction === 'up' ? 'animate-rope-down' : 'animate-rope-up') : ''}
                      />
                    </>
                  ) : (
                    <>
                      {/* 1:1 Direct Roping: Car Top -> Main Φ530 Sheave -> Counterweight */}
                      <line
                        x1="175"
                        y1="64"
                        x2="175"
                        y2={cabinY}
                        stroke="#FACC15"
                        strokeWidth="3"
                        strokeDasharray="7 5"
                        className={isRunning ? (direction === 'up' ? 'animate-rope-up' : 'animate-rope-down') : ''}
                      />
                      <line
                        x1="330"
                        y1="64"
                        x2="330"
                        y2={counterweightY}
                        stroke="#FACC15"
                        strokeWidth="3"
                        strokeDasharray="7 5"
                        className={isRunning ? (direction === 'up' ? 'animate-rope-down' : 'animate-rope-up') : ''}
                      />
                    </>
                  )}
                </g>

                {/* Main KAYNOXX Traction Machine Unit at Top of Shaft */}
                <g>
                  {/* Blue Industrial Motor Stator Body */}
                  <rect
                    x={mode === 'gearless' ? 210 : 185}
                    y="44"
                    width={mode === 'gearless' ? 74 : 135}
                    height="44"
                    rx="5"
                    fill="#1D4ED8"
                    stroke="#60A5FA"
                    strokeWidth="1.5"
                  />
                  {/* Cooling Fins */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1={(mode === 'gearless' ? 222 : 200) + i * 11}
                      y1="48"
                      x2={(mode === 'gearless' ? 222 : 200) + i * 11}
                      y2="84"
                      stroke="#1E3A8A"
                      strokeWidth="2.5"
                    />
                  ))}

                  {/* Rotating Signature Yellow Traction Sheave */}
                  <g
                    style={{ '--sheave-duration': `${sheaveDurationSec}s` } as React.CSSProperties}
                    className={
                      isRunning
                        ? direction === 'up'
                          ? 'animate-sheave-spin'
                          : 'animate-sheave-spin-reverse'
                        : ''
                    }
                  >
                    <circle
                      cx={mode === 'gearless' ? 242 : 252}
                      cy="66"
                      r={mode === 'gearless' ? 26 : 33}
                      fill="#F59E0B"
                      stroke="#FDE047"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx={mode === 'gearless' ? 242 : 252}
                      cy="66"
                      r={mode === 'gearless' ? 18 : 24}
                      fill="#1F2124"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                    {/* 4 Precision Spokes */}
                    <line
                      x1={mode === 'gearless' ? 242 : 252}
                      y1={mode === 'gearless' ? 48 : 42}
                      x2={mode === 'gearless' ? 242 : 252}
                      y2={mode === 'gearless' ? 84 : 90}
                      stroke="#F59E0B"
                      strokeWidth="3.5"
                    />
                    <line
                      x1={mode === 'gearless' ? 224 : 228}
                      y1="66"
                      x2={mode === 'gearless' ? 260 : 276}
                      y2="66"
                      stroke="#F59E0B"
                      strokeWidth="3.5"
                    />
                    <circle cx={mode === 'gearless' ? 242 : 252} cy="66" r="6" fill="#E5E7EB" />
                  </g>
                </g>

                {/* Elevator Cabin */}
                <g transform={`translate(115, ${cabinY})`}>
                  {/* 2:1 Car-Top Diverter Pulley */}
                  {mode === 'gearless' && (
                    <circle cx="60" cy="-6" r="10" fill="#F59E0B" stroke="#1F2124" strokeWidth="2" />
                  )}
                  <rect x="0" y="0" width="120" height="72" rx="4" fill="#2E3238" stroke="#E5E7EB" strokeWidth="2" />
                  {/* Cabin Doors */}
                  <rect x="16" y="10" width="42" height="58" fill="#1F2124" stroke="#6B7280" strokeWidth="1" />
                  <rect x="62" y="10" width="42" height="58" fill="#1F2124" stroke="#6B7280" strokeWidth="1" />
                  {/* Floor Indicator Strip */}
                  <rect x="40" y="2" width="40" height="7" rx="1.5" fill="#B5121B" />
                  <text
                    x="60"
                    y="43"
                    textAnchor="middle"
                    fill="#F3F4F6"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {dutyLoadKg} KG
                  </text>
                </g>

                {/* Counterweight (50% Balance per PDF Page 4) */}
                <g transform={`translate(306, ${counterweightY})`}>
                  {mode === 'gearless' && (
                    <circle cx="28" cy="-4" r="9" fill="#F59E0B" stroke="#1F2124" strokeWidth="2" />
                  )}
                  <rect x="4" y="0" width="48" height="62" rx="3" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1.5" />
                  <line x1="8" y1="16" x2="48" y2="16" stroke="#1F2124" strokeWidth="2" />
                  <line x1="8" y1="31" x2="48" y2="31" stroke="#1F2124" strokeWidth="2" />
                  <line x1="8" y1="46" x2="48" y2="46" stroke="#1F2124" strokeWidth="2" />
                  <text x="28" y="74" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="JetBrains Mono, monospace">
                    CWT 50%
                  </text>
                </g>

                {/* Right Blueprint Engineering Callout Panel */}
                <g transform="translate(425, 36)">
                  <rect x="0" y="0" width="176" height="330" rx="6" fill="#17191C" stroke="#374151" strokeWidth="1.5" />
                  <text x="14" y="26" fill="#B5121B" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                    DRIVE CROSS-SECTION
                  </text>
                  <line x1="14" y1="36" x2="162" y2="36" stroke="#2E3238" strokeWidth="1" />

                  {/* Enlarged Animated Pulley Schematic */}
                  <g
                    transform="translate(88, 120)"
                    style={{ '--sheave-duration': `${sheaveDurationSec}s` } as React.CSSProperties}
                  >
                    <g
                      className={
                        isRunning
                          ? direction === 'up'
                            ? 'animate-sheave-spin'
                            : 'animate-sheave-spin-reverse'
                          : ''
                      }
                    >
                      <circle cx="0" cy="0" r="54" fill="none" stroke="#F59E0B" strokeWidth="8" />
                      <circle cx="0" cy="0" r="44" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="6 6" />
                      <circle cx="0" cy="0" r="16" fill="#2E3238" stroke="#E5E7EB" strokeWidth="2" />
                      {[0, 60, 120, 180, 240, 300].map((deg) => (
                        <line
                          key={deg}
                          x1="0"
                          y1="-16"
                          x2="0"
                          y2="-46"
                          stroke="#F59E0B"
                          strokeWidth="4"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                      <circle cx="0" cy="0" r="5" fill="#B5121B" />
                    </g>
                  </g>

                  {/* Technical Specs Callouts */}
                  <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#D1D5DB">
                    <text x="14" y="206" fill="#9CA3AF">SHEAVE DIA</text>
                    <text x="162" y="206" textAnchor="end" fill="#FFFFFF">
                      {mode === 'gearless' ? 'Φ320 mm' : 'Φ530 mm'}
                    </text>

                    <text x="14" y="232" fill="#9CA3AF">ROPING</text>
                    <text x="162" y="232" textAnchor="end" fill="#FFFFFF">{metrics.ropingLabel}</text>

                    <text x="14" y="258" fill="#9CA3AF">TORQUE</text>
                    <text x="162" y="258" textAnchor="end" fill="#FFFFFF">{metrics.motorTorqueNm} Nm</text>

                    <text x="14" y="284" fill="#9CA3AF">BRAKE</text>
                    <text x="162" y="284" textAnchor="end" fill="#FFFFFF">110V DC</text>

                    <text x="14" y="310" fill="#9CA3AF">LUBRICATION</text>
                    <text x="162" y="310" textAnchor="end" fill={mode === 'gearless' ? '#4ADE80' : '#FACC15'}>
                      {mode === 'gearless' ? 'OIL-FREE' : '2–8 LTR'}
                    </text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
