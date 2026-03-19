import { useState } from 'react';
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

export default function ControlPanel({ darkMode, onToggleDarkMode, sandboxMode, onToggleSandboxMode, showFloatie, onToggleFloatie }) {
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
        className={`fixed z-[100] bg-surface rounded-lg shadow-lg overflow-hidden w-[${PANEL_WIDTH}px] border border-border select-none ${dragging ? 'cursor-grabbing' : ''}`}
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
          <Switch
            checked={showFloatie}
            onChange={onToggleFloatie}
            label="Show floatie"
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
