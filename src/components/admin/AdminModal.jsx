import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Plus } from 'lucide-react';

export function Modal({ title, onClose, children, icon }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon && <span style={{ color: 'var(--primary)' }}>{icon}</span>}
            <h2 className="modal-title">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', transition: 'transform 0.16s ease, color 0.16s ease', outline: 'none' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.88)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Eliminar', icon }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return createPortal(
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 10000 }} role="alertdialog" aria-modal="true">
      <div
        className="modal-content animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '380px', padding: '1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {icon || <Trash2 size={24} color="#ef4444" />}
          </div>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 1.75rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-glass"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="btn"
            style={{
              flex: 1, fontWeight: '700',
              background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
              color: 'white', border: 'none',
              boxShadow: '0 4px 16px rgba(239,68,68,0.35)'
            }}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            <Trash2 size={15} /> {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SectionHeader({ title, onAdd, addLabel = 'Añadir', count }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
      <div style={{ minWidth: '150px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
        {count !== undefined && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{count} elemento{count !== 1 ? 's' : ''}</span>
        )}
      </div>
      {onAdd && (
        <button
          className="btn btn-primary"
          style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center', padding: '0.65rem 1.1rem', fontSize: '0.85rem', flexShrink: 0 }}
          onClick={onAdd}
        >
          <Plus size={17} /> <span>{addLabel}</span>
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, onAdd, addLabel }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{message}</p>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
}

export function StatBadge({ label, value, highlight }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', padding: '0.25rem 0.4rem', background: 'var(--bg-dark)', borderRadius: '6px', minWidth: '36px' }}>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: highlight ? '800' : '600', color: highlight ? 'var(--primary)' : 'var(--text-primary)' }}>{value}</span>
    </span>
  );
}
