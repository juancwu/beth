import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { logger } from './plugins/logger';
import App from './components/App';
import authRoutes from './routes/auth-routes';
import todosRoutes from './routes/todos-routes';
import { type StoreWithMaybeUser } from './plugins/protect';

const app = new Elysia();

app.use(html())
    .use(logger({ logRequest: true }))
    .use(authRoutes)
    .use(todosRoutes)
    .get('/', ({ html, set, store }) => {
        const { user } = store as StoreWithMaybeUser;

        if (!user) {
            set.redirect = '/auth/sign-in';
            return;
        }

        return html(<App />);
    })
    .get('/styles.css', ({ set }) => {
        if (process.env.APP_ENV !== 'dev') {
            set.headers['cache-control'] = 'public, max-age=604800';
        }
        return Bun.file('./dist/styles.css');
    })
    .guard({
        cookie: t.Cookie(
            {
                session: t.Optional(t.String()),
            },
            {
                secrets: [process.env.COOKIE_SECRET as string],
                sign: ['session'],
            }
        ),
    })
    .listen(Number(process.env.PORT as string));

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
