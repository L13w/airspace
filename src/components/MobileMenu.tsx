import { useState } from 'react';

interface MobileMenuProps {
  onShowHelp: () => void;
}

export function MobileMenu({ onShowHelp }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleHelpClick = () => {
    setIsOpen(false);
    onShowHelp();
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 100,
      }}
    >
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel"
        style={{
          width: 44,
          height: 44,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Menu"
      >
        <span
          style={{
            display: 'block',
            width: 18,
            height: 2,
            background: 'var(--text-secondary)',
            borderRadius: 1,
            transition: 'all 0.2s ease',
            transform: isOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
          }}
        />
        <span
          style={{
            display: 'block',
            width: 18,
            height: 2,
            background: 'var(--text-secondary)',
            borderRadius: 1,
            transition: 'all 0.2s ease',
            opacity: isOpen ? 0 : 1,
          }}
        />
        <span
          style={{
            display: 'block',
            width: 18,
            height: 2,
            background: 'var(--text-secondary)',
            borderRadius: 1,
            transition: 'all 0.2s ease',
            transform: isOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
          }}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
            }}
          />

          {/* Menu items */}
          <div
            className="glass-panel animate-fade-in"
            style={{
              position: 'absolute',
              top: 52,
              right: 0,
              minWidth: 160,
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button
              onClick={handleHelpClick}
              style={{
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Help
            </button>
            <a
              href="https://github.com/L13w/airspace"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Code & Docs
            </a>
          </div>
        </>
      )}
    </div>
  );
}
