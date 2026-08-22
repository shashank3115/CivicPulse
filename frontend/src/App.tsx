import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import DashboardPage from './pages/DashboardPage';
import HotspotsPage from './pages/HotspotsPage';
import PriorityPage from './pages/PriorityPage';
import CitizenFeedbackPage from './pages/CitizenFeedbackPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InfrastructurePage from './pages/InfrastructurePage';
import DistrictDetailPanel from './components/districts/DistrictDetail';
import AskCivicPulse from './components/copilot/AskCivicPulse';
import { NavItem } from './types';

function App() {
  const [currentNav, setCurrentNav] = useState<NavItem>('dashboard');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  const renderContent = () => {
    switch (currentNav) {
      case 'dashboard': return <DashboardPage onDistrictSelect={setSelectedDistrictId} />;
      case 'hotspots': return <HotspotsPage onDistrictSelect={setSelectedDistrictId} />;
      case 'priorities': return <PriorityPage onDistrictSelect={setSelectedDistrictId} />;
      case 'feedback': return <CitizenFeedbackPage onDistrictSelect={setSelectedDistrictId} />;
      case 'analytics': return <AnalyticsPage onDistrictSelect={setSelectedDistrictId} />;
      case 'infrastructure': return <InfrastructurePage onDistrictSelect={setSelectedDistrictId} />;
      default: return <DashboardPage onDistrictSelect={setSelectedDistrictId} />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<NavItem, string> = {
      dashboard: 'Dashboard',
      hotspots: 'Demand Hotspots',
      priorities: 'Priority Regions',
      feedback: 'Citizen Feedback',
      infrastructure: 'Infrastructure',
      analytics: 'Analytics'
    };
    return titles[currentNav];
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar currentNav={currentNav} onNavigate={setCurrentNav} />
      <div className="flex-1 flex flex-col h-full relative">
        <TopBar currentPage={getPageTitle()} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {selectedDistrictId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDistrictId(null)} />
          <div className="relative w-[600px] bg-cardBg shadow-2xl h-full animate-slide-up">
            <DistrictDetailPanel districtId={selectedDistrictId} onClose={() => setSelectedDistrictId(null)} />
          </div>
        </div>
      )}

      <AskCivicPulse />
    </div>
  );
}

export default App;
