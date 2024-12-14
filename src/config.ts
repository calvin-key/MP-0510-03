import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const SUPABASE_HOST = process.env.SUPABASE_HOST;
export const SUPABASE_USER = process.env.SUPABASE_USER;
export const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;
export const SUPABASE_DATABASE = process.env.SUPABASE_DATABASE;
export const SUPABASE_PORT = Number(process.env.SUPABASE_PORT);
export const BASE_URL_FE = process.env.BASE_URL_FE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_SECRET_FORGOT_PASSWORD =
  process.env.JWT_SECRET_FORGOT_PASSWORD;
export const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
