import { useState, useEffect } from 'react'
import API_URL from '../config'

function AdminPanel({ productos, setProductos, configuracion, setConfiguracion, onClose }) {
  const [activeTab, setActiveTab] = useState('productos')
  const [editingProduct, setEditingProduct] = useState(null)
  const [imagenes, setImagenes] = useState([])
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [imageFilter, setImageFilter] = useState('todos')
  const [uploadCategory, setUploadCategory] = useState('cocinas')
  const [newProduct, setNewProduct] = useState({
    categoria: 'cocinas',
    nombre: '',
    descripcion: '',
    precio: '',
    imagenes: []
  })

  // Cargar imágenes al abrir la pestaña o cambiar filtro
  useEffect(() => {
    if (activeTab === 'imagenes') {
      fetchImagenes()
    }
  }, [activeTab, imageFilter])

  const fetchImagenes = async () => {
    try {
      let url = `${API_URL}/imagenes`
      if (imageFilter && imageFilter !== 'todos') {
        url += `?categoria=${imageFilter}`
      }
      console.log('Fetching from:', url)
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      console.log('Imágenes recibidas:', data.length, 'Filtro:', imageFilter)
      setImagenes(data)
    } catch (error) {
      console.error('Error al cargar imágenes:', error)
      setImagenes([])
    }
  }

  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    
    try {
      // Subir todas las imágenes en paralelo con categoría
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('imagen', file)
        formData.append('categoria', uploadCategory)
        
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        })
        return res.json()
      })

      const results = await Promise.all(uploadPromises)
      const allSuccess = results.every(data => data.success)
      
      if (allSuccess) {
        fetchImagenes()
        alert(`✅ ${files.length} imagen${files.length > 1 ? 'es' : ''} subida${files.length > 1 ? 's' : ''} en ${uploadCategory}`)
      } else {
        alert('⚠️ Algunas imágenes no se pudieron subir')
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error)
      alert('Error al subir las imágenes')
    } finally {
      setUploading(false)
      // Limpiar el input para permitir volver a subir las mismas imágenes
      e.target.value = ''
    }
  }

  const handleDeleteImage = async (publicId) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      console.log('Eliminando imagen:', publicId)
      const res = await fetch(`${API_URL}/imagenes?public_id=${encodeURIComponent(publicId)}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        console.log('Imagen eliminada exitosamente')
        fetchImagenes()
      } else {
        const error = await res.json()
        console.error('Error al eliminar:', error)
        alert('Error al eliminar la imagen: ' + error.error)
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
      alert('Error al eliminar la imagen')
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
      imagenes: []
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
                      <div className="images-list-edit">
                        <label>📸 Imágenes del Producto</label>
                        {(editingProduct.imagenes || []).map((img, idx) => (
                          <div key={idx} className="image-edit-row">
                            <input
                              type="text"
                              value={img}
                              onChange={(e) => {
                                const newImages = [...(editingProduct.imagenes || [])]
                                newImages[idx] = e.target.value
                                setEditingProduct({...editingProduct, imagenes: newImages})
                              }}
                              placeholder="URL de imagen"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = (editingProduct.imagenes || []).filter((_, i) => i !== idx)
                                setEditingProduct({...editingProduct, imagenes: newImages})
                              }}
                              className="remove-img-btn"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditingProduct({
                            ...editingProduct,
                            imagenes: [...(editingProduct.imagenes || []), '']
                          })}
                          className="add-img-btn"
                        >
                          ➕ Agregar Imagen
                        </button>
                      </div>
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
                      <img src={producto.imagenes?.[0] || 'https://via.placeholder.com/80'} alt={producto.nombre} />
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
                <label>📸 Imágenes del Producto</label>
                {(newProduct.imagenes || []).map((img, idx) => (
                  <div key={idx} className="image-edit-row">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...(newProduct.imagenes || [])]
                        newImages[idx] = e.target.value
                        setNewProduct({...newProduct, imagenes: newImages})
                      }}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = (newProduct.imagenes || []).filter((_, i) => i !== idx)
                        setNewProduct({...newProduct, imagenes: newImages})
                      }}
                      className="remove-img-btn"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewProduct({
                    ...newProduct,
                    imagenes: [...(newProduct.imagenes || []), '']
                  })}
                  className="add-img-btn"
                >
                  ➕ Agregar Imagen
                </button>
                <div className="images-preview">
                  {(newProduct.imagenes || []).map((img, idx) => img && (
                    <img key={idx} src={img} alt={`preview ${idx}`} className="image-preview" />
                  ))}
                </div>
              </div>
              <button className="add-btn" onClick={handleAddProduct}>
                ➕ Agregar Producto
              </button>
            </div>
          )}

          {activeTab === 'imagenes' && (
            <div className="imagenes-section">
              <h3>🖼️ Galería de Imágenes</h3>
              <p className="info-text">Sube imágenes organizadas por categoría</p>
              
              <div className="upload-area">
                <div className="upload-controls">
                  <select 
                    value={uploadCategory} 
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="category-select"
                  >
                    <option value="cocinas">🍳 Cocinas</option>
                    <option value="camas">🛏️ Camas</option>
                    <option value="puertas">🚪 Puertas</option>
                    <option value="ventanas">🪟 Ventanas</option>
                    <option value="muebles">🪑 Muebles</option>
                    <option value="closets">👔 Closets</option>
                  </select>
                  <label className="upload-btn">
                    {uploading ? '⏳ Subiendo...' : '📤 Subir Imagen(es)'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUploadImage}
                      disabled={uploading}
                      multiple
                      hidden
                    />
                  </label>
                </div>
              </div>

              <div className="image-categories">
                <button 
                  className={imageFilter === 'todos' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('todos')
                  }}
                >
                  🏠 Todos
                </button>
                <button 
                  className={imageFilter === 'cocinas' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('cocinas')
                  }}
                >
                  🍳 Cocinas
                </button>
                <button 
                  className={imageFilter === 'camas' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('camas')
                  }}
                >
                  🛏️ Camas
                </button>
                <button 
                  className={imageFilter === 'puertas' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('puertas')
                  }}
                >
                  🚪 Puertas
                </button>
                <button 
                  className={imageFilter === 'ventanas' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('ventanas')
                  }}
                >
                  🪟 Ventanas
                </button>
                <button 
                  className={imageFilter === 'muebles' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('muebles')
                  }}
                >
                  🪑 Muebles
                </button>
                <button 
                  className={imageFilter === 'closets' ? 'active' : ''} 
                  onClick={() => {
                    setImageFilter('closets')
                  }}
                >
                  👔 Closets
                </button>
              </div>

              <div className="imagenes-grid">
                {imagenes.length === 0 ? (
                  <p className="no-images">
                    {imageFilter === 'todos' 
                      ? 'No hay imágenes subidas aún' 
                      : `No hay imágenes en la categoría ${imageFilter}`}
                  </p>
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
                          onClick={() => handleDeleteImage(img.public_id)}
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
