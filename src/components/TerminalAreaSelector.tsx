import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TERMINAL_AREAS, type TerminalArea } from '../config/terminalAreas';
import { useIsMobile } from '../hooks/useIsMobile';

interface TerminalAreaSelectorProps {
  selectedArea: TerminalArea;
}

export function TerminalAreaSelector({ selectedArea }: TerminalAreaSelectorProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens (skip on mobile to prevent keyboard)
  useEffect(() => {
    if (isOpen && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobile]);

  // Filter areas based on search
  const filteredAreas = TERMINAL_AREAS.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (area: TerminalArea) => {
    setIsOpen(false);
    setSearchQuery('');
    // Navigate to the new area's page
    navigate(`/${area.slug}`);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel"
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-glass)',
          color: 'var(--text-primary)',
          fontSize: '12px',
          fontWeight: 500,
          minWidth: '180px',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="mono"
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 5px',
              background: 'var(--class-b)',
              borderRadius: '3px',
              color: 'white',
            }}
          >
            {selectedArea.id}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{selectedArea.name}</span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '280px',
            maxHeight: '400px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 5000,
          }}
        >
          {/* Search input - hidden on mobile */}
          {!isMobile && (
            <div style={{ padding: '12px 12px 8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search terminal areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Area list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '8px 8px 8px' : '0 8px 8px',
            }}
          >
            {filteredAreas.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                }}
              >
                No matching terminal areas
              </div>
            ) : (
              filteredAreas.map((area) => {
                const isSelected = area.id === selectedArea.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => handleSelect(area)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      transition: 'all 0.1s ease',
                      marginBottom: '2px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '3px 6px',
                        background: isSelected ? 'var(--class-b)' : 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        color: isSelected ? 'white' : 'var(--text-secondary)',
                        minWidth: '42px',
                        textAlign: 'center',
                      }}
                    >
                      {area.id}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 500 : 400,
                      }}
                    >
                      {area.name}
                    </span>
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--class-b)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: 'auto' }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            {TERMINAL_AREAS.length} terminal areas available
          </div>
        </div>
      )}
    </div>
  );
}
