import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, ArrowLeft, CheckCircle2, AlertCircle, Scale, Globe, UserCheck, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'general', title: '1. Aceptación y Objeto de la Plataforma' },
    { id: 'cuentas', title: '2. Registro, Equipos y Responsabilidades' },
    { id: 'propiedad', title: '3. Propiedad Intelectual y Contenidos' },
    { id: 'transmisiones', title: '4. Transmisiones en Vivo y Videos' },
    { id: 'conducta', title: '5. Normas de Conducta y Fair Play' },
    { id: 'responsabilidad', title: '6. Exención y Límite de Responsabilidad' },
    { id: 'modificaciones', title: '7. Modificaciones del Servicio y Términos' },
    { id: 'contacto', title: '8. Legislación y Contacto' },
  ];

  return (
    <div className="terms-page-container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

      {/* Back button & Breadcrumb */}
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
          background: 'linear-gradient(135deg, rgba(79, 109, 245, 0.12), rgba(21, 22, 30, 0.95))',
          border: '1px solid var(--nm-border-strong)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '99px', background: 'rgba(79, 109, 245, 0.18)', color: 'var(--primary-light)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          <Scale size={14} /> Marco Regulatorio y Legal
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>
          Términos y Condiciones de Uso
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
          Bienvenido a <strong>La Grada TV</strong>. Por favor lee atentamente las presentes condiciones que regulan el acceso, navegación y uso de nuestra plataforma de torneos, estadísticas, alineaciones y transmisiones deportivas.
        </p>
        <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Última actualización: Septiembre de 2026 · Versión 2.4
        </div>
      </div>

      {/* Main Layout: Nav Index + Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* Quick Jump Sidebar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            position: 'sticky',
            top: '5rem',
            border: '1px solid var(--nm-border)'
          }}
        >
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Índice de Cláusulas
          </h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-light)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Clauses Document */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', flex: '2 1 500px' }}>

          {/* Section 1 */}
          <section id="general" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="var(--primary)" /> 1. Aceptación y Objeto de la Plataforma
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Al ingresar, navegar o interactuar con <strong>La Grada TV</strong>, el usuario acepta de forma plena e incondicional estos Términos y Condiciones. Si no estás de acuerdo con alguna cláusula, debes abstenerte de utilizar la plataforma.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0.75rem 0 0' }}>
              La Grada TV es un entorno digital destinado a la difusión, gestión estadística, consulta de fixture, resultados, alineaciones tácticas y enlaces a transmisiones de competiciones y ligas deportivas locales.
            </p>
          </section>

          {/* Section 2 */}
          <section id="cuentas" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} color="var(--purple)" /> 2. Registro, Equipos y Responsabilidades
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Los organizadores y administradores con credenciales de acceso son responsables exclusivos de la veracidad y legitimidad de los datos cargados: nombres de plantillas, dorsales de jugadores, marcadores y resoluciones de sanciones disciplinarias.
            </p>
            <div style={{ background: 'var(--bg-sunken)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--nm-border)', marginTop: '0.85rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Seguridad:</strong> El titular de credenciales administrativas es el único custodio de su contraseña y se compromete a no compartirla con terceros ni utilizar la plataforma con propósitos malintencionados.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="propiedad" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="var(--teal)" /> 3. Propiedad Intelectual y Contenidos
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              El software, diseño de interfaz, animaciones, visualizador de canchas tácticas, marcas y logotipos de <strong>La Grada TV</strong> están protegidos por leyes de propiedad intelectual e industrial.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0.75rem 0 0' }}>
              Los escudos, nombres y emblemas de clubes participantes pertenecen a sus respectivos clubes y organizadores, utilizándose en la plataforma con propósitos meramente informativos y de identificación deportiva.
            </p>
          </section>

          {/* Section 4 */}
          <section id="transmisiones" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} color="var(--rose)" /> 4. Transmisiones en Vivo y Videos
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              La Grada TV enlaza o incorpora vínculos a transmisiones audiovisuales externas alojadas en plataformas de terceros (por ejemplo, YouTube, Twitch o Facebook Live).
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0.75rem 0 0' }}>
              No nos responsabilizamos por interrupciones, caídas de señal, limitaciones de ancho de banda o disponibilidad inherente a dichas plataformas externas o a la conectividad del transmisor en el campo de juego.
            </p>
          </section>

          {/* Section 5 */}
          <section id="conducta" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="var(--amber)" /> 5. Normas de Conducta y Fair Play
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              La comunidad deportiva de La Grada TV promueve el respeto mutuo. Queda terminantemente prohibido utilizar la plataforma para difundir discursos de odio, difamación hacia árbitros o jugadores, amenazas, o la alteración indebida de estadísticas deportivas.
            </p>
          </section>

          {/* Section 6 */}
          <section id="responsabilidad" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} color="var(--blue)" /> 6. Exención y Límite de Responsabilidad
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              La plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido o libre de errores imprevistos. Los fallos en el arbitraje o controversias de índole deportiva deben ser resueltos exclusivamente por el comité organizador de cada torneo.
            </p>
          </section>

          {/* Section 7 */}
          <section id="modificaciones" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--primary)" /> 7. Modificaciones del Servicio y Términos
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Nos reservamos el derecho de actualizar o modificar estos términos periódicamente para reflejar mejoras técnicas, nuevas funciones o normativas vigentes. Las modificaciones entrarán en vigor a partir de su publicación en este sitio web.
            </p>
          </section>

          {/* Section 8 */}
          <section id="contacto" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="var(--purple)" /> 8. Legislación y Contacto
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Para cualquier consulta, reclamo o sugerencia referente a estos Términos y Condiciones, puedes comunicarte con nuestro equipo legal y soporte en{' '}
              <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>ariza.benjaa@gmail.com</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
