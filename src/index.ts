import { Elysia } from "elysia";
import { userRoutes } from "./routes/users";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/", () => "Welcome to Elysia + Drizzle + MySQL on Bun API!")
  .get("/health", () => ({ status: "OK", timestamp: new Date().toISOString() }))
  .use(userRoutes)
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
