export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const emailTemplates = {
  // Weekly Newsletter Template
  weeklyNewsletter: (): EmailTemplate => ({
    subject: '🚗 This Week in EVs: Latest News & Tips | Evvalley',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly EV Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">This Week in EVs</h1>
            <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your weekly dose of electric vehicle insights</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 22px;">Latest EV News & Updates</h2>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">📰 Industry Highlights</h3>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li style="margin-bottom: 8px;">New EV models hitting the market</li>
                <li style="margin-bottom: 8px;">Charging infrastructure updates</li>
                <li style="margin-bottom: 8px;">Government incentives and policies</li>
                <li style="margin-bottom: 8px;">Technology breakthroughs</li>
              </ul>
            </div>
            
            <!-- Featured Articles -->
            <div style="margin: 35px 0;">
              <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px;">📖 Featured Articles</h3>
              <div style="border-left: 4px solid #3AB0FF; padding-left: 20px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937;">EV Maintenance Tips</h4>
                <p style="margin: 0 0 10px 0; color: #6b7280;">Essential maintenance tips for your electric vehicle</p>
                <a href="https://www.evvalley.com/blog/ev-maintenance-regular-service" style="color: #3AB0FF; text-decoration: none;">Read More →</a>
              </div>
              <div style="border-left: 4px solid #3AB0FF; padding-left: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937;">Buying Guide</h4>
                <p style="margin: 0 0 10px 0; color: #6b7280;">How to safely purchase used electric vehicles</p>
                <a href="https://www.evvalley.com/blog/buying-electric-vehicles-safely" style="color: #3AB0FF; text-decoration: none;">Read More →</a>
              </div>
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://www.evvalley.com/vehicles" 
                 style="background: linear-gradient(135deg, #3AB0FF, #2A8FE6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                🚗 Browse EVs for Sale
              </a>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">This email was sent by Evvalley - Your trusted EV marketplace.</p>
              <p style="margin: 0;">Visit: <a href="https://www.evvalley.com" style="color: #3AB0FF;">www.evvalley.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `This Week in EVs - Your weekly dose of electric vehicle insights. Read our latest articles on EV maintenance and buying guides at www.evvalley.com`
  }),

  // Promotional Campaign Template
  promotional: (discount: string = '10%'): EmailTemplate => ({
    subject: `🎉 Special ${discount} Off on EV Listings | Evvalley`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Special Offer</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; color: white; font-weight: 600;">🎉 Special Offer!</h1>
            <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px;">${discount} Off on Premium Listings</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 24px;">Limited Time Offer</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              Don't miss out on this exclusive offer! List your electric vehicle on Evvalley and get ${discount} off our premium listing fee.
            </p>
            
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
              <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 20px;">⚡ Offer Details</h3>
              <p style="margin: 0; color: #92400e; font-size: 16px;">
                <strong>${discount} off premium listings</strong><br>
                Valid until end of month
              </p>
            </div>
            
            <!-- Benefits -->
            <div style="margin: 35px 0;">
              <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px;">Why Choose Premium?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li style="margin-bottom: 8px;">Featured placement in search results</li>
                <li style="margin-bottom: 8px;">Priority customer support</li>
                <li style="margin-bottom: 8px;">Enhanced listing analytics</li>
                <li style="margin-bottom: 8px;">Social media promotion</li>
              </ul>
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://www.evvalley.com/sell" 
                 style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 18px; box-shadow: 0 4px 6px rgba(255, 107, 107, 0.3);">
                🚀 List Your EV Now
              </a>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">This offer is valid until the end of the month.</p>
              <p style="margin: 0;">Visit: <a href="https://www.evvalley.com" style="color: #3AB0FF;">www.evvalley.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Special ${discount} Off on Premium Listings! Don't miss this limited time offer. List your EV now at www.evvalley.com/sell`
  }),

  // Market Update Template
  marketUpdate: (): EmailTemplate => ({
    subject: '📊 EV Market Update: Latest Trends & Prices | Evvalley',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Market Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">📊 Market Update</h1>
            <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Latest trends in the EV market</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 22px;">This Month's Market Insights</h2>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 25px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 18px;">📈 Market Trends</h3>
              <ul style="margin: 0; padding-left: 20px; color: #166534;">
                <li style="margin-bottom: 8px;">Tesla Model 3 prices stabilizing</li>
                <li style="margin-bottom: 8px;">Increased demand for used EVs</li>
                <li style="margin-bottom: 8px;">New charging infrastructure developments</li>
                <li style="margin-bottom: 8px;">Government incentives impact on sales</li>
              </ul>
            </div>
            
            <!-- Price Analysis -->
            <div style="margin: 35px 0;">
              <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px;">💰 Price Analysis</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                  <h4 style="margin: 0 0 10px 0; color: #1f2937;">Average EV Price</h4>
                  <p style="margin: 0; color: #10B981; font-size: 18px; font-weight: 600;">$45,000</p>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                  <h4 style="margin: 0 0 10px 0; color: #1f2937;">Market Growth</h4>
                  <p style="margin: 0; color: #10B981; font-size: 18px; font-weight: 600;">+15%</p>
                </div>
              </div>
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://www.evvalley.com/vehicles" 
                 style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                🔍 Browse Current Listings
              </a>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">Stay updated with the latest market trends.</p>
              <p style="margin: 0;">Visit: <a href="https://www.evvalley.com" style="color: #3AB0FF;">www.evvalley.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `EV Market Update: Latest trends and price analysis. Tesla Model 3 prices stabilizing, increased demand for used EVs. Browse current listings at www.evvalley.com/vehicles`
  })
};

export const getTemplate = (templateName: keyof typeof emailTemplates, params?: any): EmailTemplate => {
  const template = emailTemplates[templateName];
  if (typeof template === 'function') {
    return template(params);
  }
  return template;
};
