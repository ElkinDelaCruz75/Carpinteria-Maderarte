import { cloudinary, isCloudinaryReady, withFolder } from '../_config.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  if (!isCloudinaryReady) {
    return res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
  }

  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename es requerido' });
  }

  try {
    const publicId = withFolder(filename);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'not found') {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    res.status(200).json({ success: true, mensaje: 'Imagen eliminada' });
  } catch (error) {
    console.error('Error al eliminar imagen en Cloudinary:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
}
