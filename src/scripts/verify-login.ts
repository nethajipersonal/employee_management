import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function verifyLogin() {
    console.log('🔄 Verifying login credentials...');
    try {
        const { default: dbConnect } = await import('../lib/mongodb');
        const { default: User } = await import('../models/User');

        await dbConnect();

        const email = 'admin@company.com';
        const passwordsToCheck = ['admin123', 'admin@123'];

        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ User ${email} not found!`);
            process.exit(1);
        }

        console.log(`👤 Found user: ${email}`);

        for (const password of passwordsToCheck) {
            const isValid = await user.comparePassword(password);
            if (isValid) {
                console.log(`✅ Password '${password}' is VALID`);
            } else {
                console.log(`❌ Password '${password}' is INVALID`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    }
}

verifyLogin();
