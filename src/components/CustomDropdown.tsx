import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownItem {
  value: string;
  label: string;
  badge?: string;
  color?: string;
}

export interface DropdownGroup {
  label: string;
  items: DropdownItem[];
}

interface CustomDropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  groups?: DropdownGroup[];
  options?: DropdownItem[];
  width?: number | string;
  height?: number;
  style?: React.CSSProperties;
  align?: 'left' | 'right';
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  groups,
  options,
  width = 250,
  height = 28,
  style,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find currently selected item's label
  const allItems: DropdownItem[] = [];
  if (options) {
    allItems.push(...options);
  }
  if (groups) {
    for (const g of groups) {
      allItems.push(...g.items);
    }
  }

  const selectedItem = allItems.find((it) => it.value === value);
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`am-custom-dropdown ${className}`}
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        display: 'inline-block',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          height: height,
          background: '#161722',
          border: isOpen ? '1px solid #3b82f6' : '1px solid #282a36',
          borderRadius: 6,
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          color: selectedItem ? '#ffffff' : '#94a3b8',
          fontSize: 11.5,
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 1px #3b82f6' : 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          textAlign: 'left',
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: '#94a3b8',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            [align]: 0,
            minWidth: typeof width === 'number' && width < 280 ? 280 : '100%',
            maxWidth: 380,
            maxHeight: 340,
            overflowY: 'auto',
            background: 'rgba(18, 19, 28, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 8,
            boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            padding: '6px 0',
          }}
        >
          {groups &&
            groups.map((group, gIdx) => (
              <div key={gIdx} style={{ marginBottom: 4 }}>
                {/* Group Header */}
                <div
                  style={{
                    padding: '8px 12px 4px',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    borderTop: gIdx > 0 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                    marginTop: gIdx > 0 ? 4 : 0,
                  }}
                >
                  {group.label}
                </div>

                {/* Group Items */}
                {group.items.map((item) => {
                  const isItemActive = item.value === value;
                  return (
                    <div
                      key={item.value}
                      role="option"
                      aria-selected={isItemActive}
                      onClick={() => handleSelect(item.value)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 11.5,
                        fontWeight: isItemActive ? 700 : 500,
                        color: isItemActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                        background: isItemActive
                          ? 'rgba(59, 130, 246, 0.18)'
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isItemActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </span>
                      {isItemActive && (
                        <Check size={12} color="#3b82f6" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

          {options &&
            options.map((item) => {
              const isItemActive = item.value === value;
              return (
                <div
                  key={item.value}
                  role="option"
                  aria-selected={isItemActive}
                  onClick={() => handleSelect(item.value)}
                  style={{
                    padding: '6px 12px',
                    fontSize: 11.5,
                    fontWeight: isItemActive ? 700 : 500,
                    color: isItemActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                    background: isItemActive
                      ? 'rgba(59, 130, 246, 0.18)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isItemActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isItemActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </span>
                  {isItemActive && (
                    <Check size={12} color="#3b82f6" style={{ flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
