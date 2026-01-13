import { useState } from 'react'

function ProductCard({ producto }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="product-card">
        <img 
          src={producto.imagen} 
          alt={producto.nombre}
          onClick={() => setShowModal(true)}
          style={{ cursor: 'pointer' }}
        />
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <span className="precio">${producto.precio}</span>
        <button>Agregar al carrito</button>
      </div>

      {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <img src={producto.imagen} alt={producto.nombre} />
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
