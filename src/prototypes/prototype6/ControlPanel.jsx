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

export default function ControlPanel({ managedMode, onModeChange }) {
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
        className={`fixed z-[100] bg-surface rounded-lg shadow-lg overflow-hidden border border-border select-none ${dragging ? 'cursor-grabbing' : ''}`}
        style={{ ...style, width: PANEL_WIDTH }}
      >
        <ControlPanelHeader
          minimized={minimized}
          onToggle={() => { if (!didDrag.current) setMinimized(!minimized); }}
        />
        <ControlPanelBody minimized={minimized}>
          <InfoBanner />
          <div className="flex flex-col gap-1">
            <span className="text-label-small text-subdued">Mode</span>
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => onModeChange('for-me')}
                className={`flex-1 px-3 py-1.5 text-label-small transition-colors ${managedMode === 'for-me' ? 'bg-blurple text-white' : 'bg-surface text-default hover:bg-offset'}`}
              >
                Do it for me
              </button>
              <button
                onClick={() => onModeChange('with-me')}
                className={`flex-1 px-3 py-1.5 text-label-small transition-colors ${managedMode === 'with-me' ? 'bg-blurple text-white' : 'bg-surface text-default hover:bg-offset'}`}
              >
                Do it with me
              </button>
            </div>
          </div>
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
