import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    return await db.select().from(users);
  })
  .get("/:id", async ({ params: { id }, error }) => {
    const userId = Number(id);
    if (isNaN(userId)) {
      return error(400, { message: "Invalid ID parameter" });
    }
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (result.length === 0) {
      return error(404, { message: "User not found" });
    }
    return result[0];
  })
  .post("/", async ({ body }) => {
    await db.insert(users).values(body);
    return { success: true, message: "User created" };
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
    })
  })
  .put("/:id", async ({ params: { id }, body, error }) => {
    const userId = Number(id);
    if (isNaN(userId)) {
      return error(400, { message: "Invalid ID parameter" });
    }
    await db.update(users).set(body).where(eq(users.id, userId));
    return { success: true, message: "User updated" };
  }, {
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      email: t.Optional(t.String({ format: "email" })),
    })
  })
  .delete("/:id", async ({ params: { id }, error }) => {
    const userId = Number(id);
    if (isNaN(userId)) {
      return error(400, { message: "Invalid ID parameter" });
    }
    await db.delete(users).where(eq(users.id, userId));
    return { success: true, message: "User deleted" };
  });
