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
} from '../../sail/ControlPanel';

export default function ControlPanel({ version, onVersionChange }) {
  const navigate = useNavigate();
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

  const versions = [
    { key: 'v1', label: 'V1: Accordion' },
    { key: 'v2', label: 'V2' },
  ];

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
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-label-small-emphasized text-subdued uppercase tracking-wider">Version</p>
            <div className="flex flex-col gap-1 flex-1">
              {versions.map((v) => (
                <button
                  key={v.key}
                  onClick={() => onVersionChange(v.key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-label-medium cursor-pointer transition-colors ${
                    version === v.key
                      ? 'bg-brand/10 text-brand text-label-medium-emphasized'
                      : 'text-default hover:bg-offset'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <ControlPanelButton onClick={() => navigate('/')}>
            View all prototypes
          </ControlPanelButton>
        </ControlPanelBody>
      </div>
    </>
  );
}
