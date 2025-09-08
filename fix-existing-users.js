const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://njsfbchypeysfqfsjesa.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc2ZiY2h5cGV5c2ZxZnNqZXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc2MzczNywiZXhwIjoyMDY3MzM5NzM3fQ.RRpoOfpjiY6cJ8MBB1s70QpWDCzCPNHyZXhe20o6qmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixExistingUsers() {
  try {
    console.log('🔄 Starting existing user fix...');

    // Get all users
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError);
      return;
    }

    console.log(`📊 Found ${users.length} total users`);

    // Find users with fallback emails (clerk_id based emails)
    const fallbackUsers = users.filter(user => 
      user.email && (
        user.email.includes('@evvalley.com') || 
        user.email.startsWith('user_') ||
        user.email.includes('@€') ||
        user.email.endsWith('@')
      )
    );

    console.log(`🔍 Found ${fallbackUsers.length} users with fallback emails`);

    let totalUpdated = 0;
    let totalErrors = 0;

    for (const user of fallbackUsers) {
      console.log(`\n📧 Processing user: ${user.id} (${user.email})`);
      
      try {
        // Try to get real email from Clerk
        const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${user.clerk_id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (clerkResponse.ok) {
          const clerkUser = await clerkResponse.json();
          console.log('📧 Clerk user data:', clerkUser);
          
          let realEmail = user.email;
          let firstName = user.first_name || 'User';
          let lastName = user.last_name || 'Name';
          
          if (clerkUser.email_addresses && clerkUser.email_addresses.length > 0) {
            realEmail = clerkUser.email_addresses[0].email_address;
          }
          if (clerkUser.first_name) firstName = clerkUser.first_name;
          if (clerkUser.last_name) lastName = clerkUser.last_name;

          // Check if user with this real email already exists
          const { data: existingUserByEmail, error: emailCheckError } = await supabase
            .from('users')
            .select('id, email, clerk_id')
            .eq('email', realEmail)
            .single();

          if (existingUserByEmail && !emailCheckError && existingUserByEmail.id !== user.id) {
            console.log(`🔄 User with email ${realEmail} already exists (${existingUserByEmail.id}), merging...`);
            
            // Update vehicles to point to the existing user
            const { data: vehiclesBySellerId, error: vehiclesError1 } = await supabase
              .from('vehicles')
              .update({ seller_id: existingUserByEmail.id })
              .eq('seller_id', user.id)
              .select('id');

            if (vehiclesError1) {
              console.error(`❌ Error updating vehicles by seller_id:`, vehiclesError1);
            } else if (vehiclesBySellerId) {
              console.log(`🔄 Updated ${vehiclesBySellerId.length} vehicles by seller_id`);
            }

            const { data: vehiclesByEmail, error: vehiclesError2 } = await supabase
              .from('vehicles')
              .update({ seller_email: realEmail })
              .eq('seller_email', user.email)
              .select('id');

            if (vehiclesError2) {
              console.error(`❌ Error updating vehicles by seller_email:`, vehiclesError2);
            } else if (vehiclesByEmail) {
              console.log(`🔄 Updated ${vehiclesByEmail.length} vehicles by seller_email`);
            }

            // Delete the duplicate user
            const { error: deleteError } = await supabase
              .from('users')
              .delete()
              .eq('id', user.id);

            if (deleteError) {
              console.error(`❌ Error deleting user:`, deleteError);
              totalErrors++;
            } else {
              console.log(`✅ Deleted duplicate user: ${user.id}`);
              totalUpdated++;
            }
          } else {
            // Update the user with real email
            const { error: updateError } = await supabase
              .from('users')
              .update({
                email: realEmail,
                first_name: firstName,
                last_name: lastName
              })
              .eq('id', user.id);

            if (updateError) {
              console.error(`❌ Error updating user:`, updateError);
              totalErrors++;
            } else {
              console.log(`✅ Updated user with real email: ${realEmail}`);
              totalUpdated++;
            }
          }
        } else {
          console.log(`⚠️ Could not fetch from Clerk for user ${user.id}`);
          totalErrors++;
        }
      } catch (error) {
        console.error(`❌ Error processing user ${user.id}:`, error);
        totalErrors++;
      }
    }

    console.log(`\n🎉 Fix completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Users processed: ${fallbackUsers.length}`);
    console.log(`   - Successfully updated: ${totalUpdated}`);
    console.log(`   - Errors: ${totalErrors}`);

  } catch (error) {
    console.error('❌ Unexpected error during fix:', error);
  }
}

// Run the fix
fixExistingUsers();
