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

export default function ControlPanel() {
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
          <div className="flex flex-col gap-1 w-full">
            <p className="text-label-small text-subdued px-1">Prototypes</p>
            <ControlPanelButton onClick={() => navigate('/prototype4')}>
              Billing retries
            </ControlPanelButton>
            <ControlPanelButton active>
              Off session payments
            </ControlPanelButton>
          </div>
          <ControlPanelButton onClick={() => navigate('/')}>
            View all prototypes
          </ControlPanelButton>
        </ControlPanelBody>
      </div>
    </>
  );
}
