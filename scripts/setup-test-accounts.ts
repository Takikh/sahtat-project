/**
 * Setup Test Accounts for Sahtat Promotion
 * 
 * This script creates admin and client test accounts in Supabase
 * Run with: npx tsx scripts/setup-test-accounts.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qceaqlzljkxqxhqqqcdx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZWFxbHpsamt4cXhocXFxY2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDk0NjgsImV4cCI6MjA4NjIyNTQ2OH0.ng5UCsEVy-mVy02Wa_PUBKA_ePZ4Z_xpCkcMzc5Hso4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface TestAccount {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'client';
}

const testAccounts: TestAccount[] = [
    {
        email: 'admin@sahtat-promotion.com',
        password: 'Admin123!',
        fullName: 'Admin Sahtat',
        role: 'admin',
    },
    {
        email: 'client@test.com',
        password: 'Client123!',
        fullName: 'Test Client',
        role: 'client',
    },
];

async function createTestAccount(account: TestAccount) {
    console.log(`\n📝 Creating ${account.role} account: ${account.email}`);

    try {
        // Sign up the user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: account.email,
            password: account.password,
            options: {
                data: {
                    full_name: account.fullName,
                },
            },
        });

        if (signUpError) {
            if (signUpError.message.includes('already registered')) {
                console.log(`⚠️  Account already exists: ${account.email}`);
                return;
            }
            throw signUpError;
        }

        if (!authData.user) {
            throw new Error('User creation failed - no user data returned');
        }

        console.log(`✅ User created with ID: ${authData.user.id}`);

        // If admin role, we need to add it manually via SQL
        if (account.role === 'admin') {
            console.log(`⚠️  Admin role needs to be assigned manually via Supabase Dashboard`);
            console.log(`   Run this SQL query in Supabase SQL Editor:`);
            console.log(`   INSERT INTO public.user_roles (user_id, role)`);
            console.log(`   VALUES ('${authData.user.id}', 'admin');`);
        }

        console.log(`✅ ${account.role} account created successfully!`);
    } catch (error) {
        console.error(`❌ Error creating ${account.role} account:`, error);
    }
}

async function main() {
    console.log('🚀 Setting up test accounts for Sahtat Promotion...\n');
    console.log('='.repeat(60));

    for (const account of testAccounts) {
        await createTestAccount(account);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✨ Test Account Setup Complete!\n');
    console.log('📋 Test Credentials:\n');

    testAccounts.forEach((account) => {
        console.log(`${account.role.toUpperCase()}:`);
        console.log(`  Email: ${account.email}`);
        console.log(`  Password: ${account.password}`);
        console.log(`  Access: http://localhost:8080/${account.role === 'admin' ? 'admin' : 'dashboard'}\n`);
    });

    console.log('⚠️  IMPORTANT: Admin role must be assigned manually via Supabase Dashboard');
    console.log('   Go to: https://supabase.com/dashboard/project/qceaqlzljkxqxhqqqcdx');
    console.log('   Navigate to: SQL Editor');
    console.log('   Run the SQL query shown above for the admin account\n');
}

main();
