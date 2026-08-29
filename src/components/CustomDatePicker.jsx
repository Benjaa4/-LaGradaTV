import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

export default function CustomDatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }) {
  // value is "YYYY-MM-DD"
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const today = new Date();
  const parsed  = value ? new Date(value + 'T12:00:00') : null;
  const initYear  = parsed ? parsed.getFullYear()  : today.getFullYear();
  const initMonth = parsed ? parsed.getMonth()     : today.getMonth();

  const [viewYear,  setViewYear]  = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const displayValue = parsed
    ? `${String(parsed.getDate()).padStart(2,'0')} ${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`
    : null;

  const isSelected = (day) => {
    if (!parsed) return false;
    return parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
  };
  const isToday = (day) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        className="form-input"
        onClick={() => setIsOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none', borderColor: isOpen ? 'var(--blue)' : '', boxShadow: isOpen ? '0 0 0 3px rgba(59,130,246,0.2)' : '' }}
      >
        <CalendarDays size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ flex: 1, color: displayValue ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
          {displayValue || placeholder}
        </span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, zIndex: 9999,
          background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          padding: '1rem', minWidth: '280px',
          animation: 'fadeIn 0.15s ease-out'
        }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <button type="button" onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.35rem', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.35rem', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.4rem' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', padding: '0.25rem 0', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => day && selectDay(day)}
                style={{
                  padding: '0.45rem 0.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isSelected(day) ? '800' : '500',
                  textAlign: 'center',
                  cursor: day ? 'pointer' : 'default',
                  background: isSelected(day) ? 'var(--blue)' : isToday(day) ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: isSelected(day) ? 'white' : isToday(day) ? 'var(--blue)' : day ? 'var(--text-primary)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (day && !isSelected(day)) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={(e) => { if (day && !isSelected(day)) e.currentTarget.style.background = isToday(day) ? 'rgba(59,130,246,0.15)' : 'transparent'; }}
              >
                {day || ''}
              </button>
            ))}
          </div>

          {/* Footer - Today button */}
          <div style={{ borderTop: '1px solid var(--border-glass)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                selectDay(now.getDate());
              }}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', background: 'rgba(59,130,246,0.08)', color: 'var(--blue)', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
