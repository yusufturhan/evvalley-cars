export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  readTime: number;
  metaDescription: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'complete-guide-to-buying-electric-vehicles',
    title: 'Complete Guide to Buying Electric Vehicles in 2024',
    excerpt: 'Everything you need to know about purchasing your first electric vehicle, from choosing the right model to understanding charging infrastructure.',
    content: `
      <h1>Complete Guide to Buying Electric Vehicles in 2024</h1>
      
      <p>Electric vehicles are revolutionizing the automotive industry, offering a cleaner, more efficient alternative to traditional gasoline-powered cars. As we move into 2024, the EV market has never been more diverse or accessible. This comprehensive guide will help you navigate the process of buying your first electric vehicle.</p>

      <h2>Understanding Electric Vehicle Types</h2>
      
      <h3>Battery Electric Vehicles (BEVs)</h3>
      <p>BEVs are fully electric vehicles that rely solely on battery power. They produce zero emissions and are the most environmentally friendly option. Popular models include the Tesla Model 3, Chevrolet Bolt, and Nissan Leaf.</p>
      
      <h3>Plug-in Hybrid Electric Vehicles (PHEVs)</h3>
      <p>PHEVs combine an electric motor with a gasoline engine. They can run on electricity for short distances before switching to gasoline. This makes them ideal for drivers who want the benefits of electric driving but need the flexibility of a gas engine for longer trips.</p>
      
      <h3>Hybrid Electric Vehicles (HEVs)</h3>
      <p>HEVs use both an electric motor and gasoline engine but cannot be plugged in. They're more fuel-efficient than traditional cars but less environmentally friendly than BEVs or PHEVs.</p>

      <h2>Key Factors to Consider</h2>
      
      <h3>Range</h3>
      <p>Consider your daily driving needs. Most modern EVs offer 200-300 miles of range, which is sufficient for most daily commutes. However, if you frequently take long trips, you might want to consider a PHEV or a long-range BEV.</p>
      
      <h3>Charging Infrastructure</h3>
      <p>Evaluate the charging options available to you:</p>
      <ul>
        <li><strong>Home Charging:</strong> Level 1 (120V) and Level 2 (240V) chargers</li>
        <li><strong>Public Charging:</strong> DC fast chargers and Level 2 public stations</li>
        <li><strong>Workplace Charging:</strong> Many employers now offer charging stations</li>
      </ul>
      
      <h3>Cost Considerations</h3>
      <p>While EVs may have higher upfront costs, they typically have lower operating costs:</p>
      <ul>
        <li>Lower fuel costs (electricity vs. gasoline)</li>
        <li>Reduced maintenance (fewer moving parts)</li>
        <li>Federal and state tax incentives</li>
        <li>Potential savings on insurance</li>
      </ul>

      <h2>Popular EV Models in 2024</h2>
      
      <h3>Entry-Level EVs</h3>
      <p>For first-time EV buyers, consider these affordable options:</p>
      <ul>
        <li><strong>Nissan Leaf:</strong> Starting around $28,000, 149-mile range</li>
        <li><strong>Chevrolet Bolt:</strong> Starting around $26,500, 259-mile range</li>
        <li><strong>Hyundai Kona Electric:</strong> Starting around $33,000, 258-mile range</li>
      </ul>
      
      <h3>Mid-Range EVs</h3>
      <p>These offer a good balance of features and affordability:</p>
      <ul>
        <li><strong>Tesla Model 3:</strong> Starting around $38,990, 272-mile range</li>
        <li><strong>Ford Mustang Mach-E:</strong> Starting around $42,995, 230-mile range</li>
        <li><strong>Volkswagen ID.4:</strong> Starting around $38,995, 275-mile range</li>
      </ul>

      <h2>Charging Your EV</h2>
      
      <h3>Home Charging Setup</h3>
      <p>Most EV owners charge at home. You'll need:</p>
      <ul>
        <li>A dedicated 240V circuit (for Level 2 charging)</li>
        <li>A Level 2 charger (costs $500-$1,500)</li>
        <li>Professional installation (recommended)</li>
      </ul>
      
      <h3>Public Charging</h3>
      <p>Public charging networks are expanding rapidly. Popular networks include:</p>
      <ul>
        <li>Tesla Supercharger Network</li>
        <li>Electrify America</li>
        <li>ChargePoint</li>
        <li>EVgo</li>
      </ul>

      <h2>Incentives and Tax Credits</h2>
      
      <p>The federal government offers up to $7,500 in tax credits for qualifying EVs. Many states also offer additional incentives, including:</p>
      <ul>
        <li>State tax credits</li>
        <li>Rebates</li>
        <li>HOV lane access</li>
        <li>Reduced registration fees</li>
      </ul>

      <h2>Making Your Decision</h2>
      
      <p>When choosing your first EV, consider:</p>
      <ol>
        <li>Your daily driving patterns</li>
        <li>Available charging infrastructure</li>
        <li>Budget and available incentives</li>
        <li>Vehicle features and technology</li>
        <li>Resale value and warranty</li>
      </ol>

      <h2>Conclusion</h2>
      
      <p>Buying an electric vehicle is an investment in both your future and the planet's. With careful consideration of your needs and the available options, you can find an EV that fits your lifestyle and budget. The EV market is constantly evolving, so staying informed about new models and technologies will help you make the best decision.</p>
      
      <p>Ready to start your EV journey? Browse our marketplace to find the perfect electric vehicle for you!</p>
    `,
    author: 'EvValley Team',
    publishedAt: '2024-03-20',
    updatedAt: '2024-03-20',
    category: 'EV Guide',
    tags: ['electric vehicles', 'buying guide', 'EV tips'],
    featuredImage: '/blog/ev-buying-guide.jpg',
    readTime: 8,
    metaDescription: 'Complete guide to buying electric vehicles in 2024. Learn about different types, features, and considerations.',
    keywords: ['electric vehicle buying guide', 'EV purchase', 'electric car buying tips']
  },
  {
    id: '2',
    slug: 'ev-charging-station-guide',
    title: 'EV Charging Station Guide: Everything You Need to Know',
    excerpt: 'Comprehensive guide to electric vehicle charging stations, from home installation to public charging network.',
    content: `
      <h1>EV Charging Station Guide: Everything You Need to Know</h1>
      
      <p>As electric vehicles become increasingly popular, understanding the charging infrastructure is crucial for both current and prospective EV owners. This comprehensive guide covers everything you need to know about EV charging stations, from home installation to navigating public charging networks.</p>

      <h2>Types of EV Charging</h2>
      
      <h3>Level 1 Charging (120V)</h3>
      <p>Level 1 charging uses a standard household outlet and is the slowest charging option:</p>
      <ul>
        <li><strong>Charging Speed:</strong> 2-5 miles of range per hour</li>
        <li><strong>Best For:</strong> Overnight charging or emergency top-ups</li>
        <li><strong>Cost:</strong> Minimal - uses existing outlet</li>
        <li><strong>Installation:</strong> No installation required</li>
      </ul>
      
      <h3>Level 2 Charging (240V)</h3>
      <p>Level 2 charging is the most common home charging solution:</p>
      <ul>
        <li><strong>Charging Speed:</strong> 10-60 miles of range per hour</li>
        <li><strong>Best For:</strong> Daily charging needs</li>
        <li><strong>Cost:</strong> $500-$1,500 for equipment + installation</li>
        <li><strong>Installation:</strong> Requires professional electrician</li>
      </ul>
      
      <h3>DC Fast Charging (Level 3)</h3>
      <p>DC fast charging is the fastest option, typically found at public stations:</p>
      <ul>
        <li><strong>Charging Speed:</strong> 60-200+ miles of range in 20-30 minutes</li>
        <li><strong>Best For:</strong> Long-distance travel and quick top-ups</li>
        <li><strong>Cost:</strong> $0.30-$0.60 per kWh (varies by network)</li>
        <li><strong>Installation:</strong> Commercial installations only</li>
      </ul>

      <h2>Home Charging Installation</h2>
      
      <h3>Planning Your Installation</h3>
      <p>Before installing a home charger, consider:</p>
      <ul>
        <li><strong>Electrical Panel Capacity:</strong> Ensure your panel can handle the additional load</li>
        <li><strong>Location:</strong> Choose a convenient location near your parking spot</li>
        <li><strong>Weather Protection:</strong> Consider outdoor installation requirements</li>
        <li><strong>Future-Proofing:</strong> Install a higher-capacity circuit for future needs</li>
      </ul>
      
      <h3>Installation Process</h3>
      <ol>
        <li><strong>Assessment:</strong> Have an electrician assess your electrical system</li>
        <li><strong>Permits:</strong> Obtain necessary permits from your local municipality</li>
        <li><strong>Installation:</strong> Install the circuit and charging station</li>
        <li><strong>Inspection:</strong> Have the installation inspected and approved</li>
      </ol>

      <h2>Public Charging Networks</h2>
      
      <h3>Major Charging Networks</h3>
      <p>Several companies operate public charging networks across the country:</p>
      
      <h4>Tesla Supercharger Network</h4>
      <ul>
        <li><strong>Coverage:</strong> Extensive network across the US</li>
        <li><strong>Compatibility:</strong> Tesla vehicles (some stations open to other EVs)</li>
        <li><strong>Speed:</strong> Up to 250 kW</li>
        <li><strong>Cost:</strong> Varies by location and time of day</li>
      </ul>
      
      <h4>Electrify America</h4>
      <ul>
        <li><strong>Coverage:</strong> Growing network nationwide</li>
        <li><strong>Compatibility:</strong> All EVs with CCS or CHAdeMO connectors</li>
        <li><strong>Speed:</strong> Up to 350 kW</li>
        <li><strong>Cost:</strong> $0.43 per kWh (member pricing)</li>
      </ul>
      
      <h4>ChargePoint</h4>
      <ul>
        <li><strong>Coverage:</strong> Extensive Level 2 and DC fast charging</li>
        <li><strong>Compatibility:</strong> All EVs</li>
        <li><strong>Speed:</strong> Level 2 and DC fast charging</li>
        <li><strong>Cost:</strong> Varies by location and network</li>
      </ul>

      <h2>Charging Connectors and Standards</h2>
      
      <h3>Common Connector Types</h3>
      <ul>
        <li><strong>J1772:</strong> Standard Level 1 and Level 2 connector (all EVs except Tesla)</li>
        <li><strong>Tesla Connector:</strong> Proprietary connector for Tesla vehicles</li>
        <li><strong>CCS (Combined Charging System):strong> DC fast charging standard</li>
        <li><strong>CHAdeMO:</strong> DC fast charging standard (primarily Nissan Leaf)</li>
      </ul>

      <h2>Charging Costs and Economics</h2>
      
      <h3>Home Charging Costs</h3>
      <p>Home charging is typically the most cost-effective option:</p>
      <ul>
        <li><strong>Electricity Rate:</strong> $0.10-$0.20 per kWh (varies by location)</li>
        <li><strong>Cost per Mile:</strong> $0.03-$0.06 (vs. $0.10-$0.15 for gasoline)</li>
        <li><strong>Annual Savings:</strong> $500-$1,500 compared to gasoline</li>
      </ul>
      
      <h3>Public Charging Costs</h3>
      <p>Public charging costs vary significantly:</p>
      <ul>
        <li><strong>Level 2:</strong> $0.20-$0.40 per kWh</li>
        <li><strong>DC Fast Charging:</strong> $0.30-$0.60 per kWh</li>
        <li><strong>Membership Programs:</strong> Often offer discounted rates</li>
      </ul>

      <h2>Charging Best Practices</h2>
      
      <h3>Battery Health</h3>
      <ul>
        <li>Keep your battery between 20% and 80% for optimal health</li>
        <li>Avoid frequent DC fast charging when possible</li>
        <li>Don't leave your EV at 100% charge for extended periods</li>
        <li>Use scheduled charging to optimize battery temperature</li>
      </ul>
      
      <h3>Charging Efficiency</h3>
      <ul>
        <li>Charge during off-peak hours for lower electricity rates</li>
        <li>Use your vehicle's built-in charging scheduler</li>
        <li>Consider solar panels for even more cost savings</li>
        <li>Monitor your charging habits through your vehicle's app</li>
      </ul>

      <h2>Future of EV Charging</h2>
      
      <p>The EV charging infrastructure is rapidly evolving:</p>
      <ul>
        <li><strong>Wireless Charging:</strong> Inductive charging pads for home and public use</li>
        <li><strong>Vehicle-to-Grid (V2G):</strong> Using EVs as energy storage for the grid</li>
        <li><strong>Ultra-Fast Charging:</strong> 350+ kW charging stations becoming more common</li>
        <li><strong>Smart Charging:</strong> AI-powered charging optimization</li>
      </ul>

      <h2>Conclusion</h2>
      
      <p>Understanding EV charging is essential for maximizing the benefits of electric vehicle ownership. Whether you're charging at home or on the road, knowing your options and best practices will help you save money and maintain your vehicle's battery health.</p>
      
      <p>Ready to explore EV charging options? Check out our marketplace for electric vehicles and start your journey toward sustainable transportation!</p>
    `,
    author: 'EvValley Team',
    publishedAt: '2024-03-21',
    updatedAt: '2024-03-21',
    category: 'Technology Updates',
    tags: ['charging stations', 'EV charging'],
    featuredImage: '/blog/ev-charging-guide.jpg',
    readTime: 10,
    metaDescription: 'Complete guide to EV charging stations and infrastructure.',
    keywords: ['EV charging stations', 'electric vehicle charging', 'charging guide']
  },
  {
    id: '3',
    slug: 'electric-scooter-buying-guide',
    title: 'Electric Scooter Buying Guide: Choose the Perfect E-Scooter',
    excerpt: 'Everything you need to know about buying an electric scooter, from performance specs to safety features.',
    content: '# Electric Scooter Buying Guide\n\nElectric scooters are becoming popular...',
    author: 'EvValley Team',
    publishedAt: '2024-03-22',
    updatedAt: '2024-03-22',
    category: 'E-Mobility',
    tags: ['electric scooters', 'e-scooter guide'],
    featuredImage: '/blog/e-scooter-guide.jpg',
    readTime: 6,
    metaDescription: 'Complete guide to buying electric scooters.',
    keywords: ['electric scooter buying guide', 'e-scooter purchase', 'scooter guide']
  },
  {
    id: '4',
    slug: 'ev-market-analysis-2024',
    title: 'Electric Vehicle Market Analysis 2024: Trends and Predictions',
    excerpt: 'Comprehensive analysis of the electric vehicle market in 2024, including sales trends, technology developments, and future predictions.',
    content: '# EV Market Analysis 2024\n\nThe electric vehicle market is rapidly evolving...',
    author: 'EvValley Team',
    publishedAt: '2024-03-23',
    updatedAt: '2024-03-23',
    category: 'Market Analysis',
    tags: ['market analysis', 'EV trends', 'industry insights'],
    featuredImage: '/blog/ev-market-analysis.jpg',
    readTime: 12,
    metaDescription: 'Comprehensive analysis of the electric vehicle market in 2024.',
    keywords: ['EV market analysis', 'electric vehicle trends', 'market predictions']
  },
  {
    id: '5',
    slug: 'ev-safety-tips-2024',
    title: 'Electric Vehicle Safety Tips: Essential Guide for 2024',
    excerpt: 'Essential safety tips for electric vehicle owners, covering charging safety, driving safety, and emergency procedures.',
    content: '# EV Safety Tips 2024\n\nSafety is paramount when driving electric vehicles...',
    author: 'EvValley Team',
    publishedAt: '2024-03-24',
    updatedAt: '2024-03-24',
    category: 'Safety',
    tags: ['EV safety', 'safety tips', 'driving safety'],
    featuredImage: '/blog/ev-safety-guide.jpg',
    readTime: 9,
    metaDescription: 'Essential safety tips for electric vehicle owners in 2024.',
    keywords: ['EV safety tips', 'electric vehicle safety', 'driving safety']
  },
  {
    id: '6',
    slug: 'ev-maintenance-guide',
    title: 'Electric Vehicle Maintenance Guide: Keep Your EV Running Smoothly',
    excerpt: 'Complete guide to maintaining your electric vehicle, from battery care to regular service intervals.',
    content: '# EV Maintenance Guide\n\nProper maintenance is key to EV longevity...',
    author: 'EvValley Team',
    publishedAt: '2024-03-25',
    updatedAt: '2024-03-25',
    category: 'EV Guide',
    tags: ['EV maintenance', 'battery care', 'service intervals'],
    featuredImage: '/blog/ev-maintenance-guide.jpg',
    readTime: 11,
    metaDescription: 'Complete guide to electric vehicle maintenance and care.',
    keywords: ['EV maintenance', 'electric vehicle care', 'battery maintenance']
  },
  {
    id: '7',
    slug: 'e-bike-buying-guide-2024',
    title: 'E-Bike Buying Guide 2024: How to Choose Your Perfect Electric Bike',
    excerpt: 'Comprehensive guide to buying an electric bike in 2024, covering different types, features, and considerations.',
    content: '# E-Bike Buying Guide 2024\n\nElectric bikes are revolutionizing transportation...',
    author: 'EvValley Team',
    publishedAt: '2024-03-26',
    updatedAt: '2024-03-26',
    category: 'E-Mobility',
    tags: ['e-bikes', 'electric bikes', 'buying guide'],
    featuredImage: '/blog/e-bike-guide.jpg',
    readTime: 10,
    metaDescription: 'Complete guide to buying electric bikes in 2024.',
    keywords: ['e-bike buying guide', 'electric bike purchase', 'e-bike guide']
  },
  {
    id: '8',
    slug: 'ev-cost-analysis',
    title: 'Electric Vehicle Cost Analysis: Total Cost of Ownership',
    excerpt: 'Detailed analysis of electric vehicle costs, including purchase price, charging costs, maintenance, and long-term savings.',
    content: '# EV Cost Analysis\n\nUnderstanding the true cost of electric vehicles...',
    author: 'EvValley Team',
    publishedAt: '2024-03-27',
    updatedAt: '2024-03-27',
    category: 'Buying/Selling Tips',
    tags: ['EV costs', 'total cost of ownership', 'cost analysis'],
    featuredImage: '/blog/ev-cost-analysis.jpg',
    readTime: 13,
    metaDescription: 'Detailed analysis of electric vehicle costs and total cost of ownership.',
    keywords: ['EV cost analysis', 'electric vehicle costs', 'total cost of ownership']
  },
  {
    id: '9',
    slug: 'ev-technology-updates-2024',
    title: 'Latest Electric Vehicle Technology Updates for 2024',
    excerpt: 'Stay updated with the latest electric vehicle technology developments, from battery improvements to autonomous features.',
    content: '# EV Technology Updates 2024\n\nElectric vehicle technology is advancing rapidly...',
    author: 'EvValley Team',
    publishedAt: '2024-03-28',
    updatedAt: '2024-03-28',
    category: 'Technology Updates',
    tags: ['EV technology', 'battery technology', 'autonomous features'],
    featuredImage: '/blog/ev-technology-updates.jpg',
    readTime: 14,
    metaDescription: 'Latest electric vehicle technology updates and developments for 2024.',
    keywords: ['EV technology updates', 'electric vehicle technology', 'battery technology']
  },
  {
    id: '10',
    slug: 'ev-selling-guide',
    title: 'How to Sell Your Electric Vehicle: Complete Guide',
    excerpt: 'Step-by-step guide to selling your electric vehicle, from preparation to closing the deal.',
    content: '# How to Sell Your Electric Vehicle\n\nSelling an electric vehicle requires preparation...',
    author: 'EvValley Team',
    publishedAt: '2024-03-29',
    updatedAt: '2024-03-29',
    category: 'Buying/Selling Tips',
    tags: ['selling EVs', 'EV sales', 'selling guide'],
    featuredImage: '/blog/ev-selling-guide.jpg',
    readTime: 8,
    metaDescription: 'Complete guide to selling your electric vehicle successfully.',
    keywords: ['selling electric vehicles', 'EV sales guide', 'how to sell EV']
  }
];

export const categories = [
  'All Categories',
  'EV Guide',
  'Market Analysis',
  'Technology Updates',
  'Buying/Selling Tips',
  'E-Mobility',
  'Safety'
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  if (category === 'All Categories') {
    return blogPosts;
  }
  return blogPosts.filter(post => post.category === category);
};

export const getRecentBlogPosts = (limit: number = 6): BlogPost[] => {
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getRelatedBlogPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.id !== currentPost.id && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag))))
    .slice(0, limit);
};
