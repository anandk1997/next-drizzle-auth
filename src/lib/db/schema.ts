// import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// export const users = pgTable('users', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   password: varchar('password', { length: 255 }).notNull(),
//   name: varchar('name', { length: 255 }).notNull(),
//   role: varchar('role', { length: 50 }).notNull().default('user'),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
// });

// export const permissions = pgTable('permissions', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', { length: 255 }).notNull().unique(),
//   description: text('description'),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
// });

// export const rolePermissions = pgTable('role_permissions', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   role: varchar('role', { length: 50 }).notNull().references(() => users.role),
//   permissionId: uuid('permission_id').notNull().references(() => permissions.id),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });

// // Relations
// export const usersRelations = relations(users, ({ many }) => ({
//   rolePermissions: many(rolePermissions),
// }));

// export const permissionsRelations = relations(permissions, ({ many }) => ({
//   rolePermissions: many(rolePermissions),
// }));

// // Schemas for validation
// export const insertUserSchema = createInsertSchema(users);
// export const selectUserSchema = createSelectSchema(users);
// export const insertPermissionSchema = createInsertSchema(permissions);
// export const selectPermissionSchema = createSelectSchema(permissions);
