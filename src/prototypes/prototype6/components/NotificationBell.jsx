import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { NOTIFICATIONS } from '../data/paymentMethods';

export default function NotificationBell({ onNavigateToMethod }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const basePath = useBasePath();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    setIsOpen(false);
    navigate(`${basePath}/settings`);
    if (onNavigateToMethod) {
      onNavigateToMethod(notification.methodId);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-md hover:bg-offset transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-subdued">
          <path d="M8 1.5a4.5 4.5 0 00-4.5 4.5v3L2 11h12l-1.5-2V6A4.5 4.5 0 008 1.5zM6.5 12a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#675dff] rounded-full flex items-center justify-center">
            <span className="text-[9px] text-white font-semibold">{unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[340px] bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-label-medium-emphasized">Notifications</h3>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-body-small text-subdued">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 hover:bg-offset transition-colors border-b border-border last:border-0 ${!notification.read ? 'bg-[#f7f5fd]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notification.read ? 'bg-[#675dff]' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-label-small-emphasized">{notification.method} enabled</p>
                        <p className="text-body-small text-subdued mt-0.5">{notification.message}</p>
                        <p className="text-body-small text-subdued mt-1">{notification.date}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
