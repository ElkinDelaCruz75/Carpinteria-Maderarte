const productos = [
  {
    id: 1,
    categoria: 'cocinas',
    nombre: 'Cocina Integral Moderna',
    descripcion: 'Cocina completa con acabados en madera de roble y mármol',
    precio: '$15,000',
    imagen: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=500'
  },
  {
    id: 2,
    categoria: 'cocinas',
    nombre: 'Cocina Minimalista',
    descripcion: 'Diseño contemporáneo con líneas limpias',
    precio: '$12,000',
    imagen: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500'
  },
  {
    id: 3,
    categoria: 'camas',
    nombre: 'Cama King Size',
    descripcion: 'Cama de madera maciza con diseño elegante',
    precio: '$8,000',
    imagen: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500'
  },
  {
    id: 4,
    categoria: 'camas',
    nombre: 'Recámara Completa',
    descripcion: 'Set completo con cama, buró y closet',
    precio: '$18,000',
    imagen: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'
  },
  {
    id: 5,
    categoria: 'puertas',
    nombre: 'Puerta Principal Tallada',
    descripcion: 'Puerta de madera con tallados artesanales',
    precio: '$5,000',
    imagen: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500'
  },
  {
    id: 6,
    categoria: 'ventanas',
    nombre: 'Ventanas de Madera',
    descripcion: 'Ventanas con marco de madera tratada',
    precio: '$3,500',
    imagen: 'https://images.unsplash.com/photo-1545259742-24f9c8b0d9ab?w=500'
  }
];

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { id } = req.query;

  // Si hay ID en la query, buscar producto específico
  if (id) {
    const producto = productos.find(p => p.id === parseInt(id));
    if (producto) {
      return res.status(200).json(producto);
    } else {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  }

  // Si no hay ID, filtrar por categoría o devolver todos
  const { categoria } = req.query;
  if (categoria) {
    const filtrados = productos.filter(p => p.categoria === categoria);
    return res.status(200).json(filtrados);
  }

  res.status(200).json(productos);
}
