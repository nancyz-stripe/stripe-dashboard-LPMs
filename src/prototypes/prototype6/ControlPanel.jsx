import { useState } from 'react';
import {
  ControlPanelHeader,
  ControlPanelBody,
  PANEL_WIDTH,
  DropZone,
  useDragSnap,
} from '../../sail/ControlPanel';

export default function ControlPanel({ managedMode, onModeChange }) {
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
          <div className="flex flex-col gap-2">
            <span className="text-label-small text-subdued">Mode</span>
            <button
              onClick={() => onModeChange('for-me')}
              className={`w-full px-3 py-2 rounded-md text-label-medium text-left transition-colors border ${managedMode === 'for-me' ? 'bg-button-primary-bg text-button-primary-text border-button-primary-border' : 'bg-surface text-default border-border hover:bg-offset'}`}
            >
              Do it for me
            </button>
            <button
              onClick={() => onModeChange('with-me')}
              className={`w-full px-3 py-2 rounded-md text-label-medium text-left transition-colors border ${managedMode === 'with-me' ? 'bg-button-primary-bg text-button-primary-text border-button-primary-border' : 'bg-surface text-default border-border hover:bg-offset'}`}
            >
              Do it with me
            </button>
          </div>
        </ControlPanelBody>
      </div>

    </>
  );
}
