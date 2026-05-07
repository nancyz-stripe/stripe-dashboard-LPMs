import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BasePathContext } from '../../contexts/BasePath';
import { Sidebar } from '../../sail/Sidebar';
import { Header, SandboxBanner, SANDBOX_HEIGHT } from '../../sail/Header';
import { Workbench, WORKBENCH_BAR_HEIGHT } from '../../sail';
import SidebarNav from './SidebarNav';
import HeaderNav from './HeaderNav';
import Home from './pages/Home';
import Balances from './pages/Balances';

export default function Prototype6App({ basePath = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BasePathContext.Provider value={basePath}>
      <div className="min-h-screen bg-surface">
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row flex-1 bg-surface">
            <Sidebar mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <SidebarNav />
            </Sidebar>
            <Header onMenuToggle={() => setMobileMenuOpen(o => !o)}>
              <HeaderNav />
            </Header>

            <div className="ml-0 lg:ml-sidebar-width flex flex-col min-w-0 flex-1 relative" style={{ paddingTop: 60, '--header-offset': '60px' }}>
              <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 pt-4" style={{ paddingBottom: WORKBENCH_BAR_HEIGHT + 16 }}>
                <Routes>
                  <Route path="" element={<Home />} />
                  <Route path="balances" element={<Balances />} />
                  <Route path="*" element={<Navigate to={basePath || "/"} replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>

        {/* Workbench */}
        <Workbench
          maxHeight={window.innerHeight}
          tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'logs', label: 'Logs' },
            { key: 'events', label: 'Events' },
          ]}
        />
      </div>
    </BasePathContext.Provider>
  );
}
