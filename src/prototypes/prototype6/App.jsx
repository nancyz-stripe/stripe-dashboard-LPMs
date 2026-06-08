import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BasePathContext } from '../../contexts/BasePath';
import { Sidebar } from '../../sail/Sidebar';
import { Header, SandboxBanner, SANDBOX_HEIGHT } from '../../sail/Header';
import { Workbench, WORKBENCH_BAR_HEIGHT } from '../../sail';
import ControlPanel from './ControlPanel';
import SidebarNav from './SidebarNav';
import HeaderNav from './HeaderNav';
import CheckoutStudio from './pages/CheckoutStudio';
import PaymentMethodSettings from './pages/PaymentMethodSettings';
import PMConfigurations from './pages/PMConfigurations';

export default function Prototype6App({ basePath = '' }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [managedMode, setManagedMode] = useState(true);
  const [highlightedMethod, setHighlightedMethod] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    return () => document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <BasePathContext.Provider value={basePath}>
      <div className="min-h-screen bg-surface">
        <ControlPanel
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          sandboxMode={sandboxMode}
          onToggleSandboxMode={() => setSandboxMode(!sandboxMode)}
          managedMode={managedMode}
          onToggleManagedMode={() => setManagedMode(!managedMode)}
        />

        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row flex-1 bg-surface">
            {sandboxMode && <SandboxBanner />}
            <Sidebar sandboxMode={sandboxMode} mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <SidebarNav />
            </Sidebar>
            <Header sandboxMode={sandboxMode} onMenuToggle={() => setMobileMenuOpen(o => !o)}>
              <HeaderNav onNavigateToMethod={setHighlightedMethod} />
            </Header>

            <div className="ml-0 lg:ml-sidebar-width flex flex-col min-w-0 flex-1 relative" style={{ paddingTop: 60 + (sandboxMode ? SANDBOX_HEIGHT : 0), '--header-offset': `${60 + (sandboxMode ? SANDBOX_HEIGHT : 0)}px` }}>
              <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 pt-4" style={{ paddingBottom: WORKBENCH_BAR_HEIGHT + 16 }}>
                <Routes>
                  <Route path="" element={<Navigate to={`${basePath}/checkout-studio`} replace />} />
                  <Route path="checkout-studio" element={
                    <CheckoutStudio managedMode={managedMode} onModeChange={setManagedMode} />
                  } />
                  <Route path="settings" element={
                    <PaymentMethodSettings
                      managedMode={managedMode}
                      onModeChange={setManagedMode}
                      highlightedMethod={highlightedMethod}
                      onClearHighlight={() => setHighlightedMethod(null)}
                    />
                  } />
                  <Route path="configurations" element={<PMConfigurations />} />
                  <Route path="*" element={<Navigate to={`${basePath}/checkout-studio`} replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>

        <Workbench
          maxHeight={window.innerHeight - (sandboxMode ? SANDBOX_HEIGHT : 0)}
          tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'logs', label: 'Activity log' },
            { key: 'events', label: 'Events' },
          ]}
        />
      </div>
    </BasePathContext.Provider>
  );
}
