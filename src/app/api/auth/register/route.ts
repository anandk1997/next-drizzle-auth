import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/index";
import { insertUserSchema, roles, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm/expressions";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a registration schema that omits fields managed by the server
    const registrationSchema = insertUserSchema.omit({
      roleId: true,
      createdAt: true,
      updatedAt: true,
    });

    // Validate the request body using the adjusted schema
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const { email, password, name, picture } = parsed.data;

    // Check if a user with the same email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Retrieve the role record for 'user' from the roles table
    let [userRole] = await db
      .select()
      .from(roles)
      .where(eq(roles.role, "user"))
      .limit(1);

    // Fallback: Insert the default role if not found
    if (!userRole) {
      const insertedRoles = await db
        .insert(roles)
        .values({
          role: "user",
        })
        .returning();
      userRole = insertedRoles[0];
      if (!userRole) {
        throw new Error("User role not found and could not be created");
      }
    }

    // Insert the new user using the fetched roleId
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        picture,
        roleId: userRole.id, // Automatically assign the 'user' role
      })
      .returning();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
