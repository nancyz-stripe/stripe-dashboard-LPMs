import { useState } from 'react';

export default function ManageModal({ isOpen, onClose, managedMode, onModeChange }) {
  const [selected, setSelected] = useState(managedMode ? 'auto' : 'manual');

  if (!isOpen) return null;

  const handleSave = () => {
    onModeChange(selected === 'auto');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface rounded-xl shadow-xl w-full max-w-[520px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-heading-medium">Manage new payment methods</h2>
          <button onClick={onClose} className="text-subdued hover:text-default p-1 rounded-md hover:bg-offset transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4 space-y-3">
          <p className="text-body-small text-subdued">
            Choose how Stripe handles newly eligible payment methods for your account.
          </p>

          {/* Option: Auto */}
          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selected === 'auto' ? 'border-brand bg-[var(--color-bg-brand-subtle,#f7f5fd)]' : 'border-border hover:bg-offset'}`}>
            <input
              type="radio"
              name="manage-mode"
              value="auto"
              checked={selected === 'auto'}
              onChange={() => setSelected('auto')}
              className="mt-0.5 accent-[#675dff]"
            />
            <div className="flex-1">
              <div className="text-label-medium-emphasized">Enable automatically</div>
              <p className="text-body-small text-subdued mt-0.5">
                Stripe enables eligible frictionless payment methods as they become available. You'll be notified before changes take effect.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-body-small text-subdued bg-offset px-2 py-0.5 rounded">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v6l3 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/></svg>
                  Recommended
                </span>
              </div>
            </div>
          </label>

          {/* Option: Manual */}
          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selected === 'manual' ? 'border-brand bg-[var(--color-bg-brand-subtle,#f7f5fd)]' : 'border-border hover:bg-offset'}`}>
            <input
              type="radio"
              name="manage-mode"
              value="manual"
              checked={selected === 'manual'}
              onChange={() => setSelected('manual')}
              className="mt-0.5 accent-[#675dff]"
            />
            <div className="flex-1">
              <div className="text-label-medium-emphasized">Let me choose manually</div>
              <p className="text-body-small text-subdued mt-0.5">
                You'll be notified when new methods are available. No changes are made until you explicitly enable them.
              </p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-body-small text-subdued">
            You can change this later in{' '}
            <a href="#" className="text-brand hover:underline">payment method settings</a>.
            {' · '}
            <a href="#" className="text-brand hover:underline">Terms</a>
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-label-medium rounded-lg border border-border hover:bg-offset transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-label-medium-emphasized text-white bg-[#675dff] hover:bg-[#5a4fee] rounded-lg transition-colors">
              Save preference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
