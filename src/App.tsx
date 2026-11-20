import { useMemo, useState } from 'react';
import { TRACTION_MACHINES, TractionMachine } from './data/machines';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveDriveSimulator } from './components/LiveDriveSimulator';
import { MachineCatalog } from './components/MachineCatalog';
import { ShaftConfigurator } from './components/ShaftConfigurator';
import { ManufacturingSection } from './components/ManufacturingSection';
import { FaqSection } from './components/FaqSection';
import { RfqContactSection } from './components/RfqContactSection';
import { Footer } from './components/Footer';
import { MachineDetailModal } from './components/MachineDetailModal';
import { CompareDrawer } from './components/CompareDrawer';

export default function App() {
  const [activeMachine, setActiveMachine] = useState<TractionMachine | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState<boolean>(false);
  const [quoteModels, setQuoteModels] = useState<string[]>([]);
  const [quoteLoadKg, setQuoteLoadKg] = useState<number | undefined>(undefined);
  const [quoteTravelM, setQuoteTravelM] = useState<number | undefined>(undefined);

  const comparedMachines = useMemo(
    () =>
      compareIds
        .map((id) => TRACTION_MACHINES.find((m) => m.id === id))
        .filter((m): m is TractionMachine => Boolean(m)),
    [compareIds]
  );

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleCompare = (machineId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(machineId)) {
        return prev.filter((id) => id !== machineId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, machineId];
    });
  };

  const handleAddToQuote = (modelName: string, loadKg?: number, travelM?: number) => {
    setQuoteModels((prev) => (prev.includes(modelName) ? prev : [...prev, modelName]));
    if (loadKg) setQuoteLoadKg(loadKg);
    if (travelM) setQuoteTravelM(travelM);
    scrollToSection('contact');
  };

  const handleQuoteMultiple = (models: string[]) => {
    setQuoteModels((prev) => {
      const next = [...prev];
      for (const m of models) {
        if (!next.includes(m)) next.push(m);
      }
      return next;
    });
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1F2124]">
      <Navbar onRequestQuote={() => scrollToSection('contact')} />

      <main className="flex-1">
        <HeroSection
          onJumpConfigurator={() => scrollToSection('configurator')}
          onJumpCatalog={() => scrollToSection('catalog')}
        />

        <LiveDriveSimulator />

        <MachineCatalog
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onInspectMachine={setActiveMachine}
          onAddToQuote={(modelName) => handleAddToQuote(modelName)}
        />

        <ShaftConfigurator
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onInspectMachine={setActiveMachine}
          onAddToQuote={handleAddToQuote}
        />

        <ManufacturingSection />

        <FaqSection onContactSupport={() => scrollToSection('contact')} />

        <RfqContactSection
          preselectedModels={quoteModels}
          prefillLoadKg={quoteLoadKg}
          prefillTravelM={quoteTravelM}
          onRemovePreselectedModel={(model) =>
            setQuoteModels((prev) => prev.filter((m) => m !== model))
          }
          onAddPreselectedModel={(model) =>
            setQuoteModels((prev) => (prev.includes(model) ? prev : [...prev, model]))
          }
          onClearPreselectedModels={() => setQuoteModels([])}
        />
      </main>

      <Footer />

      <MachineDetailModal
        machine={activeMachine}
        isCompared={activeMachine ? compareIds.includes(activeMachine.id) : false}
        compareFull={compareIds.length >= 3}
        onClose={() => setActiveMachine(null)}
        onToggleCompare={handleToggleCompare}
        onRequestQuote={(modelName) => handleAddToQuote(modelName)}
      />

      <CompareDrawer
        machines={comparedMachines}
        isOpen={compareOpen}
        onOpen={() => setCompareOpen(true)}
        onClose={() => setCompareOpen(false)}
        onRemove={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
        onClearAll={() => {
          setCompareIds([]);
          setCompareOpen(false);
        }}
        onRequestQuoteAll={handleQuoteMultiple}
      />
    </div>
  );
}
