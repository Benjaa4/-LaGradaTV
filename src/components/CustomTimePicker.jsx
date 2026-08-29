import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00','05','10','15','20','25','30','35','40','45','50','55'];

export default function CustomTimePicker({ value, onChange, placeholder = 'Seleccionar hora' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const hourRef   = useRef(null);
  const minuteRef = useRef(null);

  const [hh, mm] = value ? value.split(':') : ['', ''];

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll selected item into view when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hourRef.current) {
          const sel = hourRef.current.querySelector('[data-selected="true"]');
          if (sel) sel.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        if (minuteRef.current) {
          const sel = minuteRef.current.querySelector('[data-selected="true"]');
          if (sel) sel.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }, 50);
    }
  }, [isOpen]);

  const setHour   = (h) => onChange(`${h}:${mm || '00'}`);
  const setMinute = (m) => onChange(`${hh || '12'}:${m}`);

  const displayValue = value ? `${hh}:${mm}` : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        className="form-input"
        onClick={() => setIsOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none', borderColor: isOpen ? 'var(--blue)' : '', boxShadow: isOpen ? '0 0 0 3px rgba(59,130,246,0.2)' : '' }}
      >
        <Clock size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ flex: 1, color: displayValue ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.95rem', fontVariantNumeric: 'tabular-nums' }}>
          {displayValue || placeholder}
        </span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, zIndex: 9999,
          background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          padding: '0.75rem', minWidth: '200px',
          animation: 'fadeIn 0.15s ease-out'
        }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
            {displayValue || 'Elige la hora'}
          </p>

          {/* Two columns: hours | minutes */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Hours */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase' }}>Hora</p>
              <div ref={hourRef} style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                {HOURS.map(h => (
                  <button
                    key={h}
                    type="button"
                    data-selected={hh === h}
                    onClick={() => setHour(h)}
                    style={{
                      padding: '0.5rem', border: 'none', borderRadius: '8px', fontSize: '0.88rem',
                      fontWeight: hh === h ? '800' : '500', textAlign: 'center', cursor: 'pointer',
                      background: hh === h ? 'var(--blue)' : 'transparent',
                      color: hh === h ? 'white' : 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => { if (hh !== h) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={(e) => { if (hh !== h) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: '1px', background: 'var(--border-glass)', alignSelf: 'stretch' }} />

            {/* Minutes */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase' }}>Min</p>
              <div ref={minuteRef} style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                {MINUTES.map(m => (
                  <button
                    key={m}
                    type="button"
                    data-selected={mm === m}
                    onClick={() => setMinute(m)}
                    style={{
                      padding: '0.5rem', border: 'none', borderRadius: '8px', fontSize: '0.88rem',
                      fontWeight: mm === m ? '800' : '500', textAlign: 'center', cursor: 'pointer',
                      background: mm === m ? 'var(--blue)' : 'transparent',
                      color: mm === m ? 'white' : 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => { if (mm !== m) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={(e) => { if (mm !== m) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
