import cloudinary from 'cloudinary';
import { envConfig } from '../config';

cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_API_SECRET,
});

export default cloudinary;