import { useState, useEffect } from 'react';

export function BrowserNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Detect Firefox
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    // Check if user has previously dismissed
    const dismissed = sessionStorage.getItem('firefox-notice-dismissed');

    if (isFirefox && !dismissed) {
      // Delay appearance for smoother UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('firefox-notice-dismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) ${isExiting ? 'translateY(20px)' : 'translateY(0)'}`,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 4000,
        opacity: isExiting ? 0 : 1,
        transition: 'all 0.3s ease',
        animation: 'slideUpFade 0.4s ease-out',
        maxWidth: 'calc(100vw - 48px)',
      }}
    >
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      {/* Icon - stylized browser/performance indicator */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05))',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent-gold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>

      {/* Message */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '2px',
          }}
        >
          Performance Notice
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}
        >
          For best 3D rendering performance, we recommend using{' '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Chrome</span> or{' '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Edge</span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.03)',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
        aria-label="Dismiss notice"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
