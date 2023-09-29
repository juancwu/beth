import { unique, integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, InferInsertModel, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export type UserMetadata = {
    roles: string[];
};

export const users = sqliteTable('users', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    metadata: text('metadata', { mode: 'json' }).$type<UserMetadata>(),
});

export const todos = sqliteTable('todos', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    completed: integer('completed', { mode: 'boolean' }).notNull(),
    userId: integer('userId', { mode: 'number' })
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
        }),
    listId: integer('listId', { mode: 'number' }).references(
        () => todosLists.id,
        { onDelete: 'cascade' }
    ),
});

export const todosLists = sqliteTable(
    'todosLists',
    {
        id: integer('id', { mode: 'number' }).primaryKey({
            autoIncrement: true,
        }),
        title: text('title').notNull(),
        userId: integer('userId', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (t) => ({
        uniqListTitle: unique().on(t.title, t.userId),
    })
);

export const sessions = sqliteTable('sessions', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    userId: integer('userId', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: text('expiresAt').notNull(),
    createdAt: text('createdAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    ref: text('ref').notNull().$defaultFn(nanoid).unique(),
    userAgent: text('userAgent'),
});

export type UserSelect = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type TodoSelect = InferSelectModel<typeof todos>;
export type TodoInsert = InferInsertModel<typeof todos>;
export type SessionSelect = InferSelectModel<typeof sessions>;
export type SessionInsert = InferInsertModel<typeof sessions>;
export type TodoListSelect = InferSelectModel<typeof todosLists>;
export type TodoListInsert = InferInsertModel<typeof todosLists>;
