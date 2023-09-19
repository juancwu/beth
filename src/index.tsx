import { Elysia } from 'elysia';
import todosRouter from './routes/todos-router';
import { html } from '@elysiajs/html';
import { cookie } from '@elysiajs/cookie';
import * as elements from 'typed-html';
import App from './components/App';

const app = new Elysia()
    .use(html())
    .use(
        cookie({
            httpOnly: true,
            secure: true,
        })
    )
    .use(todosRouter)
    .get('/', ({ html }) => html(<App />))
    .get('/styles.css', () => Bun.file('./dist/styles.css'))
    .listen(Number(process.env.PORT as string));

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
