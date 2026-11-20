import React from 'react';

const ENGINEERING_PILLARS = [
  {
    num: '01.',
    title: 'In-House Geared & Gearless Production',
    body: 'Our Ahmedabad facility accommodates the entire in-house workforce and CNC machining lines for both KING worm-geared gearboxes and PRINCE permanent-magnet gearless stators.',
  },
  {
    num: '02.',
    title: 'Thermal & Full-Load Quality Inspection',
    body: 'Every traction machine undergoes infrared thermal profiling, acoustic balance verification, and brake torque calibration prior to dispatch to guarantee vibration-free shaft operation.',
  },
  {
    num: '03.',
    title: 'Self-Observation & Engineering Discipline',
    body: 'Founded in 2024 on a multidisciplinary Business Rule-Book, KAYNOXX continuously audits machining tolerances and implements global traction innovations rapidly.',
  },
  {
    num: '04.',
    title: 'Dedicated After-Sales Service Engineers',
    body: 'Technical support continues well beyond commissioning with dedicated field engineers assisting elevator OEMs and contractors across India.',
  },
];

export const ManufacturingSection: React.FC = () => {
  return (
    <section id="manufacturing" className="scroll-mt-16 bg-[#F4F5F7] py-14 sm:py-16 lg:py-20 border-b border-[#D8DCE3]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header echoing PDF Page 2 & Page 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-8 sm:pb-10 border-b border-[#CFD4DC] items-end">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold text-[#5A606B] tracking-wide">
              Karma Enterprises · Founded 2024 · GIDC Naroda, Ahmedabad
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F2124] tracking-tight mt-1">
              In-House Manufacturing:{' '}
              <span className="text-[#B5121B]">Geared &amp; Gearless</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm lg:text-[15px] text-[#3A3F47] leading-relaxed">
              <strong className="font-semibold text-[#1F2124]">Karma Enterprises</strong> (makers of KAYNOXX™)
              was established in Ahmedabad, the industrial hub of Gujarat, with a clear mandate:
              manufacture precision prime-quality elevator traction machines at scale with
              uncompromising performance, ethics, and on-time delivery.
            </p>
          </div>
        </div>

        {/* Documentary Factory Contact-Sheet Plate Grid (Authentic Extracted PDF Pages 2 & 3 Photography) */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Primary Thermal QC Plate + Dual Rectangular Factory Plates */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <figure className="bg-white border border-[#D8DCE3] rounded-[2px] overflow-hidden">
              <div className="relative h-64 sm:h-80 overflow-hidden bg-[#181A1D]">
                <img
                  src="/assets/kaynoxx/factory/thermal-qc.jpg"
                  alt="KAYNOXX engineer performing infrared thermal quality inspection at 36.8 degrees Celsius on a blue traction machine housing"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-5">
                  <p className="font-mono text-[11px] text-white/80">
                    Fig. 01 · Infrared Thermal &amp; Load Verification
                  </p>
                  <p className="font-display text-2xl font-bold text-white leading-tight mt-0.5">
                    100% Thermal &amp; Load Inspection Before Dispatch
                  </p>
                </div>
              </div>
            </figure>

            {/* Bottom Dual Rectangular Factory Plates (No circular avatars) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
              <figure className="bg-white border border-[#D8DCE3] rounded-[2px] overflow-hidden flex flex-col">
                <div className="aspect-[16/10] bg-[#181A1D] overflow-hidden">
                  <img
                    src="/assets/kaynoxx/factory/production-batch.jpg"
                    alt="High-volume KAYNOXX geared traction machine production batch lined up for dispatch"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-[1.35]"
                  />
                </div>
                <figcaption className="p-4 flex-1">
                  <div className="font-mono text-[11px] text-[#6B7280]">Fig. 02 · Batch Dispatch</div>
                  <div className="font-display text-lg font-bold text-[#1F2124] mt-0.5">
                    High-Volume OEM Readiness
                  </div>
                  <p className="text-xs text-[#5A606B] mt-1 leading-relaxed">
                    Scaled assembly lines meeting multi-tower elevator schedules on time.
                  </p>
                </figcaption>
              </figure>

              <figure className="bg-white border border-[#D8DCE3] rounded-[2px] overflow-hidden flex flex-col">
                <div className="aspect-[16/10] bg-[#181A1D] overflow-hidden">
                  <img
                    src="/assets/kaynoxx/factory/cnc-vertical.jpg"
                    alt="CNC vertical machining of KAYNOXX elevator traction machine cast-iron housings"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-[1.35]"
                  />
                </div>
                <figcaption className="p-4 flex-1">
                  <div className="font-mono text-[11px] text-[#6B7280]">Fig. 03 · VMC Floor</div>
                  <div className="font-display text-lg font-bold text-[#1F2124] mt-0.5">
                    Precision CNC Machining
                  </div>
                  <p className="text-xs text-[#5A606B] mt-1 leading-relaxed">
                    Vertical machining centers holding tight bearing and shaft tolerances.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Right Column: Rotor Assembly Plate + 4 Editorial Engineering Pillars */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <figure className="bg-white border border-[#D8DCE3] rounded-[2px] overflow-hidden">
              <div className="h-52 relative bg-[#181A1D]">
                <img
                  src="/assets/kaynoxx/factory/machining-floor.jpg"
                  alt="In-house stator housing boring and laminated rotor assembly inside the KAYNOXX Ahmedabad plant"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 py-3">
                  <p className="font-mono text-[11px] text-white/80">Fig. 04 · Stator &amp; Rotor Line</p>
                  <p className="text-xs font-semibold text-white">
                    In-House Cast Housing &amp; Rotor Assembly · Ahmedabad
                  </p>
                </div>
              </div>
            </figure>

            <div className="flex flex-col gap-3 flex-1">
              {ENGINEERING_PILLARS.map((pillar) => (
                <article
                  key={pillar.num}
                  data-testid={`manufacturing-step-${pillar.num.replace('.', '')}`}
                  className="bg-white border border-[#D8DCE3] rounded-[2px] p-4 sm:px-5 flex-1 flex flex-col justify-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(31,33,36,0.16)] hover:border-[#9CA3AF]"
                >
                  <h3 className="text-sm font-semibold text-[#1F2124]">
                    <span className="font-mono text-[#B5121B] mr-1.5">{pillar.num}</span>{' '}
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#5A606B] mt-1 leading-relaxed">
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
