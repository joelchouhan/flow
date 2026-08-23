import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

// --- Draggable node palette definitions ---
const NODE_TYPES = [
  { type: "trigger", label: "Trigger", icon: "bolt", color: "#3525cd" },
  { type: "action", label: "Action", icon: "settings", color: "#4648d4" },
  { type: "condition", label: "Condition", icon: "call_split", color: "#a44100" },
  { type: "apiCall", label: "API Call", icon: "cloud", color: "#7e3000" },
];

let idCounter = 1;
const nextId = () => `node_${idCounter++}`;

// --- Mock AI generation stub ---
// Replace this with a real axios.post('/workflow/detect', { prompt }) call
// to your backend once it's wired up. Kept as a local stub so the UI is
// demonstrable without a live backend dependency.
function generateWorkflowFromPrompt() {
  const baseX = 80;
  const gapX = 220;
  const y = 160;

  return {
    nodes: [
      { id: nextId(), type: "default", position: { x: baseX, y }, data: { label: "Trigger: Order Placed", nodeType: "trigger" }, style: nodeStyle("trigger") },
      { id: nextId(), type: "default", position: { x: baseX + gapX, y }, data: { label: "Notify Vendor", nodeType: "action" }, style: nodeStyle("action") },
      { id: nextId(), type: "default", position: { x: baseX + gapX * 2, y }, data: { label: "Stock Physical?", nodeType: "condition" }, style: nodeStyle("condition") },
      { id: nextId(), type: "default", position: { x: baseX + gapX * 3, y }, data: { label: "Update Inventory", nodeType: "apiCall" }, style: nodeStyle("apiCall") },
    ],
    edges: [],
  };
}

function nodeStyle(nodeType) {
  const meta = NODE_TYPES.find((n) => n.type === nodeType) || NODE_TYPES[1];
  return {
    background: "#ffffff",
    border: `2px solid ${meta.color}`,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "#141b2b",
    minWidth: 160,
  };
}

function FlowchartCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#3525cd" } }, eds)),
    [setEdges]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const meta = NODE_TYPES.find((n) => n.type === nodeType);
      const newNode = {
        id: nextId(),
        type: "default",
        position,
        data: { label: meta.label, nodeType },
        style: nodeStyle(nodeType),
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setEditLabel(node.data.label);
  }, []);

  const saveNodeLabel = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, label: editLabel } } : n))
    );
    setSelectedNode(null);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const generated = generateWorkflowFromPrompt();
    setNodes(generated.nodes);
    setEdges(generated.edges);
  };

  const hasWorkflow = nodes.length > 0;

  return (
    <div className="flex flex-1 pt-14 h-screen relative">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-[68px] left-3 z-40 bg-primary text-on-primary p-2 rounded-full shadow-sm"
        aria-label="Open workflow panel"
      >
        <span className="material-symbols-outlined text-[20px]">menu</span>
      </button>

      {/* Sidebar backdrop (mobile only) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-surface-container-lowest dark:bg-surface-dim border-r border-outline-variant dark:border-outline fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-[280px] flex flex-col p-4 z-40 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Workflow Engine</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">AI Logic Extraction</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-outline">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* AI Agent section */}
        <div className="mb-6">
          <h3 className="font-label-caps text-label-caps text-outline mb-2 uppercase">AI Agent</h3>
          <div className="relative group h-28">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full resize-none border-b border-outline-variant focus:border-primary focus:border-b-2 bg-transparent p-2 font-body-md text-body-md text-on-surface placeholder:text-outline transition-all outline-none"
              placeholder="Describe your business process..."
            ></textarea>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full mt-2 bg-primary text-on-primary hover:bg-primary-container font-label-caps text-label-caps py-2.5 rounded-lg shadow-sm transition-all flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">magic_button</span>
            Generate Workflow
          </button>
        </div>

        <div className="h-px bg-outline-variant my-2"></div>

        {/* Manual node palette */}
        <div className="mb-6 flex-1">
          <h3 className="font-label-caps text-label-caps text-outline mb-2 uppercase">Add Manually — Drag to Canvas</h3>
          <div className="flex flex-col gap-2">
            {NODE_TYPES.map((n) => (
              <div
                key={n.type}
                draggable
                onDragStart={(e) => onDragStart(e, n.type)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing hover:bg-surface-container-low transition-colors"
                style={{ borderColor: n.color }}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ color: n.color }}>
                  {n.icon}
                </span>
                <span className="font-body-md text-body-md text-on-surface">{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Canvas */}
      <main
        ref={reactFlowWrapper}
        className="flex-1 md:ml-[280px] relative dot-grid bg-[#F9FAFB]"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {!hasWorkflow && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center pointer-events-none z-10">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[32px]">account_tree</span>
            </div>
            <div>
              <h3 className="font-headline-md text-on-surface">No workflow active</h3>
              <p className="font-body-md text-on-surface-variant max-w-xs">
                Describe your process in the sidebar, or drag a node onto the canvas.
              </p>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="w-full h-full"
        >
          <Background gap={24} color="#e5e7eb" />
          <Controls />
        </ReactFlow>

        {/* Node edit panel */}
        {selectedNode && (
          <div className="absolute top-6 right-6 w-72 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-4 z-20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-headline-md text-on-surface text-sm">Edit Node</h4>
              <button onClick={() => setSelectedNode(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1 uppercase text-[10px]">
              Label
            </label>
            <input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full px-2 py-2 border border-outline-variant rounded-md text-sm mb-3 outline-none focus:border-primary"
            />
            <button
              onClick={saveNodeLabel}
              className="w-full bg-primary text-on-primary py-2 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function FlowchartTab() {
  return (
    <ReactFlowProvider>
      <FlowchartCanvas />
    </ReactFlowProvider>
  );
}
