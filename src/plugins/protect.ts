import { Elysia } from 'elysia';
import { eq } from 'drizzle-orm';
import { type JWTPayloadSpec, jwt } from '@elysiajs/jwt';
import { db } from '../db';
import jwtConfig from '../configs/jwt';
import { sessions, users } from '../db/schema';
import HttpStatus from '../enums/http-status';
import type { UserSelect, SessionSelect } from '../db/schema';

export type RequestMethod =
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'options'
    | 'head';

export type ProtectConfig = {
    [method in RequestMethod]?: string[];
};

export function matchRoute(route: string, pathname: string): boolean {
    const regex = new RegExp(
        '^' + route.replace(/:[^\s/]+/g, '([\\w-]+)') + '$'
    );
    return regex.test(pathname);
}

export type SessionToken =
    | ({
          sessionRef: string;
      } & JWTPayloadSpec)
    | false;

export type StoreWithUser = { user: UserSelect };
export type StoreWithSession = { session: SessionSelect };
export type StoreWithMaybeUser = { user?: UserSelect };
export type StoreWithMaybeSession = { session?: SessionSelect };
export type StoreWithAuth = StoreWithUser & StoreWithSession;
export type StoreWithMaybeAuth = StoreWithMaybeUser & StoreWithMaybeSession;

export const protect = (config: ProtectConfig = {}) => {
    if (!config.get) config.get = [];
    if (!config.post) config.post = [];
    if (!config.head) config.head = [];
    if (!config.put) config.put = [];
    if (!config.patch) config.patch = [];
    if (!config.delete) config.delete = [];
    if (!config.options) config.options = [];

    return new Elysia({
        name: '@juancwu/beth/protect',
        seed: config,
    })
        .use(jwt(jwtConfig))
        .onBeforeHandle(async (context) => {
            const url = new URL(context.request.url);
            const method =
                context.request.method.toLowerCase() as RequestMethod;
            const routes = config[method];

            if (!routes) {
                context.set.status = HttpStatus.NOT_IMPLEMENTED;
                return 'Not Implemented';
            }

            const isProtected = routes.some((route) =>
                matchRoute(route, url.pathname)
            );

            if (!isProtected && !context.cookie?.session?.value) {
                // continue with route
                return;
            }

            if (isProtected && !context.cookie?.session?.value) {
                context.set.status = HttpStatus.UNAUTHORIZED;
                return 'Unauthorized';
            }

            let token: SessionToken = false;
            try {
                token = (await context.jwt.verify(
                    context.cookie.session.value
                )) as SessionToken;
            } catch {
                if (isProtected) {
                    context.cookie.session.remove();
                    context.set.status = HttpStatus.UNAUTHORIZED;
                    return 'Unauthorized';
                }
            }

            if (!token && isProtected) {
                context.cookie.session.remove();
                context.set.status = HttpStatus.UNAUTHORIZED;
                return 'Unauthorized';
            } else if (!token) {
                return;
            }

            const sessionInfo = await db
                .select()
                .from(sessions)
                .where(eq(sessions.ref, token.sessionRef))
                .get();

            if (isProtected && !sessionInfo) {
                context.cookie.session.remove();
                context.set.status = HttpStatus.UNAUTHORIZED;
                return 'Unauthorized';
            }

            let user: UserSelect | undefined = undefined;
            if (sessionInfo) {
                if (+sessionInfo.expiresAt < Date.now()) {
                    await db
                        .delete(sessions)
                        .where(eq(sessions.ref, token.sessionRef))
                        .run();
                    context.cookie.session.remove();
                    return;
                }
                user = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, sessionInfo.userId))
                    .get();
            }

            if (isProtected && !user) {
                context.cookie.session.remove();
                context.set.status = HttpStatus.UNAUTHORIZED;
                return 'Unauthorized';
            }

            context.store = {
                user: user,
                session: sessionInfo,
                ...context.store,
            };
        });
};
