import { users, roles, rolePermissions, permissions } from "@/drizzle/schema";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { env } from "./env/server";
import { db } from "@/drizzle";

const secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    return await decrypt(token);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.id) return null;

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      picture: users.picture,
      role: roles.role,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, session.id))
    .limit(1);

  return user;
}

export async function hasPermission(
  userId: string,
  requiredPermission: string,
) {
  // Fetch the user's permissions via a series of joins:
  const results = await db
    .select({
      permissionName: permissions.name,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(users.id, userId));

  if (!results || results.length === 0) return false;

  return results.some((row) => row.permissionName === requiredPermission);
}
