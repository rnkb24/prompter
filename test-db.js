const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.POSTGRES_URL);

async function testConnection() {
    try {
        const result = await sql`SELECT version()`;
        console.log('✅ Database connection successful!');
        console.log('PostgreSQL version:', result[0].version);

        // Test tables exist
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log('\n📋 Tables in database:', tables.map(t => t.table_name).join(', '));
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testConnection();
