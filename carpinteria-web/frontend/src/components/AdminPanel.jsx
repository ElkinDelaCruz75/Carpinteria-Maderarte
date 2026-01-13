import { useState, useEffect } from 'react'
import API_URL from '../config'

function AdminPanel({ productos, setProductos, configuracion, setConfiguracion, onClose }) {
  const [activeTab, setActiveTab] = useState('productos')
  const [editingProduct, setEditingProduct] = useState(null)
  const [imagenes, setImagenes] = useState([])
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [newProduct, setNewProduct] = useState({
    categoria: 'cocinas',
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: ''
  })

  // Cargar imágenes al abrir la pestaña
  useEffect(() => {
    if (activeTab === 'imagenes') {
      fetchImagenes()
    }
  }, [activeTab])

  const fetchImagenes = async () => {
    try {
      const res = await fetch(`${API_URL}/imagenes`)
      const data = await res.json()
      setImagenes(data)
    } catch (error) {
      console.error('Error al cargar imágenes:', error)
    }
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('imagen', file)

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        fetchImagenes()
      }
    } catch (error) {
      console.error('Error al subir imagen:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (filename) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      await fetch(`${API_URL}/imagenes/${filename}`, {
        method: 'DELETE'
      })
      fetchImagenes()
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
    }
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleEditProduct = (producto) => {
    setEditingProduct({ ...producto })
  }

  const handleSaveEdit = () => {
    setProductos(productos.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ))
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id))
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.nombre || !newProduct.precio) {
      alert('Nombre y precio son requeridos')
      return
    }
    const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1
    setProductos([...productos, { ...newProduct, id: nuevoId }])
    setNewProduct({
      categoria: 'cocinas',
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: ''
    })
  }

  const handleConfigChange = (field, value) => {
    setConfiguracion({ ...configuracion, [field]: value })
  }

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>🛠️ Panel de Administración</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="admin-shortcuts">
          <button className="images-shortcut" onClick={() => setActiveTab('imagenes')}>
            🖼️ Ir a Imágenes
          </button>
        </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'productos' ? 'active' : ''} 
            onClick={() => setActiveTab('productos')}
          >
            📦 Productos
          </button>
          <button 
            className={activeTab === 'agregar' ? 'active' : ''} 
            onClick={() => setActiveTab('agregar')}
          >
            ➕ Agregar
          </button>
          <button 
            className={activeTab === 'imagenes' ? 'active' : ''} 
            onClick={() => setActiveTab('imagenes')}
          >
            🖼️ Imágenes
          </button>
          <button 
            className={activeTab === 'configuracion' ? 'active' : ''} 
            onClick={() => setActiveTab('configuracion')}
          >
            ⚙️ Config
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'productos' && (
            <div className="products-list">
              <h3>Gestionar Productos</h3>
              {productos.map(producto => (
                <div key={producto.id} className="product-item">
                  {editingProduct?.id === producto.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editingProduct.nombre}
                        onChange={(e) => setEditingProduct({...editingProduct, nombre: e.target.value})}
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        value={editingProduct.precio}
                        onChange={(e) => setEditingProduct({...editingProduct, precio: e.target.value})}
                        placeholder="Precio"
                      />
                      <input
                        type="text"
                        value={editingProduct.imagen}
                        onChange={(e) => setEditingProduct({...editingProduct, imagen: e.target.value})}
                        placeholder="URL de imagen"
                      />
                      <textarea
                        value={editingProduct.descripcion}
                        onChange={(e) => setEditingProduct({...editingProduct, descripcion: e.target.value})}
                        placeholder="Descripción"
                      />
                      <select
                        value={editingProduct.categoria}
                        onChange={(e) => setEditingProduct({...editingProduct, categoria: e.target.value})}
                      >
                        <option value="cocinas">Cocinas</option>
                        <option value="camas">Camas</option>
                        <option value="puertas">Puertas</option>
                        <option value="ventanas">Ventanas</option>
                        <option value="muebles">Muebles</option>
                        <option value="closets">Closets</option>
                      </select>
                      <div className="edit-actions">
                        <button className="save-btn" onClick={handleSaveEdit}>💾 Guardar</button>
                        <button className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={producto.imagen} alt={producto.nombre} />
                      <div className="product-info">
                        <h4>{producto.nombre}</h4>
                        <p>{producto.categoria} - {producto.precio}</p>
                      </div>
                      <div className="product-actions">
                        <button onClick={() => handleEditProduct(producto)}>✏️</button>
                        <button onClick={() => handleDeleteProduct(producto.id)}>🗑️</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'agregar' && (
            <div className="add-product">
              <h3>Agregar Nuevo Producto</h3>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={newProduct.categoria}
                  onChange={(e) => setNewProduct({...newProduct, categoria: e.target.value})}
                >
                  <option value="cocinas">Cocinas</option>
                  <option value="camas">Camas</option>
                  <option value="puertas">Puertas</option>
                  <option value="ventanas">Ventanas</option>
                  <option value="muebles">Muebles</option>
                  <option value="closets">Closets</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
                  placeholder="Ej: Mesa de Comedor Rústica"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={newProduct.descripcion}
                  onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})}
                  placeholder="Descripción del producto..."
                />
              </div>
              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="text"
                  value={newProduct.precio}
                  onChange={(e) => setNewProduct({...newProduct, precio: e.target.value})}
                  placeholder="Ej: $5,000"
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  value={newProduct.imagen}
                  onChange={(e) => setNewProduct({...newProduct, imagen: e.target.value})}
                  placeholder="https://..."
                />
                {newProduct.imagen && (
                  <img src={newProduct.imagen} alt="Preview" className="image-preview" />
                )}
              </div>
              <button className="add-btn" onClick={handleAddProduct}>
                ➕ Agregar Producto
              </button>
            </div>
          )}

          {activeTab === 'imagenes' && (
            <div className="imagenes-section">
              <h3>🖼️ Galería de Imágenes</h3>
              <p className="info-text">Sube imágenes aquí y copia el enlace para usarlo en tus productos</p>
              
              <div className="upload-area">
                <label className="upload-btn">
                  {uploading ? '⏳ Subiendo...' : '📤 Subir Imagen'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUploadImage}
                    disabled={uploading}
                    hidden
                  />
                </label>
              </div>

              <div className="imagenes-grid">
                {imagenes.length === 0 ? (
                  <p className="no-images">No hay imágenes subidas aún</p>
                ) : (
                  imagenes.map((img) => (
                    <div key={img.filename} className="imagen-item">
                      <img src={img.url} alt={img.filename} />
                      <div className="imagen-actions">
                        <button 
                          className={`copy-btn ${copiedUrl === img.url ? 'copied' : ''}`}
                          onClick={() => handleCopyUrl(img.url)}
                        >
                          {copiedUrl === img.url ? '✅ Copiado!' : '📋 Copiar URL'}
                        </button>
                        <button 
                          className="delete-img-btn"
                          onClick={() => handleDeleteImage(img.filename)}
                        >
                          🗑️
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={img.url} 
                        readOnly 
                        className="url-input"
                        onClick={(e) => e.target.select()}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="config-section">
              <h3>Configuración del Sitio</h3>
              
              <div className="form-group">
                <label>📍 Nombre del Negocio</label>
                <input
                  type="text"
                  value={configuracion.nombreNegocio}
                  onChange={(e) => handleConfigChange('nombreNegocio', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>📍 Dirección</label>
                <input
                  type="text"
                  value={configuracion.direccion}
                  onChange={(e) => handleConfigChange('direccion', e.target.value)}
                  placeholder="Calle, Número, Colonia, Ciudad"
                />
              </div>

              <div className="form-group">
                <label>📞 Teléfono</label>
                <input
                  type="text"
                  value={configuracion.telefono}
                  onChange={(e) => handleConfigChange('telefono', e.target.value)}
                  placeholder="+52 555 123 4567"
                />
              </div>

              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  value={configuracion.email}
                  onChange={(e) => handleConfigChange('email', e.target.value)}
                  placeholder="contacto@carpinteria.com"
                />
              </div>

              <div className="form-group">
                <label>📱 WhatsApp</label>
                <input
                  type="text"
                  value={configuracion.whatsapp}
                  onChange={(e) => handleConfigChange('whatsapp', e.target.value)}
                  placeholder="5551234567"
                />
              </div>

              <div className="form-group">
                <label>🕐 Horario de Atención</label>
                <input
                  type="text"
                  value={configuracion.horario}
                  onChange={(e) => handleConfigChange('horario', e.target.value)}
                  placeholder="Lun-Vie: 9am-6pm, Sáb: 9am-2pm"
                />
              </div>

              <div className="form-group">
                <label>🖼️ Logo URL</label>
                <input
                  type="text"
                  value={configuracion.logo}
                  onChange={(e) => handleConfigChange('logo', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>🎨 Color Principal</label>
                <input
                  type="color"
                  value={configuracion.colorPrincipal}
                  onChange={(e) => handleConfigChange('colorPrincipal', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>📝 Slogan</label>
                <input
                  type="text"
                  value={configuracion.slogan}
                  onChange={(e) => handleConfigChange('slogan', e.target.value)}
                  placeholder="Muebles de calidad hechos con maestría"
                />
              </div>

              <div className="form-group">
                <label>🔗 Facebook URL</label>
                <input
                  type="text"
                  value={configuracion.facebook}
                  onChange={(e) => handleConfigChange('facebook', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>📸 Instagram URL</label>
                <input
                  type="text"
                  value={configuracion.instagram}
                  onChange={(e) => handleConfigChange('instagram', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
