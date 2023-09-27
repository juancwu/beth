import Html from '@kitajs/html';
import { Elysia, t } from 'elysia';
import { and, eq } from 'drizzle-orm';
import { todos } from '../db/schema';
import { db } from '../db';
import {
    type ProtectConfig,
    type StoreWithUser,
    protect,
} from '../plugins/protect';
import Todos from '../components/Todos';
import TodoItem from '../components/TodoItem';
import HttpStatus from '../enums/http-status';

const protectConfig: ProtectConfig = {
    get: ['/todos'],
    post: ['/todos'],
    patch: ['/todos/toggle/:id'],
    delete: ['/todos/:id'],
};

const todosRoutes = new Elysia({
    prefix: '/todos',
});

todosRoutes
    .use(protect(protectConfig))
    .get('/', async ({ store }) => {
        const { user } = store as StoreWithUser;
        const data = await db
            .select()
            .from(todos)
            .where(eq(todos.userId, user.id))
            .all();
        return <Todos data={data} />;
    })
    .post(
        '/',
        async ({ body, set, store }) => {
            if (body.title.length === 0) {
                set.status = HttpStatus.BAD_REQUEST;
                return 'Title cannot be empty';
            }

            const user = (store as StoreWithUser).user;
            const todo = await db
                .insert(todos)
                .values({
                    title: body.title,
                    completed: false,
                    userId: user.id,
                })
                .returning()
                .get();

            return <TodoItem {...todo} />;
        },
        {
            body: t.Object({
                title: t.String(),
            }),
        }
    )
    .patch(
        '/toggle/:id',
        async ({ params, set, store }) => {
            const user = (store as StoreWithUser).user;
            const old = await db
                .select()
                .from(todos)
                .where(and(eq(todos.id, params.id), eq(todos.userId, user.id)))
                .get();
            if (!old) {
                set.status = 404;
                return;
            }
            const updated = await db
                .update(todos)
                .set({ completed: !old?.completed })
                .where(and(eq(todos.id, params.id), eq(todos.userId, user.id)))
                .returning()
                .get();
            return <TodoItem {...updated} />;
        },
        {
            params: t.Object({ id: t.Numeric() }),
        }
    )
    .delete(
        '/:id',
        async ({ params, store }) => {
            const user = (store as StoreWithUser).user;
            await db
                .delete(todos)
                .where(and(eq(todos.id, params.id), eq(todos.userId, user.id)))
                .run();
        },
        { params: t.Object({ id: t.Numeric() }) }
    );

export default todosRoutes;
