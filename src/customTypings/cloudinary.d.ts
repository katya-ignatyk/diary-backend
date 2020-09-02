declare module 'cloudinary' {
  const config : (options : IConfigOptions) => void;
}

interface IConfigOptions {
  cloud_name : string;
  api_key : string;
  api_secret : string;
  secure ?: boolean;
}