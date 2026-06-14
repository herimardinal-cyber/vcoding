import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(data: CreateUserDto) {
  try {
    // Hash the password using Bun's built-in bcrypt hasher
    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // Insert the user into the database
    const [insertResult] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Retrieve the created user
    const newUserId = insertResult.insertId;
    const [newUser] = await db.select().from(users).where(eq(users.id, newUserId)).limit(1);

    if (!newUser) {
      throw new Error("Failed to retrieve created user");
    }

    return {
      success: true,
      message: "User created",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.createdAt ? newUser.createdAt.toISOString() : new Date().toISOString(),
      },
    };
  } catch (error: any) {
    let errorMessage = "Internal Server Error";
    if (error.code === "ER_DUP_ENTRY") {
      errorMessage = "Email is already registered";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
}
