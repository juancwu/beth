import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export const client = createClient({
    url: process.env.DATABASE_URL as string,
    authToken: process.env.AUTH_TOKEN,
});

export const db = drizzle(client);

async function main() {
    try {
        await migrate(db, {
            migrationsFolder: 'migrations',
        });
        console.log('Migration Completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error Performing Migration: ', error);
        process.exit(1);
    }
}

main();
