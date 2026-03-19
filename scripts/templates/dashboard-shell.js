function toPascal(str) {
  return str
    .split(/[-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export default function generate(id, name, description) {
  const pascal = toPascal(id);
  const safeName = name.replace(/[`$\\]/g, '\\$&');
  const safeId = id.replace(/[`$\\]/g, '\\$&');
  return {
    'SidebarNav.jsx': `import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBasePath } from '../../contexts/BasePath';
import { NavItem, SubNavItem, SectionHeading, ExpandableNavItem } from '../../sail/Sidebar';
import { ACCOUNT_NAME } from '../../sail/Header';
import { Icon } from '../../icons/SailIcons';

export default function SidebarNav() {
  const location = useLocation();
  const basePath = useBasePath();
  const [expandedSection, setExpandedSection] = useState('connect');

  const isActive = (path) => location.pathname === (path ? \`\${basePath}/\${path}\` : basePath || '/');

  return (
    <>
      {/* Account Section - Desktop (compact row) */}
      <div className="hidden lg:flex p-1.5 -mx-0.5 rounded-lg items-center border-border hover:bg-offset gap-2 duration-100">
        <img src="/rocketrides.svg" alt={ACCOUNT_NAME} className="size-[24px] rounded" />
        <span className="text-default text-label-medium-emphasized">
          {ACCOUNT_NAME}
        </span>
      </div>

      {/* Account Section - Mobile (centered) */}
      <div className="flex lg:hidden flex-col items-center gap-2 pt-2 pb-8 border-b border-border">
        <img src="/rocketrides.svg" alt={ACCOUNT_NAME} className="size-[40px] rounded-lg" />
        <span className="text-default text-heading-small">{ACCOUNT_NAME}</span>
      </div>

      {/* Main Navigation */}
      <div className="">
        <NavItem icon={<Icon name="home" size="small" fill="currentColor" />} label="Home" to="" active={isActive('')} />
        <NavItem icon={<Icon name="balance" size="small" fill="currentColor" />} label="Balances" to="balances" active={isActive('balances')} />
        <NavItem icon={<Icon name="arrowsLoop" size="small" fill="currentColor" />} label="Transactions" />
        <NavItem icon={<Icon name="person" size="small" fill="currentColor" />} label="Directory" />
        <NavItem icon={<Icon name="product" size="small" fill="currentColor" />} label="Product catalog" />
      </div>

      {/* Products */}
      <div className="space-y-2">
        <SectionHeading label="Products" />
        <div className="">
          <ExpandableNavItem
            icon={<Icon name="platform" size="small" fill="currentColor" />}
            label="Connect"
            sectionId="connect"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Overview" />
            <SubNavItem label="Connected accounts" />
            <SubNavItem label="Capital" />
          </ExpandableNavItem>
          <ExpandableNavItem
            icon={<Icon name="wallet" size="small" fill="currentColor" />}
            label="Payments"
            sectionId="payments"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Analytics" />
            <SubNavItem label="Disputes" />
            <SubNavItem label="Radar" />
            <SubNavItem label="Payment Links" />
            <SubNavItem label="Terminal" />
          </ExpandableNavItem>
          <ExpandableNavItem
            icon={<Icon name="invoice" size="small" fill="currentColor" />}
            label="Billing"
            sectionId="billing"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Overview" />
            <SubNavItem label="Subscriptions" />
            <SubNavItem label="Invoices" />
            <SubNavItem label="Usage-based" />
            <SubNavItem label="Revenue recovery" />
          </ExpandableNavItem>
          <ExpandableNavItem
            icon={<Icon name="barChart" size="small" fill="currentColor" />}
            label="Reporting"
            sectionId="reporting"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Reports" />
            <SubNavItem label="Sigma" />
            <SubNavItem label="Revenue Recognition" />
            <SubNavItem label="Data management" />
          </ExpandableNavItem>
          <NavItem icon={<Icon name="more" size="small" fill="currentColor" />} label="More" />
        </div>
      </div>
    </>
  );
}
`,
    'HeaderNav.jsx': `import { HeaderButton } from '../../sail/Header';
import { Icon } from '../../icons/SailIcons';
import { DiamondAppIcon, BoatAppIcon, ZapAppIcon } from '../../icons/AppIcons';

export default function HeaderNav() {
  return (
    <div className="flex items-center">
      {/* App Dock - desktop only */}
      <div className="hidden lg:flex items-center gap-0.5 px-px py-px border border-neutral-50 rounded-full mr-4">
        <HeaderButton>
          <DiamondAppIcon />
        </HeaderButton>
        <HeaderButton>
          <BoatAppIcon />
        </HeaderButton>
        <HeaderButton>
          <ZapAppIcon />
        </HeaderButton>
        <HeaderButton className="text-icon-default">
          <Icon name="apps" size="small" />
        </HeaderButton>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-1.5">
        <HeaderButton className="lg:hidden">
          <Icon name="apps" className="size-[20px]" />
        </HeaderButton>
        <HeaderButton className="hidden lg:flex">
          <Icon name="help" className="size-[16px]" />
        </HeaderButton>
        <HeaderButton>
          <Icon name="notifications" className="size-[20px] lg:size-[16px]" />
        </HeaderButton>
        <HeaderButton>
          <Icon name="settings" className="size-[20px] lg:size-[16px]" />
        </HeaderButton>
        <HeaderButton className="hidden lg:flex">
          <Icon name="addCircleFilled" className="text-brand-500 lg:size-[20px]" />
        </HeaderButton>
      </div>
    </div>
  );
}
`,
    'App.jsx': `import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BasePathContext } from '../../contexts/BasePath';
import { Sidebar } from '../../sail/Sidebar';
import { Header, SandboxBanner, SANDBOX_HEIGHT } from '../../sail/Header';
import { Workbench, WORKBENCH_BAR_HEIGHT } from '../../sail';
import ControlPanel from './ControlPanel';
import SidebarNav from './SidebarNav';
import HeaderNav from './HeaderNav';
import Home from './pages/Home';
import Balances from './pages/Balances';

export default function ${pascal}App({ basePath = '' }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        />

        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row flex-1 bg-surface">
            {sandboxMode && <SandboxBanner />}
            <Sidebar sandboxMode={sandboxMode} mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <SidebarNav />
            </Sidebar>
            <Header sandboxMode={sandboxMode} onMenuToggle={() => setMobileMenuOpen(o => !o)}>
              <HeaderNav />
            </Header>

            <div className="ml-0 lg:ml-sidebar-width flex flex-col min-w-0 flex-1 relative" style={{ paddingTop: 60 + (sandboxMode ? SANDBOX_HEIGHT : 0), '--header-offset': \`\${60 + (sandboxMode ? SANDBOX_HEIGHT : 0)}px\` }}>
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
          maxHeight={window.innerHeight - (sandboxMode ? SANDBOX_HEIGHT : 0)}
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
`,
    'ControlPanel.jsx': `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ControlPanelButton,
  ControlPanelHeader,
  ControlPanelBody,
  MARGIN,
  PANEL_WIDTH,
  DropZone,
  useDragSnap,
  InfoBanner,
  ContextDialog,
} from '../../sail/ControlPanel';
import { Switch } from '../../sail';

export default function ControlPanel({ darkMode, onToggleDarkMode, sandboxMode, onToggleSandboxMode }) {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const { side, dragging, settling, settlePos, dragPos, snapTarget, panelRef, onPointerDown, didDrag, restLeft, bottomOffset, bottomExpr } = useDragSnap();

  let style;
  if (dragging && dragPos) {
    style = { left: dragPos.left, right: 'auto', bottom: dragPos.bottom, transition: 'none' };
  } else if (settling && settlePos) {
    style = { left: settlePos.left, right: 'auto', bottom: settlePos.bottom, transition: 'left 0.25s ease, bottom 0.25s ease' };
  } else {
    style = { left: restLeft, right: 'auto', bottom: bottomExpr };
  }

  return (
    <>
      {dragging && didDrag.current && (
        <DropZone snapSide={snapTarget} panelRef={panelRef} bottomOffset={bottomOffset} />
      )}

      <div
        ref={panelRef}
        onPointerDown={onPointerDown}
        className={\`fixed z-[100] bg-surface rounded-lg shadow-lg overflow-hidden border border-border select-none \${dragging ? 'cursor-grabbing' : ''}\`}
        style={{ ...style, width: PANEL_WIDTH }}
      >
        <ControlPanelHeader
          minimized={minimized}
          onToggle={() => { if (!didDrag.current) setMinimized(!minimized); }}
        />
        <ControlPanelBody minimized={minimized}>
          <InfoBanner />
          <Switch
            checked={darkMode}
            onChange={onToggleDarkMode}
            label="Dark mode"
            className="w-full"
          />
          <Switch
            checked={sandboxMode}
            onChange={onToggleSandboxMode}
            label="Sandbox mode"
            className="w-full"
          />
          <ControlPanelButton onClick={() => setContextOpen(true)}>
            Show context
          </ControlPanelButton>
          <ControlPanelButton onClick={() => navigate('/')}>
            View all prototypes
          </ControlPanelButton>
        </ControlPanelBody>
      </div>

      <ContextDialog open={contextOpen} onClose={() => setContextOpen(false)}>
        {/* Add your prototype context here */}
      </ContextDialog>
    </>
  );
}
`,
    'pages/Home.jsx': `export default function Home() {
  return (
    <div>
      <h1 className="text-heading-xlarge text-default mb-2">${safeName}</h1>
      <p className="text-subdued">Edit <code className="text-monospace-small bg-offset px-2 py-1 rounded">src/prototypes/${id}/pages/Home.jsx</code> to get started.</p>
    </div>
  );
}
`,
    'pages/Balances.jsx': `export default function Balances() {
  return (
    <div>
      <h1 className="text-heading-xlarge text-default mb-2">Balances</h1>
      <p className="text-subdued">Edit <code className="text-monospace-small bg-offset px-2 py-1 rounded">src/prototypes/${id}/pages/Balances.jsx</code> to edit this page.</p>
    </div>
  );
}
`,
  };
}
