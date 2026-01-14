import multiparty from 'multiparty';
import { cloudinary, isCloudinaryReady, stripFolder, CLOUDINARY_FOLDER } from './_config.js';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  if (!isCloudinaryReady) {
    return res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
  }

  try {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al parsear formulario:', err);
        return res.status(400).json({ error: 'Error al procesar el archivo' });
      }

      const file = files.imagen?.[0];
      if (!file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
      }

      try {
        // Obtener la categoría del formulario y capitalizarla
        const categoria = fields.categoria?.[0] || 'general';
        const categoriaCapitalizada = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        const folderPath = `${CLOUDINARY_FOLDER}/${categoriaCapitalizada}`;

        const result = await cloudinary.uploader.upload(file.path, {
          folder: folderPath,
          resource_type: 'image'
        });

        res.status(200).json({
          success: true,
          url: result.secure_url,
          filename: stripFolder(result.public_id),
          categoria: categoria
        });
      } catch (uploadError) {
        console.error('Error al subir imagen a Cloudinary:', uploadError);
        res.status(500).json({ error: 'Error al subir la imagen' });
      }
    });
  } catch (error) {
    console.error('Error en upload:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
}
