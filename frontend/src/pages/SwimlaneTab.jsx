import { useState } from "react";

// Initial lane/card data — same content as the original static mockup,
// now driven by state so cards can move between lanes.
const initialLanes = [
  {
    id: "lane-1",
    name: "HR Manager",
    accent: "text-primary",
    cards: [
      {
        id: "card-1",
        badge: "Manual Step",
        badgeStyle: "bg-surface-container-high text-on-surface-variant",
        title: "Document Review",
        desc: "Verify I-9 and W-4 submissions from candidate portal.",
      },
    ],
  },
  {
    id: "lane-2",
    name: "IT Department",
    accent: "text-secondary",
    cards: [
      {
        id: "card-2",
        badge: "Automated",
        badgeStyle: "bg-primary-container text-on-primary-container",
        icon: "smart_toy",
        title: "Finalize Setup",
        desc: "Provision Google Workspace and Slack accounts via API.",
      },
    ],
  },
  {
    id: "lane-3",
    name: "Employee",
    accent: "text-tertiary",
    cards: [
      {
        id: "card-3",
        badge: "User Action",
        badgeStyle: "bg-surface-container-high text-on-surface-variant",
        title: "Login & Orientation",
        desc: "First login and complete security training modules.",
      },
    ],
  },
];

function Card({ card, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      className="w-64 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing hover:border-primary shrink-0"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 font-mono-sm text-mono-sm rounded flex items-center gap-1 ${card.badgeStyle}`}>
          {card.icon && <span className="material-symbols-outlined text-[14px]">{card.icon}</span>}
          {card.badge}
        </span>
        <span className="material-symbols-outlined text-outline-variant text-[18px]">drag_indicator</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{card.title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{card.desc}</p>
    </div>
  );
}

function Lane({ lane, onDragStart, onDrop, isDropTarget, onDragEnter, onDragLeave }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => onDragEnter(lane.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, lane.id)}
      className={`flex w-full min-w-[800px] relative border rounded-lg bg-surface-bright bg-opacity-50 transition-colors
        ${isDropTarget ? "border-primary border-2 bg-primary-container/10" : "border-outline-variant"}`}
    >
      <div className="w-48 border-r border-outline-variant bg-surface-container-lowest p-4 flex flex-col justify-center items-start shrink-0 rounded-l-lg">
        <span className={`font-label-caps text-label-caps uppercase tracking-wider ${lane.accent}`}>
          {lane.id.replace("lane-", "Lane ")}
        </span>
        <span className="font-headline-md text-headline-md text-on-surface mt-1">{lane.name}</span>
      </div>
      <div className="flex-1 p-6 flex items-center gap-6 overflow-x-auto min-h-[140px]">
        {lane.cards.length === 0 && (
          <span className="text-sm text-outline italic">Drop a card here</span>
        )}
        {lane.cards.map((card) => (
          <Card key={card.id} card={card} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}

export default function SwimlaneTab() {
  const [lanes, setLanes] = useState(initialLanes);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dropTargetLaneId, setDropTargetLaneId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDragStart = (event, cardId) => {
    setDraggedCardId(cardId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event, targetLaneId) => {
    event.preventDefault();
    setDropTargetLaneId(null);
    if (!draggedCardId) return;

    setLanes((prevLanes) => {
      let movedCard = null;
      const withoutCard = prevLanes.map((lane) => {
        const found = lane.cards.find((c) => c.id === draggedCardId);
        if (found) movedCard = found;
        return { ...lane, cards: lane.cards.filter((c) => c.id !== draggedCardId) };
      });
      if (!movedCard) return prevLanes;

      return withoutCard.map((lane) =>
        lane.id === targetLaneId ? { ...lane, cards: [...lane.cards, movedCard] } : lane
      );
    });

    setDraggedCardId(null);
  };

  return (
    <div className="flex flex-1 pt-14 h-full relative">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-[68px] left-3 z-40 bg-primary text-on-primary p-2 rounded-full shadow-sm"
        aria-label="Open workflow panel"
      >
        <span className="material-symbols-outlined text-[20px]">menu</span>
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-surface-container-lowest dark:bg-surface-dim border-r border-outline-variant dark:border-outline fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-[240px] flex flex-col p-4 z-40 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim">Workflow Engine</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">AI Logic Extraction</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-outline">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <a className="flex items-center gap-3 p-3 bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary font-bold rounded-lg scale-[0.98] transition-transform" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-caps text-label-caps">New Workflow</span>
          </a>
          <a className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-inverse-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_tree</span>
            <span className="font-label-caps text-label-caps">Saved Logic</span>
          </a>
          <a className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-inverse-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard_customize</span>
            <span className="font-label-caps text-label-caps">Templates</span>
          </a>
          <a className="flex items-center gap-3 p-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-inverse-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-lg" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
            <span className="font-label-caps text-label-caps">Settings</span>
          </a>
        </nav>
        <div className="mt-auto">
          <button className="w-full bg-primary-container text-on-primary-container font-label-caps text-label-caps py-3 rounded-lg hover:bg-secondary-container transition-colors shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>generating_tokens</span>
            Generate Workflow
          </button>
          <div className="mt-4 flex items-center gap-3 pt-4 border-t border-outline-variant">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                alt="User profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDayp6IAthSMuAGTbHvEzCboBAHDHjqzioiknJV-MFweOUOWc9DOUVwp4r9plhHxX3SEph0jK-tp5Z_uYDPIP9c9krBB9yybNHhoIFofc1xa0Tn0nW1SBECxmh5QMdiuRbi0OCDp1MwSZjZ787PNrrOsOHlDQwN2CXsbNec3Dk6x1gegu1-slHpTaGRc8FIYadoXhB6OMBH2ya3lppL75FM_LujkwzwNFO121xaqlRI-cFUAhuUvFcH"
              />
            </div>
            <span className="font-label-caps text-label-caps text-on-surface">User Profile</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-[240px] bg-background micro-dot-grid relative overflow-auto p-4 md:p-8">
        <div className="max-w-[1200px] mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="border-b border-outline-variant p-6 bg-surface-container-lowest flex justify-between items-center">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Employee Onboarding SOP</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Drag cards between lanes to reorder steps</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container font-mono-sm text-mono-sm text-on-surface-variant rounded-full border border-outline-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Validated
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative overflow-x-auto p-6 gap-6">
            {lanes.map((lane) => (
              <Lane
                key={lane.id}
                lane={lane}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                isDropTarget={dropTargetLaneId === lane.id}
                onDragEnter={setDropTargetLaneId}
                onDragLeave={() => setDropTargetLaneId(null)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
