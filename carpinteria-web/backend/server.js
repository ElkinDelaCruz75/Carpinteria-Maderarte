import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'carpinteria_maderarte';

const cloudinaryConfig = process.env.CLOUDINARY_URL
  ? { cloudinary_url: process.env.CLOUDINARY_URL }
  : {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    };

cloudinary.config(cloudinaryConfig);

const isCloudinaryReady = Boolean(
  (process.env.CLOUDINARY_URL) ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET)
);

const storage = multer.memoryStorage();

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

const ensureCloudinaryConfigured = (res) => {
  if (!isCloudinaryReady) {
    res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
    return false;
  }
  return true;
};

const stripFolder = (publicId) => {
  if (!publicId || !CLOUDINARY_FOLDER) return publicId;
  const prefix = `${CLOUDINARY_FOLDER}/`;
  return publicId.startsWith(prefix) ? publicId.slice(prefix.length) : publicId;
};

const withFolder = (id) => {
  if (!CLOUDINARY_FOLDER) return id;
  return id.startsWith(`${CLOUDINARY_FOLDER}/`) ? id : `${CLOUDINARY_FOLDER}/${id}`;
};

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: 'Servidor de Carpintería Maderarte activo',
    endpoints: {
      productos: 'GET /api/productos',
      productoId: 'GET /api/productos/:id',
      subir: 'POST /api/upload',
      imagenes: 'GET /api/imagenes',
      eliminarImagen: 'DELETE /api/imagenes/:id'
    }
  });
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
app.post('/api/upload', upload.single('imagen'), async (req, res) => {
  if (!ensureCloudinaryConfigured(res)) return;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          resource_type: 'image'
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          return resolve(uploadResult);
        }
      );

      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      filename: stripFolder(result.public_id)
    });
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Obtener todas las imágenes
app.get('/api/imagenes', async (req, res) => {
  if (!ensureCloudinaryConfigured(res)) return;

  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: CLOUDINARY_FOLDER ? `${CLOUDINARY_FOLDER}/` : undefined,
      resource_type: 'image',
      max_results: 100
    });

    const imagenes = resources.map((img) => ({
      filename: stripFolder(img.public_id),
      url: img.secure_url
    }));

    res.json(imagenes);
  } catch (error) {
    console.error('Error al listar imágenes en Cloudinary:', error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
});

// Eliminar imagen
app.delete('/api/imagenes/:filename', async (req, res) => {
  if (!ensureCloudinaryConfigured(res)) return;

  try {
    const publicId = withFolder(req.params.filename);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'not found') {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    res.json({ success: true, mensaje: 'Imagen eliminada' });
  } catch (error) {
    console.error('Error al eliminar imagen en Cloudinary:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
