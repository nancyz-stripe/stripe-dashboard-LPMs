import { useState } from 'react';
import {
  ControlPanelHeader,
  ControlPanelBody,
  MARGIN,
  PANEL_WIDTH,
  DropZone,
  useDragSnap,
} from '../../sail/ControlPanel';

function VersionButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-label-medium rounded-lg w-full border cursor-pointer transition-colors text-left ${
        active
          ? 'bg-button-primary-bg text-button-primary-text border-transparent'
          : 'bg-surface text-default border-border hover:bg-offset'
      }`}
    >
      {children}
    </button>
  );
}

export default function ControlPanel({ activeVersion, onVersionChange }) {
  const [minimized, setMinimized] = useState(false);
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
        className={`fixed z-[100] bg-surface rounded-lg shadow-lg overflow-hidden border border-border select-none ${dragging ? 'cursor-grabbing' : ''}`}
        style={{ ...style, width: PANEL_WIDTH }}
      >
        <ControlPanelHeader
          minimized={minimized}
          onToggle={() => { if (!didDrag.current) setMinimized(!minimized); }}
        />
        <ControlPanelBody minimized={minimized}>
          <div className="flex flex-col gap-1.5 w-full">
            <VersionButton
              active={activeVersion === 'billing-retries'}
              onClick={() => onVersionChange('billing-retries')}
            >
              v1: Billing retries
            </VersionButton>
            <VersionButton
              active={activeVersion === 'off-session'}
              onClick={() => onVersionChange('off-session')}
            >
              v2: Off session payments
            </VersionButton>
          </div>
        </ControlPanelBody>
      </div>
    </>
  );
}
