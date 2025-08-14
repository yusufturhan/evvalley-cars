import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getActiveCampaigns, getCampaignById } from '@/lib/email-campaigns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { campaignType, schedule } = await request.json();

    // Get active campaigns of the specified type
    const campaigns = getActiveCampaigns().filter(campaign => 
      campaignType ? campaign.type === campaignType : true
    );

    const results = [];

    for (const campaign of campaigns) {
      try {
        // Get eligible users based on campaign conditions
        const eligibleUsers = await getEligibleUsers(campaign);
        
        if (eligibleUsers.length === 0) {
          results.push({
            campaignId: campaign.id,
            status: 'skipped',
            reason: 'No eligible users found'
          });
          continue;
        }

        // Send emails to eligible users
        const emailPromises = eligibleUsers.map(async (user) => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email-campaign`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: campaign.id,
                userId: user.id,
                customVariables: await getCustomVariables(campaign, user)
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            return { success: true, userId: user.id };
          } catch (error) {
            console.error(`Failed to send campaign ${campaign.id} to user ${user.id}:`, error);
            return { success: false, userId: user.id, error: error.message };
          }
        });

        const emailResults = await Promise.all(emailPromises);
        const successful = emailResults.filter(r => r.success);
        const failed = emailResults.filter(r => !r.success);

        results.push({
          campaignId: campaign.id,
          status: 'completed',
          totalUsers: eligibleUsers.length,
          successful: successful.length,
          failed: failed.length
        });

      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error);
        results.push({
          campaignId: campaign.id,
          status: 'error',
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign scheduler completed',
      results
    });

  } catch (error) {
    console.error('Campaign scheduler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getEligibleUsers(campaign: any) {
  let query = supabase
    .from('users')
    .select('id, email, first_name, last_name, created_at, last_login');

  // Apply campaign conditions
  if (campaign.conditions) {
    const conditions = campaign.conditions;

    // User type filter
    if (conditions.userType && conditions.userType !== 'all') {
      // This would need to be implemented based on your user type logic
      // For now, we'll get all users
    }

    // Last activity filter
    if (conditions.lastActivity !== undefined) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - conditions.lastActivity);
      query = query.gte('last_login', cutoffDate.toISOString());
    }

    // Has listed vehicle filter
    if (conditions.hasListedVehicle === false) {
      // Get users who haven't listed vehicles
      const { data: usersWithVehicles } = await supabase
        .from('vehicles')
        .select('seller_id')
        .not('seller_id', 'is', null);
      
      const sellerIds = usersWithVehicles?.map(v => v.seller_id) || [];
      if (sellerIds.length > 0) {
        query = query.not('id', 'in', `(${sellerIds.join(',')})`);
      }
    }

    // Has favorited filter
    if (conditions.hasFavorited === true) {
      // Get users who have favorited vehicles
      const { data: usersWithFavorites } = await supabase
        .from('favorites')
        .select('user_id')
        .not('user_id', 'is', null);
      
      const favoriteUserIds = usersWithFavorites?.map(f => f.user_id) || [];
      if (favoriteUserIds.length > 0) {
        query = query.in('id', favoriteUserIds);
      }
    }
  }

  const { data: users, error } = await query;

  if (error) {
    console.error('Error fetching eligible users:', error);
    return [];
  }

  return users || [];
}

async function getCustomVariables(campaign: any, user: any) {
  const variables: any = {};

  // Add campaign-specific variables
  switch (campaign.type) {
    case 'newsletter':
      // Get featured article
      const { data: featuredArticle } = await supabase
        .from('blog_posts')
        .select('title, excerpt, slug')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      if (featuredArticle) {
        variables.featuredArticleTitle = featuredArticle.title;
        variables.featuredArticleExcerpt = featuredArticle.excerpt;
        variables.featuredArticleUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${featuredArticle.slug}`;
      }

      // Get market stats
      const { count: newListings } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      variables.newListings = newListings || 0;
      variables.averagePrice = '$45,000'; // This would be calculated from actual data
      variables.topBrand = 'Tesla'; // This would be calculated from actual data
      variables.proTip = 'Always check the battery health and charging history when buying a used EV!';
      variables.blogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog`;
      break;

    case 'promotional':
      // Get featured vehicles for promotional campaigns
      const { data: featuredVehicles } = await supabase
        .from('vehicles')
        .select('id, title, price, images')
        .eq('featured', true)
        .limit(3);

      if (featuredVehicles && featuredVehicles.length > 0) {
        variables.daysLeft = '7';
        variables.vehicle1Title = featuredVehicles[0]?.title || 'Featured EV';
        variables.vehicle1OriginalPrice = '$50,000';
        variables.vehicle1SalePrice = '$40,000';
        variables.vehicle1Savings = '$10,000';
        variables.vehicle1Url = `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${featuredVehicles[0]?.id}`;
        
        if (featuredVehicles[1]) {
          variables.vehicle2Title = featuredVehicles[1].title;
          variables.vehicle2OriginalPrice = '$45,000';
          variables.vehicle2SalePrice = '$36,000';
          variables.vehicle2Savings = '$9,000';
          variables.vehicle2Url = `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${featuredVehicles[1].id}`;
        }
        
        if (featuredVehicles[2]) {
          variables.vehicle3Title = featuredVehicles[2].title;
          variables.vehicle3OriginalPrice = '$35,000';
          variables.vehicle3SalePrice = '$28,000';
          variables.vehicle3Savings = '$7,000';
          variables.vehicle3Url = `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${featuredVehicles[2].id}`;
        }
      }
      
      variables.saleUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vehicles?featured=true`;
      break;

    case 'abandoned-cart':
      // Get user's favorited vehicles
      const { data: favoritedVehicles } = await supabase
        .from('favorites')
        .select(`
          vehicles (
            id, title, price, images, seller_id
          )
        `)
        .eq('user_id', user.id)
        .limit(3);

      if (favoritedVehicles && favoritedVehicles.length > 0) {
        variables.favoritedVehicles = favoritedVehicles
          .map(fv => fv.vehicles)
          .filter(Boolean)
          .map(vehicle => `${vehicle.title} - $${vehicle.price}`)
          .join('\n');
      }
      break;
  }

  return variables;
}
