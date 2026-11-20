import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ChevronDown, Mail, Phone, Search, X } from 'lucide-react';
import { FAQ_CATEGORIES, KAYNOXX_FAQS } from '../data/faqs';
import { COMPANY_INFO } from '../data/machines';
import {
  countFaqsByCategory,
  FaqFilterCategory,
  filterFaqs,
  formatFaqCategoryLabel,
} from '../utils/faqEngine';

interface FaqSectionProps {
  onContactSupport: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onContactSupport }) => {
  const [activeCategory, setActiveCategory] = useState<FaqFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>([KAYNOXX_FAQS[0].id]);

  const categoryCounts = useMemo(() => countFaqsByCategory(KAYNOXX_FAQS), []);

  const visibleFaqs = useMemo(
    () => filterFaqs(KAYNOXX_FAQS, activeCategory, searchQuery),
    [activeCategory, searchQuery]
  );

  const allVisibleOpen =
    visibleFaqs.length > 0 && visibleFaqs.every((item) => openIds.includes(item.id));

  const handleToggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (category: FaqFilterCategory) => {
    setActiveCategory(category);
    const nextList = filterFaqs(KAYNOXX_FAQS, category, searchQuery);
    if (nextList.length > 0 && !nextList.some((item) => openIds.includes(item.id))) {
      setOpenIds([nextList[0].id]);
    }
  };

  const handleToggleAllVisible = () => {
    if (allVisibleOpen) {
      const visibleSet = new Set(visibleFaqs.map((item) => item.id));
      setOpenIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      const merged = new Set([...openIds, ...visibleFaqs.map((item) => item.id)]);
      setOpenIds(Array.from(merged));
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setOpenIds([KAYNOXX_FAQS[0].id]);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-16 bg-white py-14 sm:py-16 lg:py-20 border-b border-[#D8DCE3]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Column: Section Intro + Direct Engineering Desk */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-xs font-semibold text-[#5A606B] tracking-wide">
                Karma Enterprises · After-Sales &amp; Engineering Desk
              </p>
              <h2
                id="faq-heading"
                className="font-display text-3xl lg:text-4xl font-bold text-[#1F2124] tracking-tight mt-1 text-balance"
              >
                Frequently Asked <span className="text-[#B5121B]">Questions</span>
              </h2>
              <p className="text-sm lg:text-[15px] text-[#3A3F47] mt-3 leading-relaxed">
                Technical guidance on preventive maintenance, factory warranty coverage, and VVVF
                commissioning support for KAYNOXX™ KING geared and PRINCE gearless traction
                machines.
              </p>
            </div>

            {/* Direct Technical Support Box (Single-level elevation, hairline border) */}
            <div className="bg-[#F4F5F7] border border-[#D8DCE3] rounded-[2px] p-5 space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#1F2124]">
                  Need Shaft-Specific Assistance?
                </h3>
                <p className="text-xs text-[#5A606B] mt-1 leading-relaxed">
                  Share your nameplate serial number, VVVF inverter model, or shaft layout directly
                  with our GIDC Naroda service engineers.
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-[#D8DCE3] text-xs">
                <a
                  href={COMPANY_INFO.phoneHref}
                  className="flex items-center gap-2.5 font-mono font-semibold text-[#1F2124] hover:text-[#B5121B] transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#B5121B] shrink-0" aria-hidden="true" />
                  <span>{COMPANY_INFO.phone}</span>
                </a>
                <a
                  href={COMPANY_INFO.emailHref}
                  className="flex items-center gap-2.5 font-medium text-[#3A3F47] hover:text-[#B5121B] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#B5121B] shrink-0" aria-hidden="true" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={onContactSupport}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#1F2124] hover:bg-[#B5121B] rounded-[2px] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5121B]"
              >
                <span>Ask Our Engineering Desk</span>
                <ArrowDownRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Column: Category Tabs, Search, and Accessible FAQ Accordion */}
          <div className="lg:col-span-8">
            {/* Filter Controls Bar */}
            <div className="flex flex-col gap-4 pb-6 border-b border-[#E2E5EA]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Interactive Category Filter Buttons */}
                <div
                  role="group"
                  aria-label="Filter questions by topic"
                  className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F5F7] border border-[#D8DCE3] rounded-[2px]"
                >
                  {FAQ_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`px-3 py-2 text-xs font-semibold rounded-[2px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5121B] ${
                          isActive
                            ? 'bg-white text-[#1F2124] border border-[#D8DCE3]'
                            : 'text-[#5A606B] hover:text-[#1F2124] border border-transparent'
                        }`}
                      >
                        <span>{cat.label}</span>{' '}
                        <span
                          className={`ml-1 font-mono tabular-nums ${
                            isActive ? 'text-[#B5121B]' : 'text-[#6B7280]'
                          }`}
                        >
                          ({categoryCounts[cat.id]})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Expand / Collapse All Toggle */}
                {visibleFaqs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleAllVisible}
                    className="self-start sm:self-auto px-3 py-2 text-xs font-semibold text-[#3A3F47] hover:text-[#B5121B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5121B]"
                  >
                    {allVisibleOpen ? 'Collapse All' : 'Expand All'}
                  </button>
                )}
              </div>

              {/* Keyword Search Field */}
              <div className="relative">
                <label htmlFor="faq-search" className="sr-only">
                  Search KAYNOXX maintenance, warranty, or technical support questions
                </label>
                <Search
                  className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="faq-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, e.g. gear oil, brake 110V, warranty, VVVF, spares..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#C8CDD6] rounded-[2px] text-[#1F2124] placeholder:text-[#6B7280] focus:outline-none focus:border-[#B5121B]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear FAQ search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center rounded-[2px] text-[#5A606B] hover:text-[#1F2124] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* FAQ Accordion List or Empty State */}
            {visibleFaqs.length === 0 ? (
              <div
                data-testid="faq-empty-state"
                className="py-12 px-4 sm:px-6 text-center border-b border-[#E2E5EA]"
              >
                <p className="font-display text-2xl font-bold text-[#1F2124]">
                  No Matching Technical Questions
                </p>
                <p className="text-sm text-[#5A606B] mt-1.5 max-w-md mx-auto">
                  No FAQ entries matched <span className="font-mono text-[#1F2124]">"{searchQuery}"</span>.
                  Reset your filters or contact our engineering desk directly.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2.5 text-xs font-semibold text-white bg-[#1F2124] hover:bg-[#B5121B] rounded-[2px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                data-testid="faq-list"
                className="divide-y divide-[#E2E5EA] border-b border-[#E2E5EA]"
              >
                {visibleFaqs.map((faq, idx) => {
                  const isOpen = openIds.includes(faq.id);
                  const buttonId = `faq-trigger-${faq.id}`;
                  const panelId = `faq-panel-${faq.id}`;
                  const indexLabel = `${String(idx + 1).padStart(2, '0')}.`;

                  return (
                    <div key={faq.id} className="py-1">
                      <h3 className="m-0">
                        <button
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => handleToggleItem(faq.id)}
                          className="w-full py-4 sm:py-5 text-left flex items-start justify-between gap-4 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5121B]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A606B] font-sans font-medium mb-1">
                              <span className="font-mono font-semibold text-[#B5121B] tabular-nums">
                                {indexLabel}
                              </span>
                              <span>{formatFaqCategoryLabel(faq.category)}</span>
                              <span aria-hidden="true">·</span>
                              <span>{faq.seriesScope}</span>
                            </div>
                            <span className="block font-sans text-[15px] sm:text-base font-semibold text-[#1F2124] group-hover:text-[#B5121B] transition-colors duration-150 leading-snug">
                              {faq.question}
                            </span>
                          </div>

                          <span
                            aria-hidden="true"
                            className={`mt-1 w-8 h-8 rounded-[2px] inline-flex items-center justify-center shrink-0 transition-colors duration-150 ${
                              isOpen
                                ? 'bg-[#B5121B] text-white'
                                : 'bg-[#F4F5F7] text-[#3A3F47] group-hover:text-[#1F2124]'
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-150 ${
                                isOpen ? 'rotate-180' : 'rotate-0'
                              }`}
                            />
                          </span>
                        </button>
                      </h3>

                      {isOpen && (
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          className="pb-5 pr-2 sm:pr-12 space-y-3"
                        >
                          <p className="text-sm sm:text-[15px] text-[#3A3F47] leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.specNote && (
                            <p className="pt-2.5 border-t border-[#ECEEF2] font-mono text-xs text-[#5A606B] leading-relaxed tabular-nums">
                              {faq.specNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
