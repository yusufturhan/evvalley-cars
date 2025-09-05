const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://njsfbchypeysfqfsjesa.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc2ZiY2h5cGV5c2ZxZnNqZXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc2MzczNywiZXhwIjoyMDY3MzM5NzM3fQ.RRpoOfpjiY6cJ8MBB1s70QpWDCzCPNHyZXhe20o6qmE';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function cleanupDuplicateUsers() {
  try {
    console.log('🔄 Starting duplicate user cleanup...');

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

    // Group users by email
    const emailGroups = {};
    users.forEach(user => {
      if (user.email) {
        if (!emailGroups[user.email]) {
          emailGroups[user.email] = [];
        }
        emailGroups[user.email].push(user);
      }
    });

    // Find duplicates
    const duplicates = Object.entries(emailGroups).filter(([email, userList]) => userList.length > 1);
    
    console.log(`🔍 Found ${duplicates.length} emails with duplicate users`);

    let totalDeleted = 0;
    let totalVehiclesUpdated = 0;

    for (const [email, userList] of duplicates) {
      console.log(`\n📧 Processing email: ${email} (${userList.length} duplicates)`);
      
      // Sort by created_at (keep the oldest one)
      userList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const keepUser = userList[0];
      const deleteUsers = userList.slice(1);

      console.log(`✅ Keeping user: ${keepUser.id} (created: ${keepUser.created_at})`);
      console.log(`🗑️ Deleting users: ${deleteUsers.map(u => u.id).join(', ')}`);

      // Update vehicles to point to the kept user
      for (const deleteUser of deleteUsers) {
        // Update vehicles with seller_id
        const { data: vehiclesBySellerId, error: vehiclesError1 } = await supabase
          .from('vehicles')
          .update({ seller_id: keepUser.id })
          .eq('seller_id', deleteUser.id)
          .select('id');

        if (vehiclesError1) {
          console.error(`❌ Error updating vehicles by seller_id for user ${deleteUser.id}:`, vehiclesError1);
        } else if (vehiclesBySellerId) {
          console.log(`🔄 Updated ${vehiclesBySellerId.length} vehicles by seller_id`);
          totalVehiclesUpdated += vehiclesBySellerId.length;
        }

        // Update vehicles with seller_email
        const { data: vehiclesByEmail, error: vehiclesError2 } = await supabase
          .from('vehicles')
          .update({ seller_email: keepUser.email })
          .eq('seller_email', deleteUser.email)
          .select('id');

        if (vehiclesError2) {
          console.error(`❌ Error updating vehicles by seller_email for user ${deleteUser.id}:`, vehiclesError2);
        } else if (vehiclesByEmail) {
          console.log(`🔄 Updated ${vehiclesByEmail.length} vehicles by seller_email`);
          totalVehiclesUpdated += vehiclesByEmail.length;
        }

        // Delete the duplicate user
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', deleteUser.id);

        if (deleteError) {
          console.error(`❌ Error deleting user ${deleteUser.id}:`, deleteError);
        } else {
          console.log(`✅ Deleted user: ${deleteUser.id}`);
          totalDeleted++;
        }
      }
    }

    console.log(`\n🎉 Cleanup completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Duplicate users deleted: ${totalDeleted}`);
    console.log(`   - Vehicles updated: ${totalVehiclesUpdated}`);
    console.log(`   - Emails processed: ${duplicates.length}`);

  } catch (error) {
    console.error('❌ Unexpected error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDuplicateUsers();
