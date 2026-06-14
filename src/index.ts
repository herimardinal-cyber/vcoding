import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/", () => "Welcome to Elysia + Drizzle + MySQL on Bun API!")
  .get("/health", () => ({ status: "OK", timestamp: new Date().toISOString() }))
  .use(usersRoute)
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
