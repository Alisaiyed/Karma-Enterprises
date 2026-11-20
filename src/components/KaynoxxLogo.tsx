import React from 'react';

interface KaynoxxLogoProps {
  compact?: boolean;
  light?: boolean;
  animated?: boolean;
}

export const KaynoxxLogo: React.FC<KaynoxxLogoProps> = ({
  compact = false,
  light = false,
  animated = false,
}) => {
  const red = '#B5121B';
  const wordColor = light ? '#FFFFFF' : '#B5121B';
  const subColor = light ? '#D1D5DB' : '#1F2124';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <svg
        width={compact ? 32 : 46}
        height={compact ? 32 : 46}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="shrink-0 sm:w-[36px] sm:h-[36px]"
      >
        {/* Left Half Precision Gear Wheel */}
        <g className={animated ? 'origin-[32px_34px]' : ''}>
          <path
            d="M30 14H26L24.5 18.8C23.1 19.3 21.8 20 20.6 20.9L16 19L13 22.8L16.2 26.8C15.6 28.1 15.2 29.5 15 31H10V36H15C15.2 37.5 15.6 38.9 16.2 40.2L13 44.2L16 48L20.6 46.1C21.8 47 23.1 47.7 24.5 48.2L26 53H30"
            stroke={red}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path
            d="M30 23.5C24.2 23.5 19.5 28.2 19.5 34C19.5 39.8 24.2 44.5 30 44.5"
            stroke={red}
            strokeWidth="2.4"
          />
        </g>

        {/* Twin Vertical Elevator Shaft Tower Rails */}
        <path
          d="M31.5 14V53"
          stroke={red}
          strokeWidth="3.2"
          strokeLinecap="square"
        />
        <path
          d="M39 7L44.5 4V52.5H39V7Z"
          fill={red}
        />

        {/* Right Traction Sheave Arc */}
        <path
          d="M47 16.5C52.8 19.8 56.5 26.4 56.5 34C56.5 44.5 48.1 53 37.5 53H31.5"
          stroke={red}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>

      {compact ? (
        <span
          className="font-display text-xl sm:text-2xl font-bold tracking-[0.05em] leading-none uppercase"
          style={{ color: wordColor }}
        >
          Karma Enterprises
        </span>
      ) : (
        <span className="flex flex-col leading-none">
          <span
            className="font-display text-2xl sm:text-3xl font-bold tracking-[0.06em] uppercase"
            style={{ color: wordColor }}
          >
            Karma Enterprises
          </span>
          <span
            className="text-[10px] font-semibold tracking-[0.16em] mt-1 uppercase"
            style={{ color: subColor }}
          >
            KAYNOXX™ Elevator Traction Machine
          </span>
        </span>
      )}
    </span>
  );
};
