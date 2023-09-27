import Html from '@kitajs/html';
import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { sessions, users } from '../db/schema';
import { html } from '@elysiajs/html';
import { jwt } from '@elysiajs/jwt';
import { db } from '../db';
import jwtConfig from '../configs/jwt';
import {
    type StoreWithMaybeUser,
    type StoreWithSession,
    protect,
} from '../plugins/protect';
import HttpStatus from '../enums/http-status';
import Base from '../components/Base';
import { SignIn } from '../components/SignIn';
import { SignUp } from '../components/SignUp';

const routeGuard = {
    body: t.Object({
        email: t.String({
            minLength: 1,
        }),
        password: t.String({
            minLength: 8,
            error: 'Password must of length greater or equal to 8',
        }),
    }),
};

const authRoutes = new Elysia({
    prefix: '/auth',
});

authRoutes
    .use(
        protect({
            post: ['/auth/sign-out'],
        })
    )
    .use(html())
    .use(jwt(jwtConfig))
    .guard(routeGuard)
    .get('/sign-in', async ({ set, html, store }) => {
        const { user } = store as StoreWithMaybeUser;
        if (user) {
            set.redirect = '/';
            return;
        }

        return html(
            <Base>
                <SignIn />
            </Base>
        );
    })
    .get('/sign-up', async ({ set, html, store }) => {
        const { user } = store as StoreWithMaybeUser;
        if (user) {
            set.redirect = '/';
            return;
        }

        return html(
            <Base>
                <SignUp />
            </Base>
        );
    })
    .post('/sign-in', async ({ jwt, body, cookie, set, headers, store }) => {
        if ((store as StoreWithMaybeUser).user) {
            set.status = HttpStatus.BAD_REQUEST;
            return 'Already Signed In';
        }

        const { email, password } = body;
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .get();
        if (!user) {
            set.status = HttpStatus.BAD_REQUEST;
            return 'Invalid Credentials';
        }

        const isMatched = await Bun.password.verify(password, user.password);
        if (!isMatched) {
            set.status = HttpStatus.BAD_REQUEST;
        }

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);
        const newSession = await db
            .insert(sessions)
            .values({
                userId: user.id,
                expiresAt: currentDate.getTime().toString(),
                userAgent: headers['user-agent'] ?? null,
            })
            .returning()
            .get();

        const token = await jwt.sign({ sessionRef: newSession.ref });

        cookie.session.set({
            httpOnly: true,
            secure: true,
            maxAge: 604800,
            value: token,
            path: '/',
            sameSite: 'strict',
        });

        set.headers['HX-Redirect'] = '/';
        return;
    })
    .post('/sign-up', async ({ body, set, store }) => {
        if ((store as StoreWithMaybeUser).user) {
            set.status = HttpStatus.BAD_REQUEST;
            return 'Already Signed In';
        }

        const { email, password } = body;
        if (!email || !password) {
            set.status = HttpStatus.BAD_REQUEST;
            return 'No email or password given';
        }
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .get();
        if (user) {
            set.status = HttpStatus.BAD_REQUEST;
            return 'User already exists';
        }

        await db.insert(users).values({
            email: email,
            password: await Bun.password.hash(password),
        });

        set.status = HttpStatus.CREATED;
        set.headers['HX-Redirect'] = '/auth/sign-in';
    })
    .post('/sign-out', async ({ set, cookie, store }) => {
        const { session } = store as StoreWithSession;
        await db.delete(sessions).where(eq(sessions.id, session.id)).run();
        cookie.session.remove();
        set.headers['HX-Redirect'] = '/auth/sign-in';
    });

export default authRoutes;
