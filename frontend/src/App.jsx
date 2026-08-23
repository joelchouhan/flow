import { useState } from "react";
import Navbar from "./pages/Navbar";
import FlowchartTab from "./pages/FlowchartTab";
import SwimlaneTab from "./pages/SwimlaneTab";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("flowchart");

  if (activeTab === "login") {
    return <LoginPage onBack={() => setActiveTab("flowchart")} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "flowchart" && <FlowchartTab />}
      {activeTab === "swimlane" && <SwimlaneTab />}
    </div>
  );
}
