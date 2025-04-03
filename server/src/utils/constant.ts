import { config } from "dotenv";
config();

export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const O1_KEY = process.env.O1_KEY;