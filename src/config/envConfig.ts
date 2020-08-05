export const PORT = process.env.PORT || 5000;
export const DB_NAME = process.env.DATABASE_NAME;
export const PG_PASSWORD = process.env.PG_PASSWORD;
export const PG_USERNAME = process.env.PG_USERNAME;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_IS_LOGGING = process.env.DB_IS_LOGGING;
export const DB_IS_SYNCHRONIZE = process.env.DB_IS_SYNCHRONIZE || true;
export const SG_USERNAME = process.env.SG_USERNAME;
export const SG_PASSWORD = process.env.SG_PASSWORD;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_DEFAULT_SECRET = process.env.JWT_DEFAULT_SECRET;
export const JWT_ACCESS_EXPIRESIN = process.env.JWT_ACCESS_EXPIRESIN;
export const JWT_REFRESH_EXPIRESIN = process.env.JWT_REFRESH_EXPIRESIN;
export const JWT_DEFAULT_EXPIRESIN = process.env.JWT_DEFAULT_EXPIRESIN;
export const FE_ADDRESS = process.env.NODE_ENV === 'production'? 'https://news-katya.herokuapp.com': 'http://localhost:3000';