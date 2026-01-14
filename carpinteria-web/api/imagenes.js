import { cloudinary, isCloudinaryReady, stripFolder, CLOUDINARY_FOLDER } from './_config.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    if (!isCloudinaryReady) {
      return res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
    }

    try {
      const { categoria } = req.query;

      let prefix = CLOUDINARY_FOLDER;
      
      // Si hay categoría especificada y no es "todos", agregar a la ruta
      if (categoria && categoria !== 'todos') {
        // Convertir la categoría a mayúscula inicial para coincidir con Cloudinary
        const categoriaCapitalizada = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        prefix = `${CLOUDINARY_FOLDER}/${categoriaCapitalizada}`;
      }

      console.log(`🔍 Buscando imágenes con prefix: "${prefix}"`);

      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: prefix,
        resource_type: 'image',
        max_results: 500
      });

      console.log(`✅ Se encontraron ${resources.length} imágenes`);

      const imagenes = resources.map((img) => ({
        filename: stripFolder(img.public_id),
        url: img.secure_url,
        public_id: img.public_id,
        categoria: categoria || 'todos'
      }));

      return res.status(200).json(imagenes);
    } catch (error) {
      console.error('❌ Error al listar imágenes en Cloudinary:', error.message);
      return res.status(500).json({ 
        error: 'Error al obtener imágenes', 
        details: error.message 
      });
    }
  } else if (req.method === 'DELETE') {
    if (!isCloudinaryReady) {
      return res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
    }

    try {
      const { public_id } = req.query;
      
      if (!public_id) {
        return res.status(400).json({ error: 'Se requiere public_id' });
      }

      console.log('Eliminando imagen con public_id:', public_id);
      
      const result = await cloudinary.uploader.destroy(public_id);

      console.log('Resultado de eliminación:', result);

      if (result.result === 'not found') {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }

      return res.status(200).json({ success: true, mensaje: 'Imagen eliminada', result: result.result });
    } catch (error) {
      console.error('Error al eliminar imagen en Cloudinary:', error);
      return res.status(500).json({ error: 'Error al eliminar la imagen', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}
