import { PlayCircle, Search, Folder } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Albums() {
  const { albums } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredAlbums = albums.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Folder size={32} color="var(--primary)" />
        <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem' }}>Todos los Álbumes</h1>
      </div>
      
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '2rem', lineHeight: '1.6' }}>
        Explora nuestras colecciones, partidos completos y resúmenes de las distintas ligas.
      </p>

      <div className="form-group" style={{ marginBottom: '3rem', maxWidth: '400px', position: 'relative' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          className="form-input" 
          placeholder="Buscar álbum..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.75rem' }}
        />
      </div>

      {filteredAlbums.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Folder size={48} color="var(--border-glass)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No se encontraron álbumes</h3>
          <p className="text-muted">Prueba con otra búsqueda.</p>
        </div>
      ) : (
        <div className="grid-container">
          {filteredAlbums.map(album => (
            <div 
              key={album.id} 
              className="hover-lift transition-all"
              style={{ 
                background: 'var(--bg-dark)', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid var(--border-glass)'
              }}
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <img 
                  src={album.thumbnail || 'https://images.unsplash.com/photo-1518605368461-1ee125b29b46?q=80&w=600&auto=format&fit=crop'} 
                  alt={album.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{album.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Creado el {album.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
