import { v2 as cloudinary } from 'cloudinary';

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

const stripFolder = (publicId) => {
  if (!publicId || !CLOUDINARY_FOLDER) return publicId;
  const prefix = `${CLOUDINARY_FOLDER}/`;
  return publicId.startsWith(prefix) ? publicId.slice(prefix.length) : publicId;
};

const withFolder = (id) => {
  if (!CLOUDINARY_FOLDER) return id;
  return id.startsWith(`${CLOUDINARY_FOLDER}/`) ? id : `${CLOUDINARY_FOLDER}/${id}`;
};

export { cloudinary, isCloudinaryReady, stripFolder, withFolder, CLOUDINARY_FOLDER };
