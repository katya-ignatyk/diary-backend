import * as _ from 'lodash';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import cloudinary from '../utils/cloudinary';
import { UploadError, DeleteFolderError, ImagePublicIdError } from '../utils/errors/cloudinary';

interface IFileRequest {
    encoding : string;
    mimetype : string;
    buffer : ArrayBuffer;
    size : number;
}

enum deleteResult {
    OK = 'ok',
    NOT_FOUND = 'not found'
}

export class CloudinaryService {
    private static instance : CloudinaryService;

    public static get Instance() : CloudinaryService {
        if (!CloudinaryService.instance)
            CloudinaryService.instance = new CloudinaryService();
        return CloudinaryService.instance;
    }

    public upload(options : UploadApiOptions , file : IFileRequest) : Promise<Partial<UploadApiResponse>> {
        return new Promise<Partial<UploadApiResponse>>((resolve) => {
            cloudinary.v2.uploader.upload_stream({
                ...options, 
                resource_type: 'auto',
            },(err, result) => {
                if (err) {
                    throw new UploadError(err.http_code, err.message);
                }

                result && resolve({
                    url: result.url,
                    public_id: result.public_id
                });
            }).end(file.buffer);
        });
    }

    public async delete(imagePublicId : string) {
        const deletedPhoto = await cloudinary.v2.uploader.destroy(imagePublicId);
    
        if (deletedPhoto.result === deleteResult.NOT_FOUND) {
            throw new ImagePublicIdError();
        }

        return deletedPhoto;
    }

    public getImageUrl(publicId : string) {
        return cloudinary.v2.url(
            publicId
        );
    }

    public async deleteFolder(folder : string) {
        const deleteResponse = await cloudinary.v2.api.delete_resources_by_prefix(folder);

        return new Promise((resolve) => {
            if (_.isEmpty(deleteResponse.deleted)) {
                return resolve(false);
            }

            return cloudinary.v2.api.delete_folder(folder, function(error, result) {
                if (error) {
                    throw new DeleteFolderError(error.http_code, error.message);
                }

                result && resolve(true);
            });
        });
    }

}