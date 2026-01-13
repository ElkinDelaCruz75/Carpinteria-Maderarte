import ProductCard from './ProductCard'

const categorias = [
  { id: 'todos', nombre: '🏠 Todos' },
  { id: 'cocinas', nombre: '🍳 Cocinas' },
  { id: 'camas', nombre: '🛏️ Camas' },
  { id: 'puertas', nombre: '🚪 Puertas' },
  { id: 'ventanas', nombre: '🪟 Ventanas' },
  { id: 'muebles', nombre: '🪑 Muebles' },
  { id: 'closets', nombre: '🗄️ Closets' }
]

function ProductsGrid({ productos, filtroCategoria, setFiltroCategoria }) {
  return (
    <section id="productos" className="products-section">
      <h2>Nuestros Productos</h2>
      
      <div className="category-filters">
        {categorias.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${filtroCategoria === cat.id ? 'active' : ''}`}
            onClick={() => setFiltroCategoria(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="products-grid">
        <div className="grid">
          {productos.length === 0 ? (
            <p className="no-products">No hay productos en esta categoría</p>
          ) : (
            productos.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductsGrid
