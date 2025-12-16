import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function verifyConnection() {
    console.log('🔄 Attempting to connect to MongoDB...');
    try {
        // Dynamic import to ensure env vars are loaded first
        const { default: dbConnect } = await import('../lib/mongodb');

        await dbConnect();
        console.log('✅ Connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

verifyConnection();
