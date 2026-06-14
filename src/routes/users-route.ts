import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-services";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post("/", async ({ body, set }) => {
    const result = await registerUser(body);
    
    if (!result.success) {
      set.status = 400;
      return {
        success: false,
        message: result.message,
        data: null as any
      };
    }
    
    set.status = 201;
    return result;
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 1 }),
    })
  });
