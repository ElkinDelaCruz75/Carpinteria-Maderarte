import { useState } from 'react'

function ProductCard({ producto }) {
  const [showModal, setShowModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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
        <button>Agregar al carrito</button>
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
    </>
  )
}

export default ProductCard
