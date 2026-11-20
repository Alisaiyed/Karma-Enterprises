import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileDown, Mail, MapPin, Phone, Plus, X } from 'lucide-react';
import { COMPANY_INFO, TRACTION_MACHINES } from '../data/machines';
import { RfqPayload, validateRfqForm } from '../utils/machineEngine';

interface RfqContactSectionProps {
  preselectedModels: string[];
  prefillLoadKg?: number;
  prefillTravelM?: number;
  onRemovePreselectedModel: (model: string) => void;
  onAddPreselectedModel: (model: string) => void;
  onClearPreselectedModels: () => void;
}

export const RfqContactSection: React.FC<RfqContactSectionProps> = ({
  preselectedModels,
  prefillLoadKg,
  prefillTravelM,
  onRemovePreselectedModel,
  onAddPreselectedModel,
  onClearPreselectedModels,
}) => {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [dutyLoadKg, setDutyLoadKg] = useState('680');
  const [travelHeightM, setTravelHeightM] = useState('30');
  const [notes, setNotes] = useState('');
  const [modelPicker, setModelPicker] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof RfqPayload, string>>>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<RfqPayload | null>(null);

  useEffect(() => {
    if (prefillLoadKg) setDutyLoadKg(String(prefillLoadKg));
  }, [prefillLoadKg]);

  useEffect(() => {
    if (prefillTravelM) setTravelHeightM(String(prefillTravelM));
  }, [prefillTravelM]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: RfqPayload = {
      fullName,
      company,
      email,
      phone,
      city,
      selectedModels: preselectedModels,
      dutyLoadKg,
      travelHeightM,
      notes,
    };

    const result = validateRfqForm(payload);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    const refCode = `KNX-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setSubmittedRef(refCode);
    setSubmittedSnapshot(payload);
  };

  const handleResetForm = () => {
    setSubmittedRef(null);
    setSubmittedSnapshot(null);
    setFullName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setCity('');
    setNotes('');
    onClearPreselectedModels();
  };

  return (
    <section
      id="contact"
      className="scroll-mt-16 bg-[#181A1D] shaft-grid-bg text-white py-14 sm:py-16 lg:py-20 border-b border-white/10"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Official Ahmedabad Plant Contact Details (PDF Page 24) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-semibold text-[#F87171] tracking-wide">
                Karma Enterprises · Direct Factory Sales &amp; OEM Desk
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1">
                Contact <span className="text-[#B5121B]">Karma Enterprises</span>
              </h2>
              <p className="text-sm text-[#D1D5DB] mt-3 leading-relaxed">
                Share your shaft dimensions, rated capacity, and delivery timeline. Our engineering
                team in Ahmedabad responds with verified KAYNOXX GA drawings, brake compatibility, and factory pricing.
              </p>
            </div>

            <div className="space-y-5 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#B5121B] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold text-white/70">Manufacturing Plant Address</div>
                  <p className="text-sm text-white mt-0.5 leading-relaxed">
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#B5121B] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold text-white/70">Direct Sales &amp; Technical Desk</div>
                  <a
                    href={COMPANY_INFO.phoneHref}
                    className="font-mono text-base font-semibold text-white hover:text-[#F87171] transition-colors mt-0.5 inline-block tabular-nums"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#B5121B] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold text-white/70">Official Email</div>
                  <a
                    href={COMPANY_INFO.emailHref}
                    className="text-sm font-medium text-white hover:text-[#F87171] transition-colors mt-0.5 inline-block"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Official PDF Brochure Download Card */}
            <div className="bg-[#23262B] border border-white/15 rounded-[2px] p-5">
              <div className="font-display text-xl font-bold text-white">
                Complete 24-Page Engineering Catalog (PDF)
              </div>
              <p className="text-xs text-[#D1D5DB] mt-1 leading-relaxed">
                Download the official Karma Enterprises · KAYNOXX brochure with all 6 KING geared
                and 12 PRINCE gearless machines, VVVF motor tables, and orthographic CAD dimensions.
              </p>
              <a
                href={COMPANY_INFO.catalogPdfUrl}
                download="KAYNOXX-Elevator-Traction-Machines-Catalog.pdf"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Official PDF Catalog</span>
              </a>
            </div>
          </div>

          {/* Right Column: Validated B2B Technical Quote Form */}
          <div className="lg:col-span-7 bg-white text-[#1F2124] rounded-[2px] border border-[#D8DCE3] p-4 sm:p-8">
            {submittedRef && submittedSnapshot ? (
              <div data-testid="rfq-confirmation" className="py-6 space-y-5">
                <div className="flex items-center gap-3 text-[#15803D]">
                  <CheckCircle2 className="w-7 h-7 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#5A606B]">Technical Inquiry Logged</p>
                    <h3 className="font-display text-2xl font-bold text-[#1F2124]">
                      Quote Request Received · Ref {submittedRef}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[#3A3F47] leading-relaxed">
                  Thank you, <strong className="text-[#1F2124]">{submittedSnapshot.fullName}</strong> ({submittedSnapshot.company}).
                  Your specification inquiry has been prepared for our Ahmedabad engineering desk. For urgent project timelines,
                  call <a href={COMPANY_INFO.phoneHref} className="font-mono font-semibold text-[#B5121B] underline">{COMPANY_INFO.phone}</a> quoting reference <span className="font-mono font-semibold">{submittedRef}</span>.
                </p>

                <dl className="bg-[#F4F5F7] border border-[#E2E5EA] rounded-md p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-[#6B7280]">Contact Email &amp; Phone</dt>
                    <dd className="font-mono text-[#1F2124] mt-0.5">
                      {submittedSnapshot.email} · {submittedSnapshot.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6B7280]">Project Location</dt>
                    <dd className="font-medium text-[#1F2124] mt-0.5">{submittedSnapshot.city}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6B7280]">Shaft Spec</dt>
                    <dd className="font-mono text-[#1F2124] mt-0.5">
                      {submittedSnapshot.dutyLoadKg} kg · {submittedSnapshot.travelHeightM} m travel
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6B7280]">Selected Models</dt>
                    <dd className="font-mono font-semibold text-[#B5121B] mt-0.5">
                      {submittedSnapshot.selectedModels.length > 0
                        ? submittedSnapshot.selectedModels.join(', ')
                        : 'Engineering team recommendation'}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1F2124] hover:bg-[#B5121B] rounded-md transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="pb-4 border-b border-[#ECEEF2]">
                  <h3 className="font-display text-2xl font-bold text-[#1F2124]">
                    Request Engineering Quote (RFQ)
                  </h3>
                  <p className="text-xs text-[#5A606B] mt-1">
                    Fields marked with * are required. Models selected from the catalog or configurator appear below automatically.
                  </p>
                </div>

                {/* Selected Models Selector */}
                <div>
                  <label htmlFor="rfq-model-picker" className="block text-xs font-semibold text-[#3A3F47] mb-1.5">
                    Selected KAYNOXX Model(s)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      id="rfq-model-picker"
                      value={modelPicker}
                      onChange={(e) => setModelPicker(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-white border border-[#C8CDD6] rounded-[2px] text-[#1F2124] focus:outline-none focus:border-[#B5121B]"
                    >
                      <option value="">Add a KING or PRINCE model...</option>
                      {TRACTION_MACHINES.map((m) => (
                        <option key={m.id} value={m.model}>
                          {m.model} ({m.category === 'geared' ? 'Geared' : 'Gearless'} · {m.dutyLoadMaxKg} kg)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (modelPicker) {
                          onAddPreselectedModel(modelPicker);
                          setModelPicker('');
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-semibold text-[#1F2124] bg-[#F4F5F7] hover:bg-[#E2E5EA] border border-[#C8CDD6] rounded-[2px] cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {preselectedModels.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2" data-testid="rfq-selected-models">
                      {preselectedModels.map((model) => (
                        <span
                          key={model}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold bg-[#F4F5F7] border border-[#D4D8DF] rounded text-[#1F2124]"
                        >
                          <span>{model}</span>
                          <button
                            type="button"
                            onClick={() => onRemovePreselectedModel(model)}
                            aria-label={`Remove ${model} from quote list`}
                            className="text-[#5A606B] hover:text-[#B5121B] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rfq-fullname" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="rfq-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Patel"
                      aria-invalid={Boolean(errors.fullName)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border text-[#1F2124] focus:outline-none ${
                        errors.fullName ? 'border-[#B5121B] bg-[#FEF2F2]' : 'border-[#D4D8DF] focus:border-[#B5121B]'
                      }`}
                    />
                    {errors.fullName && (
                      <p role="alert" className="text-xs text-[#B5121B] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rfq-company" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      Company / Elevator OEM *
                    </label>
                    <input
                      id="rfq-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Elevators Pvt Ltd"
                      aria-invalid={Boolean(errors.company)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border text-[#1F2124] focus:outline-none ${
                        errors.company ? 'border-[#B5121B] bg-[#FEF2F2]' : 'border-[#D4D8DF] focus:border-[#B5121B]'
                      }`}
                    />
                    {errors.company && (
                      <p role="alert" className="text-xs text-[#B5121B] mt-1">{errors.company}</p>
                    )}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rfq-email" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      Business Email *
                    </label>
                    <input
                      id="rfq-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border text-[#1F2124] focus:outline-none ${
                        errors.email ? 'border-[#B5121B] bg-[#FEF2F2]' : 'border-[#D4D8DF] focus:border-[#B5121B]'
                      }`}
                    />
                    {errors.email && (
                      <p role="alert" className="text-xs text-[#B5121B] mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rfq-phone" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="rfq-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98250 XXXXX"
                      aria-invalid={Boolean(errors.phone)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border text-[#1F2124] focus:outline-none ${
                        errors.phone ? 'border-[#B5121B] bg-[#FEF2F2]' : 'border-[#D4D8DF] focus:border-[#B5121B]'
                      }`}
                    />
                    {errors.phone && (
                      <p role="alert" className="text-xs text-[#B5121B] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* City, Load, Travel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="rfq-city" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      City / Project Site *
                    </label>
                    <input
                      id="rfq-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ahmedabad"
                      aria-invalid={Boolean(errors.city)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-md border text-[#1F2124] focus:outline-none ${
                        errors.city ? 'border-[#B5121B] bg-[#FEF2F2]' : 'border-[#D4D8DF] focus:border-[#B5121B]'
                      }`}
                    />
                    {errors.city && (
                      <p role="alert" className="text-xs text-[#B5121B] mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rfq-load" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      Duty Load (kg)
                    </label>
                    <input
                      id="rfq-load"
                      type="number"
                      min={200}
                      max={5000}
                      value={dutyLoadKg}
                      onChange={(e) => setDutyLoadKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono rounded-md border border-[#D4D8DF] text-[#1F2124] focus:outline-none focus:border-[#B5121B]"
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-travel" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                      Travel Height (m)
                    </label>
                    <input
                      id="rfq-travel"
                      type="number"
                      min={5}
                      max={100}
                      value={travelHeightM}
                      onChange={(e) => setTravelHeightM(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono rounded-md border border-[#D4D8DF] text-[#1F2124] focus:outline-none focus:border-[#B5121B]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="rfq-notes" className="block text-xs font-semibold text-[#3A3F47] mb-1">
                    Project Quantity, Brake Voltage, or Shaft Notes
                  </label>
                  <textarea
                    id="rfq-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify required units, preferred sheave diameter, VVVF inverter compatibility, or delivery date..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#D4D8DF] text-[#1F2124] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-[#6B7280]">
                    Response within 1 business day from GIDC Naroda plant.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Submit Technical Quote Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
