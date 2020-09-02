import { UploadApiOptions } from 'cloudinary';
import cloudinary from '../utils/cloudinary';
import { UploadError } from '../utils/errors/cloudinary/UploadError';

interface IFileRequest {
    encoding : string;
    mimetype : string;
    buffer : ArrayBuffer;
    size : number;
}

export class CloudinaryService {
    private static instance : CloudinaryService;

    public static get Instance() : CloudinaryService {
        if (!CloudinaryService.instance)
            CloudinaryService.instance = new CloudinaryService();
        return CloudinaryService.instance;
    }

    public upload(options : UploadApiOptions , file : IFileRequest) : Promise<string> {
        return new Promise((resolve) => {
            return cloudinary.v2.uploader.upload_stream({
                ...options, 
                resource_type: 'auto',
            },
            (err, result) => {
                if (err) {
                    throw new UploadError(err.http_code, err.message);
                }

                result && resolve(result.public_id);
            }).end(file.buffer);
        });
    }

    public delete(imagePublicId : string) {
        return cloudinary.v2.uploader.destroy(imagePublicId);
    }

    public getImageUrl(publicId : string) {
        return cloudinary.v2.url(
            publicId
        );
    }
}