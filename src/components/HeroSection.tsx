import React from 'react';
import { ArrowRight, FileDown } from 'lucide-react';
import { COMPANY_INFO } from '../data/machines';

interface HeroSectionProps {
  onJumpConfigurator: () => void;
  onJumpCatalog: () => void;
}

const PROOF_METRICS = [
  {
    value: '18 Models',
    label: '6 Geared KING · 12 Gearless PRINCE',
  },
  {
    value: '272 – 4,000 kg',
    label: 'Duty load range · Up to 8,000 kg static',
  },
  {
    value: '0.50 – 1.75 m/s',
    label: 'Rated speeds · Up to 80 m shaft travel',
  },
  {
    value: '100% In-House',
    label: 'Manufactured in GIDC Naroda, Ahmedabad',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJumpConfigurator,
  onJumpCatalog,
}) => {
  return (
    <section
      id="top"
      className="relative bg-white overflow-x-clip border-b border-[#D8DCE3]"
    >
      {/* Subtle architectural steel bench echoing PDF Cover Page 1 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[#F4F5F7] border-t border-[#E2E5EA] hidden lg:block"
      />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Authentic Industrial Engineering Proposition */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#5A606B] pb-3 border-b border-[#E2E5EA]">
              <span className="font-semibold text-[#1F2124]">Karma Enterprises</span>
              <span aria-hidden="true">·</span>
              <span>KAYNOXX™ Traction Machines</span>
              <span aria-hidden="true">·</span>
              <span>GIDC Naroda, Ahmedabad</span>
            </div>

            <h1 className="font-display font-bold tracking-tight leading-[0.95] text-[#1F2124] text-[clamp(2.65rem,5.2vw,4.75rem)] [text-wrap:balance]">
              <span className="text-[#B5121B]">More</span> Powerful.{' '}
              <span className="block">
                <span className="text-[#B5121B]">More</span> Efficient.
              </span>
            </h1>

            <p className="text-[15px] sm:text-base lg:text-[17px] leading-relaxed text-[#3A3F47] max-w-[54ch]">
              Manufactured in-house by <strong className="font-semibold text-[#1F2124]">Karma Enterprises</strong> under
              the <strong className="font-semibold text-[#1F2124]">KAYNOXX™</strong> engineering line — precision
              worm-geared <strong className="font-semibold text-[#1F2124]">KING Series</strong> and oil-free
              permanent-magnet gearless <strong className="font-semibold text-[#1F2124]">PRINCE Series</strong>{' '}
              elevator traction machines for 272 kg to 4,000 kg shafts.
            </p>

            {/* Primary CTA + Secondary Engineering Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <button
                type="button"
                onClick={onJumpConfigurator}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F2124]"
              >
                <span>Select Your Machine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onJumpCatalog}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#1F2124] bg-white hover:bg-[#F4F5F7] border border-[#C8CDD6] hover:border-[#1F2124] rounded-[2px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Browse All 18 Models
              </button>

              <a
                href={COMPANY_INFO.catalogPdfUrl}
                download="KAYNOXX-Elevator-Traction-Machines-Catalog.pdf"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-medium text-[#5A606B] hover:text-[#B5121B] transition-colors whitespace-nowrap shrink-0 py-2.5 sm:py-2"
              >
                <FileDown className="w-4 h-4" />
                <span>PDF Catalog</span>
              </a>
            </div>
          </div>

          {/* Right Column: Signature KAYNOXX PDF Hexagonal Machine Stage + Precision Calibration Ring */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[400px] sm:max-w-[480px] lg:max-w-[520px] aspect-[10/9] flex items-center justify-center">
              <svg
                viewBox="0 0 520 468"
                className="w-full h-full"
                role="img"
                aria-label="KAYNOXX Permanent Magnet Gearless Elevator Traction Machine framed inside the official red and charcoal hexagon emblem"
              >
                <defs>
                  <clipPath id="kaynoxx-hero-hex-clip">
                    <polygon points="260,66 416,156 416,312 260,402 104,312 104,156" />
                  </clipPath>
                </defs>

                {/* Subtle engineering drafting axis crosshairs */}
                <g opacity="0.16" stroke="#1F2124" strokeWidth="1">
                  <line x1="20" y1="234" x2="500" y2="234" strokeDasharray="4 6" />
                  <line x1="260" y1="8" x2="260" y2="460" strokeDasharray="4 6" />
                </g>

                {/* Outer precision rotating calibration ticks */}
                <g className="animate-gear-slow" opacity="0.22">
                  <circle
                    cx="260"
                    cy="234"
                    r="214"
                    fill="none"
                    stroke="#1F2124"
                    strokeWidth="1.5"
                    strokeDasharray="3 11"
                  />
                  <circle
                    cx="260"
                    cy="234"
                    r="204"
                    fill="none"
                    stroke="#B5121B"
                    strokeWidth="1"
                    strokeDasharray="16 24"
                  />
                </g>

                {/* Upper Half Crimson Hexagon Frame */}
                <path
                  d="M260 18 L458 132 L458 260 L416 244 L416 156 L260 66 L104 156 L104 244 L62 260 L62 132 Z"
                  fill="#B5121B"
                />

                {/* Lower Half Industrial Charcoal Hexagon Frame */}
                <path
                  d="M62 260 L104 244 L104 312 L260 402 L416 312 L416 244 L458 260 L458 336 L260 450 L62 336 Z"
                  fill="#2E3238"
                />

                {/* Inner Pure White Stage Hexagon */}
                <polygon
                  points="260,66 416,156 416,312 260,402 104,312 104,156"
                  fill="#FFFFFF"
                />

                {/* Authentic Extracted KAYNOXX Machine clipped cleanly inside the inner white hexagon */}
                <g clipPath="url(#kaynoxx-hero-hex-clip)">
                  <image
                    href="/assets/kaynoxx/hero-machine.jpg"
                    x="114"
                    y="112"
                    width="292"
                    height="244"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>

                {/* Small floating accent hexagon (PDF Cover bottom-right signature) */}
                <polygon
                  points="482,366 502,378 502,402 482,414 462,402 462,378"
                  fill="none"
                  stroke="#B5121B"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Hairline Spec Ledger (1-col mobile, 2-col tablet, 4-col desktop with crisp 1px gridlines) */}
        <div className="mt-8 sm:mt-10 lg:mt-12 bg-[#D8DCE3] border border-[#D8DCE3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
          {PROOF_METRICS.map((item) => (
            <div key={item.value} className="bg-white px-5 py-4 sm:px-6 sm:py-5">
              <div className="font-display text-2xl lg:text-[26px] font-bold text-[#1F2124] tabular-nums tracking-tight leading-none">
                {item.value}
              </div>
              <div className="text-xs text-[#5A606B] mt-1.5 leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
