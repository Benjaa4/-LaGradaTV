import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-select-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden native input for required validation if needed */}
      {required && (
        <input 
          type="text" 
          required={required} 
          value={value || ''} 
          onChange={() => {}} 
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }} 
        />
      )}
      
      <div 
        className={`form-input custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          cursor: 'pointer', userSelect: 'none',
          borderColor: isOpen ? 'var(--blue)' : '',
          boxShadow: isOpen ? '0 0 0 3px rgba(59,130,246,0.15)' : ''
        }}
      >
        <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div 
          className="custom-select-dropdown animate-scale-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            zIndex: 100,
            maxHeight: '250px',
            overflowY: 'auto',
            padding: '0.5rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {options.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
              No hay opciones
            </div>
          ) : (
            options.map(option => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  background: value === option.value ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: value === option.value ? 'var(--blue)' : 'var(--text-primary)',
                  fontWeight: value === option.value ? '700' : '500',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) e.currentTarget.style.background = 'transparent';
                }}
              >
                {option.label}
                {value === option.value && <Check size={16} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
