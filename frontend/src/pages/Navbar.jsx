import { useState } from "react";

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-surface-container-lowest dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex justify-between items-center h-14 px-4 md:px-6 w-full fixed top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <div
          onClick={() => goTo("flowchart")}
          className="font-display text-headline-md text-primary dark:text-inverse-primary tracking-tighter shrink-0 cursor-pointer"
        >
          LogicFlow AI
        </div>
        <div className="h-6 w-px bg-outline-variant mx-2 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 group cursor-pointer hover:bg-surface-container-low px-2 py-1 rounded transition-colors min-w-0">
          <span className="font-headline-md text-headline-md text-on-surface truncate">Employee Onboarding SOP</span>
          <span className="material-symbols-outlined text-[16px] text-outline opacity-0 group-hover:opacity-100 transition-opacity shrink-0">edit</span>
        </div>
      </div>

      {/* Desktop tab nav */}
      <nav className="hidden md:flex items-center gap-6 h-full">
        <button
          onClick={() => goTo("flowchart")}
          className={`h-full font-label-caps text-label-caps px-2 transition-all ${
            activeTab === "flowchart"
              ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1"
              : "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed"
          }`}
        >
          Flowchart
        </button>
        <button
          onClick={() => goTo("swimlane")}
          className={`h-full font-label-caps text-label-caps px-2 transition-all ${
            activeTab === "swimlane"
              ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1"
              : "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed"
          }`}
        >
          Swimlane
        </button>
      </nav>

      <div className="flex items-center gap-1 md:gap-3">
        <button className="hidden sm:flex text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
        <button className="hidden sm:flex text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
        <button className="hidden md:inline-flex font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-variant px-4 py-2 rounded-lg transition-colors border border-outline-variant">
          Export
        </button>
        <button
          onClick={() => goTo("login")}
          className="font-label-caps text-label-caps bg-primary text-on-primary hover:bg-primary-container px-3 md:px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span className="hidden sm:inline">Sign In</span>
        </button>

        {/* Mobile menu toggle — only thing that reveals Flowchart/Swimlane on small screens */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[20px]">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-surface-container-lowest dark:bg-surface-dim border-b border-outline-variant dark:border-outline shadow-sm flex flex-col p-2 z-50">
          <button
            onClick={() => goTo("flowchart")}
            className={`text-left px-4 py-3 rounded-lg font-label-caps text-label-caps ${
              activeTab === "flowchart"
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            Flowchart
          </button>
          <button
            onClick={() => goTo("swimlane")}
            className={`text-left px-4 py-3 rounded-lg font-label-caps text-label-caps ${
              activeTab === "swimlane"
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            Swimlane
          </button>
          <button className="text-left px-4 py-3 rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-low">
            Export
          </button>
        </div>
      )}
    </header>
  );
}