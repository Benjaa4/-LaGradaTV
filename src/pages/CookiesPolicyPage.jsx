import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Sliders, ShieldCheck, Info, ArrowLeft, CheckCircle2, ExternalLink, Settings, Globe } from 'lucide-react';

export default function CookiesPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenSettings = () => {
    window.dispatchEvent(new Event('open-cookie-settings'));
  };

  const cookiesList = [
    {
      name: 'token',
      type: 'Técnica / Esencial',
      provider: 'La Grada TV',
      purpose: 'Almacena la sesión cifrada y autenticada para el panel de administración.',
      duration: '7 días'
    },
    {
      name: 'lg_cookie_consent',
      type: 'Técnica / Esencial',
      provider: 'La Grada TV',
      purpose: 'Registra tus preferencias de consentimiento de cookies y fecha de elección.',
      duration: '1 año'
    },
    {
      name: 'favorites',
      type: 'Preferencias',
      provider: 'La Grada TV',
      purpose: 'Guarda la lista de equipos que marcas como favoritos para acceso directo.',
      duration: 'Permanente (local)'
    },
    {
      name: 'yt-remote-* / VISITOR_INFO1_LIVE',
      type: 'Terceros (YouTube)',
      provider: 'Google / YouTube',
      purpose: 'Permite la reproducción de videos y transmisiones de partidos enlazados.',
      duration: 'Sesión a 6 meses'
    }
  ];

  return (
    <div className="cookies-page-container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/" className="btn btn-glass btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
          <ArrowLeft size={15} /> Volver al Inicio
        </Link>
      </div>

      {/* Hero Header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2.5rem 2rem', 
          borderRadius: 'var(--radius-xl)', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12), rgba(21, 22, 30, 0.95))',
          border: '1px solid var(--nm-border-strong)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '99px', background: 'rgba(217, 119, 6, 0.18)', color: 'var(--amber-light)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          <Cookie size={14} /> Transparencia y Tecnologías de Rastreo
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>
          Política de Cookies
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
          Te explicamos de manera clara qué son las cookies, cuáles empleamos en <strong>La Grada TV</strong> y cómo puedes configurar o revocar tu consentimiento en cualquier momento.
        </p>

        {/* Action button to open settings immediately */}
        <div style={{ marginTop: '1.75rem' }}>
          <button 
            type="button" 
            onClick={handleOpenSettings}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', fontWeight: 800, fontSize: '0.88rem' }}
          >
            <Sliders size={16} /> Configurar mis Preferencias de Cookies
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* 1. ¿Qué son las cookies? */}
        <section className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} color="var(--amber)" /> 1. ¿Qué es una Cookie?
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Una cookie es un pequeño archivo de texto que un sitio web almacena en tu navegador o dispositivo al visitarlo. Las cookies permiten al sitio recordar información sobre tu visita, como tus equipos favoritos, tus preferencias de visualización o mantener abierta tu sesión de forma segura.
          </p>
        </section>

        {/* 2. Categorías de cookies que utilizamos */}
        <section className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" /> 2. Categorías de Cookies en La Grada TV
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            
            <div style={{ padding: '1.15rem', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--nm-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Técnicas y Esenciales</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', borderRadius: '99px', fontWeight: 700 }}>Obligatorias</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Imprescindibles para que la web funcione correctamente. Permiten la navegación, carga segura de partidos, autenticación de administradores y guardado de tu elección de cookies.
              </p>
            </div>

            <div style={{ padding: '1.15rem', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--nm-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Rendimiento y Métricas</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(79, 109, 245, 0.15)', color: 'var(--primary-light)', borderRadius: '99px', fontWeight: 700 }}>Opcionales</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Recopilan datos estadísticos agregados sobre visitas a partidos y torneos para optimizar la velocidad y rendimiento general de la plataforma.
              </p>
            </div>

            <div style={{ padding: '1.15rem', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--nm-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Preferencias</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(217, 119, 6, 0.15)', color: 'var(--amber-light)', borderRadius: '99px', fontWeight: 700 }}>Opcionales</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Permiten recordar configuraciones personalizadas como los clubes marcados como favoritos en el buscador rápido.
              </p>
            </div>

            <div style={{ padding: '1.15rem', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--nm-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Cookies de Terceros</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(225, 95, 65, 0.15)', color: 'var(--rose-light)', borderRadius: '99px', fontWeight: 700 }}>Servicios Externos</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Instaladas por servicios integrados como reproductores de YouTube o mapas de Google Maps para indicar la ubicación de las canchas.
              </p>
            </div>

          </div>
        </section>

        {/* 3. Tabla detallada de cookies */}
        <section className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} color="var(--purple)" /> 3. Registro Específico de Cookies
          </h2>
          
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--nm-border-strong)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Nombre / Clave</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Tipo</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Proveedor</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Finalidad</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Duración</th>
                </tr>
              </thead>
              <tbody>
                {cookiesList.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--nm-border)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-light)' }}>{c.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{c.type}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{c.provider}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{c.purpose}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Cómo desactivar o eliminar cookies en navegadores */}
        <section className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="var(--teal)" /> 4. Gestión desde tu Navegador
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Además de nuestro panel de configuración, puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador o móvil:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            <a 
              href="https://support.google.com/chrome/answer/95647" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-glass"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.65rem 0.9rem' }}
            >
              <span>Google Chrome</span> <ExternalLink size={13} />
            </a>
            <a 
              href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-glass"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.65rem 0.9rem' }}
            >
              <span>Apple Safari</span> <ExternalLink size={13} />
            </a>
            <a 
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-glass"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.65rem 0.9rem' }}
            >
              <span>Mozilla Firefox</span> <ExternalLink size={13} />
            </a>
            <a 
              href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-glass"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.65rem 0.9rem' }}
            >
              <span>Microsoft Edge</span> <ExternalLink size={13} />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
