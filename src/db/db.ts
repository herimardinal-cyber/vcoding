import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/vcoding";

const poolConnection = mysql.createPool(connectionString);

export const db = drizzle(poolConnection, { schema, mode: "default" });
export type DbType = typeof db;
