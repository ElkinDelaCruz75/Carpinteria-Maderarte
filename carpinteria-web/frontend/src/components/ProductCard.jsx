import { useState } from 'react'

function ProductCard({ producto, configuracion }) {
  const [showModal, setShowModal] = useState(false)
  const [showCotizacionModal, setShowCotizacionModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [cotizacionData, setCotizacionData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  })
  const [successMessage, setSuccessMessage] = useState('')
  
  const imagenes = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes 
    : [producto.imagen || 'https://via.placeholder.com/400']

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length)
  }

  const handleCotizacionChange = (e) => {
    setCotizacionData({
      ...cotizacionData,
      [e.target.name]: e.target.value
    })
  }

  const handleCotizacionSubmit = (e) => {
    e.preventDefault()
    
    // Construir mensaje para WhatsApp
    const mensaje = `*SOLICITUD DE COTIZACIÓN*%0A%0A` +
      `*Producto:* ${producto.nombre}%0A` +
      `*Precio Referencia:* $${producto.precio}%0A%0A` +
      `*Datos del Cliente:*%0A` +
      `Nombre: ${cotizacionData.nombre}%0A` +
      `Teléfono: ${cotizacionData.telefono}%0A` +
      `Email: ${cotizacionData.email}%0A%0A` +
      `*Mensaje:*%0A${cotizacionData.mensaje}`
    
    // Abrir WhatsApp
    const whatsappNumber = configuracion?.whatsapp || '573136036717'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensaje}`
    window.open(whatsappUrl, '_blank')
    
    // Mostrar mensaje de éxito
    setSuccessMessage('¡Cotización enviada! Te contactaremos pronto.')
    
    // Resetear formulario y cerrar modal después de 2 segundos
    setTimeout(() => {
      setShowCotizacionModal(false)
      setCotizacionData({ nombre: '', telefono: '', email: '', mensaje: '' })
      setSuccessMessage('')
    }, 2000)
  }

  return (
    <>
      <div className="product-card">
        <img 
          src={imagenes[0]} 
          alt={producto.nombre}
          onClick={() => setShowModal(true)}
          style={{ cursor: 'pointer' }}
        />
        {imagenes.length > 1 && <span className="image-count">{imagenes.length}🖼️</span>}
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <span className="precio">${producto.precio}</span>
        <button onClick={() => setShowCotizacionModal(true)}>Solicitar Cotización</button>
      </div>

      {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            
            <div className="modal-image-container">
              <img src={imagenes[currentImageIndex]} alt={`${producto.nombre} ${currentImageIndex + 1}`} />
              
              {imagenes.length > 1 && (
                <>
                  <button className="modal-nav prev" onClick={handlePrevImage}>❮</button>
                  <button className="modal-nav next" onClick={handleNextImage}>❯</button>
                  <div className="image-indicators">
                    {imagenes.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-info">
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <span className="precio">${producto.precio}</span>
            </div>
          </div>
        </div>
      )}

      {showCotizacionModal && (
        <div className="cotizacion-modal" onClick={() => setShowCotizacionModal(false)}>
          <div className="cotizacion-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCotizacionModal(false)}>✕</button>
            
            <div className="cotizacion-header">
              <h3>Solicitar Cotización</h3>
              <div className="cotizacion-producto">
                <img src={imagenes[0]} alt={producto.nombre} />
                <div>
                  <h4>{producto.nombre}</h4>
                  <p className="precio-ref">Precio referencia: ${producto.precio}</p>
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <form onSubmit={handleCotizacionSubmit} className="cotizacion-form">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={cotizacionData.nombre}
                  onChange={handleCotizacionChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={cotizacionData.telefono}
                  onChange={handleCotizacionChange}
                  required
                  placeholder="0999999999"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={cotizacionData.email}
                  onChange={handleCotizacionChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label>Detalles adicionales</label>
                <textarea
                  name="mensaje"
                  value={cotizacionData.mensaje}
                  onChange={handleCotizacionChange}
                  placeholder="Especifica medidas, colores, cantidad, o cualquier detalle adicional..."
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-cotizacion">
                📱 Enviar Cotización por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard
