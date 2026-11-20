import React from 'react';
import { COMPANY_INFO } from '../data/machines';
import { KaynoxxLogo } from './KaynoxxLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-[#3A3F47] py-10 sm:py-12 border-t border-[#D8DCE3] no-print">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#E2E5EA]">
          <div className="space-y-3">
            <KaynoxxLogo />
            <p className="text-xs text-[#5A606B] max-w-md leading-relaxed">
              Karma Enterprises manufactures precision KAYNOXX™ geared (KING Series) and gearless
              (PRINCE Series) elevator traction machines in-house in Ahmedabad, Gujarat, India.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm font-medium text-[#3A3F47]">
            <a href="#catalog" className="hover:text-[#B5121B] transition-colors">
              Catalog
            </a>
            <a href="#configurator" className="hover:text-[#B5121B] transition-colors">
              Configurator
            </a>
            <a href="#simulator" className="hover:text-[#B5121B] transition-colors">
              Drive Simulator
            </a>
            <a href="#manufacturing" className="hover:text-[#B5121B] transition-colors">
              Manufacturing
            </a>
            <a href="#faq" className="hover:text-[#B5121B] transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#B5121B] transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} Karma Enterprises · KAYNOXX™ Elevator Traction Machine</span>
            <span aria-hidden="true">·</span>
            <span>Make in India</span>
            <span aria-hidden="true">·</span>
            <span>GIDC Naroda, Ahmedabad</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
            <a href={COMPANY_INFO.phoneHref} className="hover:text-[#1F2124] transition-colors">
              {COMPANY_INFO.phone}
            </a>
            <a href={COMPANY_INFO.emailHref} className="hover:text-[#1F2124] transition-colors break-all">
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
