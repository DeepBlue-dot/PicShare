// cloudinaryUtils.js
import cloudinary from 'cloudinary';
import dotenv from "dotenv";
dotenv.config()


// Configure Cloudinary using environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadFileToCloudinary = async (file, publicId) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'auto'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:');
    throw error;
  }
};


export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:');
    throw error;
  }
};
