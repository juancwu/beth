import Elysia from 'elysia';
import * as pc from 'picocolors';
import type { StoreWithMaybeUser } from './protect';

export const log = {
    info: (...text: string[]) => {
        console.log(pc.blue('INFO:'), text.join(' '));
    },
};

export type LoggerConfig = {
    logRequest?: boolean;
};

export const logger = (config: LoggerConfig = {}) => {
    if (config.logRequest === undefined) config.logRequest = true;

    return new Elysia({
        name: '@juancwu/beth/logger',
        seed: config,
    }).onAfterHandle(({ request, store }) => {
        const { user } = store as StoreWithMaybeUser;
        if (config.logRequest) {
            const url = new URL(request.url);
            log.info(
                `${request.method.toUpperCase()} ${
                    url.pathname
                } | auth: ${!!user}`
            );
        }
    });
};
