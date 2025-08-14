export interface EmailCampaign {
  id: string;
  name: string;
  type: 'welcome' | 'newsletter' | 'promotional' | 'abandoned-cart' | 'market-update';
  subject: string;
  template: string;
  description: string;
  isActive: boolean;
  schedule?: 'immediate' | 'daily' | 'weekly' | 'monthly';
  targetAudience?: string[];
  conditions?: {
    userType?: 'buyer' | 'seller' | 'all';
    lastActivity?: number; // days
    hasListedVehicle?: boolean;
    hasFavorited?: boolean;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: 'transactional' | 'marketing' | 'newsletter';
}

export const emailCampaigns: EmailCampaign[] = [
  {
    id: 'welcome-series-1',
    name: 'Welcome Email - Day 1',
    type: 'welcome',
    subject: 'Welcome to EvValley! Your EV Marketplace Journey Starts Here 🚗⚡',
    template: 'welcome-day-1',
    description: 'First welcome email sent immediately after signup',
    isActive: true,
    schedule: 'immediate',
    targetAudience: ['new-users'],
    conditions: {
      userType: 'all',
      lastActivity: 0
    }
  },
  {
    id: 'welcome-series-2',
    name: 'Welcome Email - Day 3',
    type: 'welcome',
    subject: 'Discover Amazing Electric Vehicles on EvValley 🔋',
    template: 'welcome-day-3',
    description: 'Second welcome email with featured vehicles',
    isActive: true,
    schedule: 'daily',
    targetAudience: ['new-users'],
    conditions: {
      userType: 'all',
      lastActivity: 3
    }
  },
  {
    id: 'welcome-series-3',
    name: 'Welcome Email - Day 7',
    type: 'welcome',
    subject: 'Ready to Buy or Sell? Here\'s How EvValley Works 💡',
    template: 'welcome-day-7',
    description: 'Third welcome email with platform tutorial',
    isActive: true,
    schedule: 'daily',
    targetAudience: ['new-users'],
    conditions: {
      userType: 'all',
      lastActivity: 7
    }
  },
  {
    id: 'weekly-newsletter',
    name: 'Weekly EV Market Update',
    type: 'newsletter',
    subject: 'This Week in EVs: Latest News, Tips & Market Trends 📰',
    template: 'weekly-newsletter',
    description: 'Weekly newsletter with blog content and market updates',
    isActive: true,
    schedule: 'weekly',
    targetAudience: ['newsletter-subscribers'],
    conditions: {
      userType: 'all'
    }
  },
  {
    id: 'promotional-summer-sale',
    name: 'Summer EV Sale - Limited Time!',
    type: 'promotional',
    subject: '🔥 Summer EV Sale: Up to 20% Off Featured Electric Vehicles',
    template: 'summer-sale',
    description: 'Seasonal promotional campaign for featured vehicles',
    isActive: true,
    schedule: 'immediate',
    targetAudience: ['buyers', 'newsletter-subscribers'],
    conditions: {
      userType: 'buyer'
    }
  },
  {
    id: 'abandoned-cart-reminder',
    name: 'Abandoned Cart Reminder',
    type: 'abandoned-cart',
    subject: 'Don\'t Miss Out! Your Favorite EV is Still Available 🚗',
    template: 'abandoned-cart',
    description: 'Reminder for users who favorited vehicles but didn\'t contact seller',
    isActive: true,
    schedule: 'daily',
    targetAudience: ['buyers'],
    conditions: {
      userType: 'buyer',
      hasFavorited: true,
      lastActivity: 3
    }
  },
  {
    id: 'market-update-monthly',
    name: 'Monthly EV Market Report',
    type: 'market-update',
    subject: '📊 EV Market Report: Prices, Trends & Insights for {{month}}',
    template: 'market-report',
    description: 'Monthly market analysis and price trends',
    isActive: true,
    schedule: 'monthly',
    targetAudience: ['newsletter-subscribers', 'sellers'],
    conditions: {
      userType: 'all'
    }
  },
  {
    id: 'seller-encouragement',
    name: 'Sell Your EV - High Demand Now!',
    type: 'promotional',
    subject: 'High Demand Alert: Your EV Could Sell Fast on EvValley 📈',
    template: 'seller-encouragement',
    description: 'Encourage users to list their vehicles',
    isActive: true,
    schedule: 'weekly',
    targetAudience: ['potential-sellers'],
    conditions: {
      userType: 'buyer',
      hasListedVehicle: false,
      lastActivity: 30
    }
  }
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome-day-1',
    name: 'Welcome Email - Day 1',
    subject: 'Welcome to EvValley! Your EV Marketplace Journey Starts Here 🚗⚡',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to EvValley</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3AB0FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #3AB0FF; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EvValley! 🚗⚡</h1>
            <p>Your premier marketplace for electric vehicles, e-scooters, and e-bikes</p>
          </div>
          
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            
            <p>Welcome to EvValley! We're excited to have you join our community of electric vehicle enthusiasts and eco-conscious buyers and sellers.</p>
            
            <div class="feature">
              <h3>🚗 Find Your Perfect EV</h3>
              <p>Browse thousands of electric vehicles, from Tesla to Nissan Leaf, with detailed listings and transparent pricing.</p>
            </div>
            
            <div class="feature">
              <h3>⚡ E-Mobility Solutions</h3>
              <p>Discover electric scooters and e-bikes for urban transportation and recreational use.</p>
            </div>
            
            <div class="feature">
              <h3>🔒 Safe & Secure</h3>
              <p>Buy and sell with confidence using our secure platform and verified seller system.</p>
            </div>
            
            <p><strong>Ready to get started?</strong></p>
            
            <a href="{{browseUrl}}" class="button">Browse Electric Vehicles</a>
            <a href="{{sellUrl}}" class="button">List Your Vehicle</a>
            
            <p style="margin-top: 30px;">
              <strong>Need help?</strong> Our support team is here to assist you at every step of your EV journey.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 EvValley. All rights reserved.</p>
            <p><a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | <a href="{{preferencesUrl}}" style="color: #ccc;">Email Preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
Welcome to EvValley! 🚗⚡

Hi {{firstName}},

Welcome to EvValley! We're excited to have you join our community of electric vehicle enthusiasts and eco-conscious buyers and sellers.

🚗 Find Your Perfect EV
Browse thousands of electric vehicles, from Tesla to Nissan Leaf, with detailed listings and transparent pricing.

⚡ E-Mobility Solutions
Discover electric scooters and e-bikes for urban transportation and recreational use.

🔒 Safe & Secure
Buy and sell with confidence using our secure platform and verified seller system.

Ready to get started?

Browse Electric Vehicles: {{browseUrl}}
List Your Vehicle: {{sellUrl}}

Need help? Our support team is here to assist you at every step of your EV journey.

© 2024 EvValley. All rights reserved.
Unsubscribe: {{unsubscribeUrl}} | Email Preferences: {{preferencesUrl}}
    `,
    variables: ['firstName', 'browseUrl', 'sellUrl', 'unsubscribeUrl', 'preferencesUrl'],
    category: 'marketing'
  },
  {
    id: 'weekly-newsletter',
    name: 'Weekly Newsletter',
    subject: 'This Week in EVs: Latest News, Tips & Market Trends 📰',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly EV Newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .article { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #3AB0FF; }
          .button { display: inline-block; background: #3AB0FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .stats { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>This Week in EVs 📰</h1>
            <p>Latest news, tips & market trends from EvValley</p>
          </div>
          
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            
            <p>Here's what's happening in the electric vehicle world this week:</p>
            
            <div class="article">
              <h3>📖 Featured Article: {{featuredArticleTitle}}</h3>
              <p>{{featuredArticleExcerpt}}</p>
              <a href="{{featuredArticleUrl}}" class="button">Read More</a>
            </div>
            
            <div class="stats">
              <h3>📊 Market Update</h3>
              <p><strong>{{newListings}}</strong> new vehicles listed this week</p>
              <p><strong>{{averagePrice}}</strong> average listing price</p>
              <p><strong>{{topBrand}}</strong> most popular brand</p>
            </div>
            
            <div class="article">
              <h3>🔥 Hot Deals</h3>
              <p>Check out these featured vehicles with great prices:</p>
              {{featuredVehicles}}
            </div>
            
            <div class="article">
              <h3>💡 Pro Tip</h3>
              <p>{{proTip}}</p>
            </div>
            
            <p style="margin-top: 30px;">
              <strong>Stay connected:</strong>
            </p>
            
            <a href="{{blogUrl}}" class="button">Read Our Blog</a>
            <a href="{{browseUrl}}" class="button">Browse Vehicles</a>
          </div>
          
          <div class="footer">
            <p>© 2024 EvValley. All rights reserved.</p>
            <p><a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | <a href="{{preferencesUrl}}" style="color: #ccc;">Email Preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
This Week in EVs 📰

Hi {{firstName}},

Here's what's happening in the electric vehicle world this week:

📖 Featured Article: {{featuredArticleTitle}}
{{featuredArticleExcerpt}}
Read More: {{featuredArticleUrl}}

📊 Market Update
- {{newListings}} new vehicles listed this week
- {{averagePrice}} average listing price
- {{topBrand}} most popular brand

🔥 Hot Deals
Check out these featured vehicles with great prices:
{{featuredVehicles}}

💡 Pro Tip
{{proTip}}

Stay connected:
Read Our Blog: {{blogUrl}}
Browse Vehicles: {{browseUrl}}

© 2024 EvValley. All rights reserved.
Unsubscribe: {{unsubscribeUrl}} | Email Preferences: {{preferencesUrl}}
    `,
    variables: ['firstName', 'featuredArticleTitle', 'featuredArticleExcerpt', 'featuredArticleUrl', 'newListings', 'averagePrice', 'topBrand', 'featuredVehicles', 'proTip', 'blogUrl', 'browseUrl', 'unsubscribeUrl', 'preferencesUrl'],
    category: 'newsletter'
  },
  {
    id: 'summer-sale',
    name: 'Summer Sale Campaign',
    subject: '🔥 Summer EV Sale: Up to 20% Off Featured Electric Vehicles',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Summer EV Sale</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .deal { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border: 2px solid #FF6B35; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .countdown { background: #FF6B35; color: white; padding: 20px; margin: 15px 0; border-radius: 5px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 Summer EV Sale</h1>
            <p>Limited Time: Up to 20% Off Featured Electric Vehicles</p>
          </div>
          
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            
            <div class="countdown">
              <h3>⏰ Sale Ends in {{daysLeft}} Days!</h3>
              <p>Don't miss out on these incredible deals</p>
            </div>
            
            <p>Summer is here, and so are the best deals on electric vehicles! We've handpicked amazing EVs with special pricing just for you.</p>
            
            <div class="deal">
              <h3>🚗 Featured Deal #1</h3>
              <p><strong>{{vehicle1Title}}</strong></p>
              <p>Original Price: <span style="text-decoration: line-through;">{{vehicle1OriginalPrice}}</span></p>
              <p><strong style="color: #FF6B35; font-size: 1.2em;">Sale Price: {{vehicle1SalePrice}}</strong></p>
              <p>Save: {{vehicle1Savings}}</p>
              <a href="{{vehicle1Url}}" class="button">View Details</a>
            </div>
            
            <div class="deal">
              <h3>🚗 Featured Deal #2</h3>
              <p><strong>{{vehicle2Title}}</strong></p>
              <p>Original Price: <span style="text-decoration: line-through;">{{vehicle2OriginalPrice}}</span></p>
              <p><strong style="color: #FF6B35; font-size: 1.2em;">Sale Price: {{vehicle2SalePrice}}</strong></p>
              <p>Save: {{vehicle2Savings}}</p>
              <a href="{{vehicle2Url}}" class="button">View Details</a>
            </div>
            
            <div class="deal">
              <h3>🚗 Featured Deal #3</h3>
              <p><strong>{{vehicle3Title}}</strong></p>
              <p>Original Price: <span style="text-decoration: line-through;">{{vehicle3OriginalPrice}}</span></p>
              <p><strong style="color: #FF6B35; font-size: 1.2em;">Sale Price: {{vehicle3SalePrice}}</strong></p>
              <p>Save: {{vehicle3Savings}}</p>
              <a href="{{vehicle3Url}}" class="button">View Details</a>
            </div>
            
            <p style="margin-top: 30px;">
              <strong>Why buy now?</strong>
            </p>
            <ul>
              <li>✅ Limited time offers</li>
              <li>✅ Verified sellers</li>
              <li>✅ Secure transactions</li>
              <li>✅ Free market analysis</li>
            </ul>
            
            <a href="{{saleUrl}}" class="button">View All Sale Vehicles</a>
          </div>
          
          <div class="footer">
            <p>© 2024 EvValley. All rights reserved.</p>
            <p><a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | <a href="{{preferencesUrl}}" style="color: #ccc;">Email Preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
🔥 Summer EV Sale

Hi {{firstName}},

⏰ Sale Ends in {{daysLeft}} Days!

Summer is here, and so are the best deals on electric vehicles! We've handpicked amazing EVs with special pricing just for you.

🚗 Featured Deal #1
{{vehicle1Title}}
Original Price: {{vehicle1OriginalPrice}}
Sale Price: {{vehicle1SalePrice}}
Save: {{vehicle1Savings}}
View Details: {{vehicle1Url}}

🚗 Featured Deal #2
{{vehicle2Title}}
Original Price: {{vehicle2OriginalPrice}}
Sale Price: {{vehicle2SalePrice}}
Save: {{vehicle2Savings}}
View Details: {{vehicle2Url}}

🚗 Featured Deal #3
{{vehicle3Title}}
Original Price: {{vehicle3OriginalPrice}}
Sale Price: {{vehicle3SalePrice}}
Save: {{vehicle3Savings}}
View Details: {{vehicle3Url}}

Why buy now?
✅ Limited time offers
✅ Verified sellers
✅ Secure transactions
✅ Free market analysis

View All Sale Vehicles: {{saleUrl}}

© 2024 EvValley. All rights reserved.
Unsubscribe: {{unsubscribeUrl}} | Email Preferences: {{preferencesUrl}}
    `,
    variables: ['firstName', 'daysLeft', 'vehicle1Title', 'vehicle1OriginalPrice', 'vehicle1SalePrice', 'vehicle1Savings', 'vehicle1Url', 'vehicle2Title', 'vehicle2OriginalPrice', 'vehicle2SalePrice', 'vehicle2Savings', 'vehicle2Url', 'vehicle3Title', 'vehicle3OriginalPrice', 'vehicle3SalePrice', 'vehicle3Savings', 'vehicle3Url', 'saleUrl', 'unsubscribeUrl', 'preferencesUrl'],
    category: 'marketing'
  }
];

export const getCampaignById = (id: string): EmailCampaign | undefined => {
  return emailCampaigns.find(campaign => campaign.id === id);
};

export const getActiveCampaigns = (): EmailCampaign[] => {
  return emailCampaigns.filter(campaign => campaign.isActive);
};

export const getCampaignsByType = (type: EmailCampaign['type']): EmailCampaign[] => {
  return emailCampaigns.filter(campaign => campaign.type === type);
};

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return emailTemplates.find(template => template.id === id);
};

export const processTemplate = (template: EmailTemplate, variables: Record<string, string>): { html: string; text: string } => {
  let html = template.htmlContent;
  let text = template.textContent;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
    text = text.replace(regex, value);
  });
  
  return { html, text };
};
