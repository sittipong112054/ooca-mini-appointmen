import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "appointment_user",
      password: process.env.DB_PASSWORD || "sittipong112054",
      database: process.env.DB_NAME || "appointment_db",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });