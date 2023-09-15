import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { eq } from "drizzle-orm";
import * as elements from "typed-html";
import App from "./components/App";
import Todos from "./components/Todos";
import TodoItem from "./components/TodoItem";
import { todos } from "./db/schema";
import { db } from "./db";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) => html(<App />))
  .get("/todos", async () => {
    const data = await db.select().from(todos).all();
    return <Todos data={data} />;
  })
  .get("/styles.css", () => Bun.file("./dist/styles.css"))
  .post(
    "/todos",
    async ({ body }) => {
      if (body.title.length === 0) {
        throw new Error("Title cannot be empty");
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
    "/todos/toggle/:id",
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
    "/todos/:id",
    async ({ params }) => {
      await db.delete(todos).where(eq(todos.id, params.id)).run();
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .listen(Number(process.env.PORT as string));

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
