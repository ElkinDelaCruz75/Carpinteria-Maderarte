import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  }
});

app.use(cors());
app.use(express.json());

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(uploadsDir));

// Servir la página HTML de galería
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: 'Servidor de Carpintería Maderarte activo',
    endpoints: {
      productos: 'GET /api/productos',
      productoId: 'GET /api/productos/:id',
      subir: 'POST /api/upload',
      imagenes: 'GET /api/imagenes',
      eliminarImagen: 'DELETE /api/imagenes/:filename'
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Datos de ejemplo (en producción usarías una base de datos)
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

// Rutas
app.get('/api/productos', (req, res) => {
  const { categoria } = req.query;
  if (categoria) {
    const filtrados = productos.filter(p => p.categoria === categoria);
    return res.json(filtrados);
  }
  res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

// Subir imagen
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ 
      success: true,
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Obtener todas las imágenes
app.get('/api/imagenes', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const imagenes = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `http://localhost:${PORT}/uploads/${file}`
      }));
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
});

// Eliminar imagen
app.delete('/api/imagenes/:filename', (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, mensaje: 'Imagen eliminada' });
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
