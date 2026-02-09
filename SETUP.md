# Database Setup

This project uses **Neon** (PostgreSQL) and **Drizzle ORM**.

If you are encountering issues where data is not saving (e.g., "Failed to save prompt"), it is likely because the database tables have not been created in your deployed environment.

## 1. Environment Variables

Ensure you have the `POSTGRES_URL` environment variable set in your Vercel project settings or `.env.local` file.

## 2. Push Schema to Database

You must push the database schema to creating the tables. Run the following command locally (ensure your `.env.local` has the correct connection string):

```bash
npm run db:push
```

If you are running this against a production database, make sure you are connecting to the correct URL.

## 3. Seed Data (Optional)

To populate the database with initial categories and prompts:

```bash
npm run db:seed
```

## 4. Verify

After pushing the schema, you can verify the tables exist by running:

```bash
npm run db:studio
```

This will open Drizzle Studio where you can view your database tables.
