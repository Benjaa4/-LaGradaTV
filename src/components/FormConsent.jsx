import { Link } from 'react-router-dom';

export default function FormConsent({
  checked,
  onChange,
  required = true,
  id = 'form-legal-consent',
  style = {}
}) {
  return (
    <div 
      className="form-consent-box"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.65rem',
        padding: '0.75rem 0.85rem',
        background: 'var(--bg-sunken)',
        border: '1px solid var(--nm-border)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--nm-shadow-inset-sm)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.45,
        userSelect: 'none',
        ...style
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        style={{
          marginTop: '0.2rem',
          width: '16px',
          height: '16px',
          accentColor: 'var(--primary)',
          cursor: 'pointer',
          flexShrink: 0
        }}
      />
      <label htmlFor={id} style={{ cursor: 'pointer', margin: 0 }}>
        He leído y acepto los{' '}
        <Link 
          to="/terminos" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'underline' }}
          onClick={(e) => e.stopPropagation()}
        >
          Términos y Condiciones
        </Link>{' '}
        y la{' '}
        <Link 
          to="/privacidad" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'underline' }}
          onClick={(e) => e.stopPropagation()}
        >
          Política de Privacidad
        </Link>{' '}
        de La Grada TV.
      </label>
    </div>
  );
}
