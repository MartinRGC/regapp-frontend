import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Search, Plus, 
  Edit, Trash2, Folder, X, Save, Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // En el estado del formulario
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  address: '', 
  category_id: ''
});

  // Cargar contactos y categorías al montar
  useEffect(() => {
    fetchContacts();
    fetchCategories();
  }, []);

  // Función para cargar contactos
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://regapp-backend.martingarcia08-00.workers.dev/api/contacts', {
        headers: {
          'Authorization': 'Bearer temp-token'
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar contactos');
      
      const data = await response.json();
      setContacts(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar categorías
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://regapp-backend.martingarcia08-00.workers.dev/api/categories', {
        headers: {
          'Authorization': 'Bearer temp-token'
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar categorías');
      
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al cargar categorías');
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir formulario para nuevo contacto
  const openAddForm = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '', 
      category_id: ''
    });
    setShowForm(true);
  };

  // Abrir formulario para editar contacto
  const openEditForm = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.extra_data?.address || '',
      category_id: contact.category_id
    });
    setShowForm(true);
  };

  // Guardar contacto (crear o actualizar)
  const saveContact = async () => {
    try {
      const url = editingContact 
        ? `https://regapp-backend.martingarcia08-00.workers.dev/api/contacts/${editingContact.id}`
        : 'https://regapp-backend.martingarcia08-00.workers.dev/api/contacts';
      
      const method = editingContact ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer temp-token'
        },
        body: JSON.stringify(formData)
      });

      const extra_data = {
        address: formData.address.trim() || null
      };

      
      if (!response.ok) throw new Error('Error al guardar contacto');
      
      alert(editingContact ? '✅ Contacto actualizado' : '✅ Contacto creado');
      setShowForm(false);
      fetchContacts(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar contacto');
    }
  };

  // Eliminar contacto
  const deleteContact = async (id, name) => {
    if (!confirm(`¿Eliminar contacto "${name}"?`)) return;
    
    try {
      const response = await fetch(`https://regapp-backend.martingarcia08-00.workers.dev/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer temp-token'
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar contacto');
      
      alert('✅ Contacto eliminado');
      fetchContacts(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar contacto');
    }
  };

  // Filtrar contactos por búsqueda
  const filteredContacts = contacts.filter(contact => 
    searchTerm === '' ||
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.includes(searchTerm) ||
    contact.extra_data?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mis Contactos</h1>
        <button onClick={openAddForm} className="btn-primary">
          <Plus size={18} />
          Nuevo contacto
        </button>
      </header>

      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">
          <Loader2 size={48} className="spinner" />
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          {filteredContacts.length === 0 ? (
            <div className="empty-state">
              <User size={64} className="empty-icon" />
              <p>No hay contactos</p>
              <button onClick={openAddForm} className="btn-secondary">
                <Plus size={18} />
                Agregar primer contacto
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th><User size={16} /> Nombre</th>
                    <th><Mail size={16} /> Email</th>
                    <th><Phone size={16} /> Teléfono</th>
                    <th><Folder size={16} /> Categoría</th>
                    <th><MapPin size={16} /> Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map(contact => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>{contact.email || '-'}</td>
                      <td>{contact.phone || '-'}</td>
                      <td>{contact.extra_data?.address || '-'}</td>
                      <td>
                        {categories.find(c => c.id === contact.category_id)?.name || 'Sin categoría'}
                      </td>
                      <td className="actions">
                        <button 
                          onClick={() => openEditForm(contact)} 
                          className="btn-icon edit"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteContact(contact.id, contact.name)} 
                          className="btn-icon delete"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingContact ? 'Editar contacto' : 'Agregar nuevo contacto'}</h2>
              <button onClick={() => setShowForm(false)} className="btn-close">
                <X size={24} />
              </button>
            </div>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ejemplo@email.com"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="999-888-777"
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Calle 123, Ciudad"
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowForm(false)} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={saveContact} className="btn-save">
                <Save size={18} />
                {editingContact ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
