import 'dotenv/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
});
