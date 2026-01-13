import { cloudinary, isCloudinaryReady, stripFolder, CLOUDINARY_FOLDER } from './_config.js';

export default async function handler(req, res) {
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

  if (!isCloudinaryReady) {
    return res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
  }

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

    res.status(200).json(imagenes);
  } catch (error) {
    console.error('Error al listar imágenes en Cloudinary:', error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
}
