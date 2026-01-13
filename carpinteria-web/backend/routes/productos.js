const express = require('express');
const router = express.Router();

// Datos de ejemplo
const productos = [
  {
    id: 1,
    nombre: 'Silla de madera',
    descripcion: 'Silla clásica de roble',
    precio: 150
  },
  {
    id: 2,
    nombre: 'Mesa de comedor',
    descripcion: 'Mesa de caoba para 6 personas',
    precio: 500
  }
];

// Obtener todos los productos
router.get('/', (req, res) => {
  res.json(productos);
});

// Obtener un producto por ID
router.get('/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(producto);
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const nuevoProducto = {
    id: productos.length + 1,
    ...req.body
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

module.exports = router;
