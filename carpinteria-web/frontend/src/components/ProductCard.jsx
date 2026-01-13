function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <span className="precio">${producto.precio}</span>
      <button>Agregar al carrito</button>
    </div>
  )
}

export default ProductCard
