import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import * as elements from 'typed-html';
import { html } from '@elysiajs/html';
import Todos from '../components/Todos';
import TodoItem from '../components/TodoItem';
import { todos } from '../db/schema';
import { db } from '../db';

const todosRouter = new Elysia();

todosRouter.use(html()).group('/todos', (app) =>
    app
        .get('/', async () => {
            const data = await db.select().from(todos).all();
            return <Todos data={data} />;
        })
        .post(
            '/',
            async ({ body }) => {
                if (body.title.length === 0) {
                    throw new Error('Title cannot be empty');
                }

                const todo = await db
                    .insert(todos)
                    .values({
                        title: body.title,
                        completed: false,
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
            async ({ params, set }) => {
                const old = await db
                    .select()
                    .from(todos)
                    .where(eq(todos.id, params.id))
                    .get();
                if (!old) {
                    set.status = 404;
                    return;
                }
                const updated = await db
                    .update(todos)
                    .set({ completed: !old?.completed })
                    .where(eq(todos.id, params.id))
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
            async ({ params }) => {
                await db.delete(todos).where(eq(todos.id, params.id)).run();
            },
            { params: t.Object({ id: t.Numeric() }) }
        )
);

export default todosRouter;
