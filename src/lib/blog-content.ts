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
    content: '# Complete Guide to Buying Electric Vehicles in 2024\n\nElectric vehicles are the future of transportation...',
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
    content: '# EV Charging Station Guide\n\nUnderstanding EV charging is essential...',
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
