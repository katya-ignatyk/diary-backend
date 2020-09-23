import { join } from 'path';

declare module 'cloudinary' {
  const config : (options : IConfigOptions) => void;
  namespace v2{
    namespace api {
      function delete_folder(folder : string, handler : (error, result) => void)
    }
  }
}

interface IConfigOptions {
  cloud_name : string;
  api_key : string;
  api_secret : string;
  secure ?: boolean;
}