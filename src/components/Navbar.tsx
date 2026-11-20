import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { KaynoxxLogo } from './KaynoxxLogo';

interface NavbarProps {
  onRequestQuote: () => void;
}

const NAV_ITEMS = [
  { label: 'Catalog', href: '#catalog' },
  { label: 'Configurator', href: '#configurator' },
  { label: 'Drive Simulator', href: '#simulator' },
  { label: 'Manufacturing', href: '#manufacturing' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#D8DCE3] no-print">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          aria-label="Karma Enterprises Home"
          className="whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B5121B]"
        >
          <KaynoxxLogo compact />
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#3A3F47]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#B5121B] hover:text-[#1F2124] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B5121B]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile/Tablet Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onRequestQuote}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F2124]"
          >
            Request Quote
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-[2px] text-[#1F2124] hover:bg-[#F4F5F7] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#D8DCE3] px-4 sm:px-6 py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3.5 text-base font-medium text-[#1F2124] border-b border-[#ECEEF2] hover:text-[#B5121B] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onRequestQuote();
              }}
              className="mt-4 sm:hidden w-full py-3 px-4 text-sm font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors cursor-pointer"
            >
              Request Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
