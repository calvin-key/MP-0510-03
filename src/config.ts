import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const SUPABASE_HOST = process.env.SUPABASE_HOST;
export const SUPABASE_USER = process.env.SUPABASE_USER;
export const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;
export const SUPABASE_DATABASE = process.env.SUPABASE_DATABASE;
export const SUPABASE_PORT = Number(process.env.SUPABASE_PORT);
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
