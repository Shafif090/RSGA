import { config } from "dotenv";

config({ path: ".env" }); // Always try to load .env

export const { PORT, NODE_ENV } = process.env;
