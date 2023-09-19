import { Elysia, t } from 'elysia';
import { users } from '../db/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const authRouter = new Elysia();
const authRouterBody = t.Object({
    email: t.String({
        minLength: 1,
    }),
    password: t.String({
        minLength: 8,
    }),
});

authRouter.group('/auth', (app) =>
    app
        .post(
            '/sign-in',
            async ({ body }) => {
                const { email, password } = body;
                const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .get();
                if (!user) {
                    throw new Error('No User Found');
                }

                const hashed = await Bun.password.hash(password);
                if (user.password !== hashed) {
                    throw new Error('Invalid Credentials');
                }

                // TODO: set session cookie
                return;
            },
            {
                body: authRouterBody,
            }
        )
        .post(
            '/sign-up',
            async ({ body }) => {
                const { email, password } = body;
                const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .get();
                if (user) {
                    throw new Error('User already exists');
                }

                const newUser = await db
                    .insert(users)
                    .values({
                        email: email,
                        password: await Bun.password.hash(password),
                    })
                    .returning()
                    .get();

                console.log(newUser);

                // TODO: set session cookie
                return;
            },
            {
                body: authRouterBody,
            }
        )
);

export default authRouter;
