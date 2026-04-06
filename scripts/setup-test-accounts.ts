/**
 * Setup Test Accounts for Sahtat Promotion
 * 
 * This script creates admin and client test accounts in Supabase
 * Run with: npx tsx scripts/setup-test-accounts.ts
 */

import "dotenv/config";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in environment.");
}

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TestAccount {
    email: string;
    password: string;
    fullName: string;
    role: 'super_admin' | 'admin' | 'secretary' | 'client';
}

const testAccounts: TestAccount[] = [
    {
        email: 'owner@sahtat-promotion.com',
        password: 'Owner123!',
        fullName: 'Owner Sahtat',
        role: 'super_admin',
    },
    {
        email: 'admin@sahtat-promotion.com',
        password: 'Admin123!',
        fullName: 'Admin Sahtat',
        role: 'admin',
    },
    {
        email: 'secretary@sahtat-promotion.com',
        password: 'Secretary123!',
        fullName: 'Secretary Sahtat',
        role: 'secretary',
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

        // Staff roles must be assigned manually via SQL
        if (account.role === 'admin' || account.role === 'secretary' || account.role === 'super_admin') {
            console.log(`⚠️  Staff role needs to be assigned manually via Supabase Dashboard`);
            console.log(`   Run this SQL query in Supabase SQL Editor:`);
            console.log(`   INSERT INTO public.user_roles (user_id, role)`);
            console.log(`   VALUES ('${authData.user.id}', '${account.role}');`);
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
        console.log(`  Access: http://localhost:8080/${account.role === 'client' ? 'dashboard' : 'admin'}\n`);
    });

    const projectId = supabaseUrl.replace("https://", "").replace(".supabase.co", "");
    console.log('⚠️  IMPORTANT: Staff roles (super_admin/admin/secretary) must be assigned manually via Supabase Dashboard');
    console.log(`   Go to: https://supabase.com/dashboard/project/${projectId}`);
    console.log('   Navigate to: SQL Editor');
    console.log('   Run the SQL query shown above for the admin account\n');
}

main();
