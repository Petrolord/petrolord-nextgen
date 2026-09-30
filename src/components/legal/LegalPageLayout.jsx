import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import { PublicPage, PublicBrandBar } from '@/components/public/PublicPage';

const LegalPageLayout = ({ title, lastUpdated, children, tocItems = [] }) => {
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Batch 6B: the legal pages render on the public frame (always light).
  // The print and contents buttons sit in the ink brand bar; the document
  // keeps its print variants.
  const header = (
    <PublicBrandBar>
      <Button variant="ghost" size="icon" onClick={handlePrint} className="hidden sm:flex" title="Print Policy" aria-label="Print policy">
        <Printer className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden"
        aria-label={mobileMenuOpen ? 'Close table of contents' : 'Open table of contents'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
    </PublicBrandBar>
  );

  return (
    <PublicPage testId="legal-theme-scope" header={header} footer={<Footer />}>
      <Helmet>
        <title>{title} | Petrolord NextGen</title>
      </Helmet>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full pt-8 pb-16 px-4 sm:px-6 lg:px-8 flex gap-12 relative">

        {/* Desktop Sidebar TOC */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-8rem)] shrink-0 print:hidden">
          <div className="h-full flex flex-col">
            <h3 className="text-sm font-bold text-pl-muted uppercase tracking-wider mb-4">Table of Contents</h3>
            <ScrollArea className="flex-1 pr-4">
              <nav className="space-y-1" aria-label="Table of contents">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    aria-current={activeSection === item.id ? 'location' : undefined}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors border-l-2",
                      activeSection === item.id
                        ? "bg-pl-surface text-pl-primary-text border-pl-primary font-semibold"
                        : "text-pl-muted border-transparent hover:text-pl-text hover:bg-pl-sunken"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Mobile Sidebar (Drawer) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 lg:hidden print:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-16 bottom-0 w-3/4 max-w-xs bg-pl-raised border-l border-pl-border shadow-pl-lg p-6 overflow-y-auto animate-in slide-in-from-right">
              <h3 className="text-sm font-bold text-pl-muted uppercase tracking-wider mb-4">Jump to Section</h3>
              <nav className="space-y-2" aria-label="Jump to section">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    aria-current={activeSection === item.id ? 'location' : undefined}
                    className={cn(
                      "w-full text-left px-3 py-3 text-sm rounded-md flex items-center justify-between",
                      activeSection === item.id
                        ? "bg-pl-surface text-pl-primary-text font-semibold"
                        : "text-pl-text hover:bg-pl-sunken"
                    )}
                  >
                    {item.label}
                    {activeSection === item.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 min-w-0 print:w-full print:pt-0">
          <div className="mb-8 border-b border-pl-border pb-8 print:border-black">
            <h1 className="font-pl-display text-4xl sm:text-5xl font-semibold text-pl-text mb-4 tracking-tight print:text-black">{title}</h1>
            <div className="flex items-center gap-2 text-pl-muted text-sm print:text-gray-600">
              <span>Last Updated:</span>
              <span className="text-pl-text font-pl-mono print:text-black">{lastUpdated}</span>
            </div>
          </div>

          <div className="max-w-none">
            {children}
          </div>
        </div>
      </div>
    </PublicPage>
  );
};

export default LegalPageLayout;