import { useState } from 'react';
import { MapPin, Edit2, Trash2, Plus, X, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Modal, ConfirmDialog, SectionHeader, EmptyState } from './AdminModal';

export default function LocationsTab() {
  const { locations, addLocation, editLocation, deleteLocation } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', map_url: '' });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editLocationData, setEditLocationData] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);

  const askConfirm = (title, message, onConfirm) => setConfirmAction({ title, message, onConfirm });

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocation.name.trim()) {
      addLocation({ name: newLocation.name.trim(), map_url: newLocation.map_url.trim() });
      setNewLocation({ name: '', map_url: '' });
      setOpenModal(false);
    }
  };

  const handleSaveLocation = (id) => {
    editLocation(id, editLocationData);
    setEditingLocationId(null);
  };

  return (
    <section className="animate-fade-in">
      <SectionHeader
        title="Canchas y Complejos Deportivos"
        count={locations.length}
        addLabel="Añadir Cancha"
        onAdd={() => setOpenModal(true)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {locations.map(loc => (
          <div key={loc.id} className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
            {editingLocationId === loc.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="form-input"
                  value={editLocationData.name || ''}
                  onChange={e => setEditLocationData({ ...editLocationData, name: e.target.value })}
                  placeholder="Nombre de la cancha"
                  autoFocus
                />
                <input
                  type="url"
                  className="form-input"
                  value={editLocationData.map_url || ''}
                  onChange={e => setEditLocationData({ ...editLocationData, map_url: e.target.value })}
                  placeholder="URL de Google Maps (Opcional)"
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleSaveLocation(loc.id)}>
                    <Check size={15} /> Guardar
                  </button>
                  <button className="btn btn-glass" onClick={() => setEditingLocationId(null)}>
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={18} color="var(--primary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {loc.name}
                  </p>
                  {loc.map_url ? (
                    <a href={loc.map_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                      Ver en Google Maps ↗
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sin mapa asignado</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button className="btn btn-glass" style={{ padding: '0.5rem' }} onClick={() => {
                    setEditingLocationId(loc.id);
                    setEditLocationData({ ...loc });
                  }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => {
                    askConfirm(
                      'Eliminar Cancha',
                      `¿Estás seguro de eliminar la cancha "${loc.name}"?`,
                      () => deleteLocation(loc.id)
                    );
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {locations.length === 0 && (
          <EmptyState message="No hay canchas registradas" onAdd={() => setOpenModal(true)} addLabel="Añadir Cancha" />
        )}
      </div>

      {openModal && (
        <Modal title="Añadir Cancha" icon={<MapPin size={20} />} onClose={() => setOpenModal(false)}>
          <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nombre de la Cancha</label>
              <input required autoFocus type="text" className="form-input" value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Ej: Cancha Principal" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL de Google Maps (Opcional)</label>
              <input type="url" className="form-input" value={newLocation.map_url} onChange={e => setNewLocation({ ...newLocation, map_url: e.target.value })} placeholder="https://maps.google.com/..." />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={17} /> Guardar Cancha
            </button>
          </form>
        </Modal>
      )}

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </section>
  );
}
