import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Server, UserCheck, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'responsable', title: '1. Responsable del Tratamiento' },
    { id: 'datos', title: '2. Datos que Recopilamos' },
    { id: 'finalidad', title: '3. Finalidad del Tratamiento' },
    { id: 'legitimacion', title: '4. Base Legal y Legitimación' },
    { id: 'conservacion', title: '5. Período de Conservación' },
    { id: 'destinatarios', title: '6. Comunicación de Datos a Terceros' },
    { id: 'derechos', title: '7. Tus Derechos de Privacidad (ARCO/GDPR)' },
    { id: 'seguridad', title: '8. Seguridad y Medidas Técnicas' },
    { id: 'contacto-privacidad', title: '9. Canal de Contacto' }
  ];

  return (
    <div className="privacy-page-container animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
      
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
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(21, 22, 30, 0.95))',
          border: '1px solid var(--nm-border-strong)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '99px', background: 'rgba(20, 184, 166, 0.18)', color: 'var(--teal-light)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          <Shield size={14} /> Protección de Datos Personales
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>
          Política de Privacidad
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
          En <strong>La Grada TV</strong> nos comprometemos a garantizar la confidencialidad, integridad y seguridad de la información de nuestros visitantes, organizadores y deportistas.
        </p>
        <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Última actualización: Septiembre de 2026 · Cumplimiento estándares GDPR / Leyes de Privacidad
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Index Sidebar */}
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
            Contenido
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
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-light)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', flex: '2 1 500px' }}>

          {/* 1. Responsable */}
          <section id="responsable" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} color="var(--teal)" /> 1. Responsable del Tratamiento
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              El responsable del tratamiento de los datos personales recabados a través del sitio web es <strong>La Grada TV</strong>. Para cualquier comunicación relativa a la gestión de tu información personal, puedes contactar a nuestro oficial de privacidad en <span style={{ color: 'var(--teal-light)', fontWeight: 700 }}>privacidad@lagradatv.com</span>.
            </p>
          </section>

          {/* 2. Datos recopilados */}
          <section id="datos" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="var(--primary)" /> 2. Datos que Recopilamos
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Podemos recopilar y procesar las siguientes categorías de información:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '0.5rem' }}>
              <li><strong>Datos de Navegación y Técnicos:</strong> Dirección IP anonimizada, tipo de navegador, sistema operativo y páginas visitadas.</li>
              <li><strong>Datos de Competidores y Deportistas:</strong> Nombres deportivos, números de dorsal, posición táctica y registros de amonestaciones o sanciones suministrados por los organizadores del torneo.</li>
              <li><strong>Credenciales de Administración:</strong> Usuario y clave encriptada (con hash seguro bcrypt) de administradores autorizados.</li>
              <li><strong>Preferencias de Usuario:</strong> Equipos marcados como favoritos y configuraciones de consentimiento guardadas en tu navegador.</li>
            </ul>
          </section>

          {/* 3. Finalidad */}
          <section id="finalidad" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="var(--purple)" /> 3. Finalidad del Tratamiento
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              La información recopilada se utiliza estrictamente para:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '0.5rem' }}>
              <li>Publicar resultados, tablas de posiciones, cruces de eliminatorias y alineaciones tácticas.</li>
              <li>Proporcionar enlaces a transmisiones en vivo y galerías fotográficas de los encuentros deportivos.</li>
              <li>Garantizar la seguridad técnica de la plataforma y prevenir accesos no autorizados.</li>
              <li>Elaborar métricas agregadas de audiencia de partidos sin identificar individualmente a los usuarios.</li>
            </ul>
          </section>

          {/* 4. Base legal */}
          <section id="legitimacion" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} color="var(--rose)" /> 4. Base Legal y Legitimación
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              El tratamiento de tus datos se fundamenta en:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '0.5rem' }}>
              <li><strong>El consentimiento expreso del usuario:</strong> Para la activación de cookies no esenciales y el envío voluntario de consultas.</li>
              <li><strong>El interés legítimo:</strong> Para mantener la seguridad del sitio web y mostrar la información pública de torneos deportivos amateur.</li>
              <li><strong>La ejecución de la relación de servicio:</strong> Para permitir el acceso administrativo y la publicación de fixtures por parte de los organizadores.</li>
            </ul>
          </section>

          {/* 5. Conservación */}
          <section id="conservacion" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} color="var(--blue)" /> 5. Período de Conservación
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Los datos estadísticos deportivos se conservan como registro histórico del campeonato. Los registros técnicos de sesión y cookies temporales se conservan únicamente durante el tiempo indispensable para su finalidad técnica o hasta que el usuario decida eliminarlas de su navegador.
            </p>
          </section>

          {/* 6. Destinatarios */}
          <section id="destinatarios" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="var(--teal)" /> 6. Comunicación de Datos a Terceros
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              <strong>La Grada TV nunca vende ni cede datos personales a empresas de publicidad o intermediarios de datos.</strong> Únicamente colaboramos con proveedores tecnológicos indispensables para la infraestructura del sitio (servicios de hosting seguro, proveedores de mapas como Google Maps y plataformas de video como YouTube para reproducir los partidos enlazados).
            </p>
          </section>

          {/* 7. Derechos */}
          <section id="derechos" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} color="var(--emerald)" /> 7. Tus Derechos de Privacidad (ARCO/GDPR)
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              En cualquier momento puedes ejercer los siguientes derechos sobre tus datos:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.85rem' }}>
              <div style={{ background: 'var(--bg-sunken)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--nm-border)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>Acceso:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Conocer qué datos tuyos conservamos.</p>
              </div>
              <div style={{ background: 'var(--bg-sunken)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--nm-border)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--teal-light)' }}>Rectificación:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Corregir información inexacta o desactualizada.</p>
              </div>
              <div style={{ background: 'var(--bg-sunken)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--nm-border)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--rose-light)' }}>Supresión:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Solicitar la eliminación de tus datos cuando proceda.</p>
              </div>
              <div style={{ background: 'var(--bg-sunken)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--nm-border)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--amber-light)' }}>Oposición:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Oponerte a tratamientos específicos de información.</p>
              </div>
            </div>
          </section>

          {/* 8. Seguridad */}
          <section id="seguridad" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} color="var(--purple)" /> 8. Seguridad y Medidas Técnicas
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Aplicamos protocolos modernos de cifrado HTTPS/TLS en todas las comunicaciones, hashing criptográfico de contraseñas de administración, control estricto de roles (JWT) y medidas técnicas orientadas a prevenir pérdidas, alteraciones o accesos no autorizados a la base de datos.
            </p>
          </section>

          {/* 9. Contacto */}
          <section id="contacto-privacidad" className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="var(--primary)" /> 9. Canal de Contacto de Privacidad
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Para ejercer cualquiera de tus derechos o plantear dudas referentes a la privacidad, envía un correo electrónico a <span style={{ color: 'var(--teal-light)', fontWeight: 700 }}>privacidad@lagradatv.com</span> indicando en el asunto "Ejercicio de Derechos de Privacidad".
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
