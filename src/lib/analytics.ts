// Google Analytics Event Tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    });
  }
};

// Enhanced Vehicle listing events
export const trackVehicleView = (vehicleId: string, vehicleTitle: string, price: number) => {
  trackEvent('view_item', 'vehicle', vehicleTitle, price);
  trackEvent('view_item_list', 'vehicle', 'vehicle_detail_page');
};

export const trackVehicleContact = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('contact_seller', 'vehicle', vehicleTitle);
  trackEvent('generate_lead', 'conversion', 'vehicle_contact');
};

export const trackVehicleFavorite = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('add_to_favorites', 'vehicle', vehicleTitle);
  trackEvent('add_to_wishlist', 'vehicle', vehicleTitle);
};

export const trackVehicleList = (vehicleTitle: string, category: string, price: number) => {
  trackEvent('list_vehicle', 'vehicle', vehicleTitle, price);
  trackEvent('submit_form', 'conversion', 'vehicle_listing');
};

// Enhanced Blog events
export const trackBlogView = (postTitle: string, category: string) => {
  trackEvent('view_blog_post', 'blog', postTitle);
  trackEvent('view_item', 'blog', postTitle);
  trackEvent('scroll', 'engagement', 'blog_scroll');
};

export const trackBlogSearch = (searchQuery: string) => {
  trackEvent('search_blog', 'blog', searchQuery);
  trackEvent('search', 'site', searchQuery);
};

export const trackBlogShare = (postTitle: string, platform: string) => {
  trackEvent('share', 'blog', `${postTitle}_${platform}`);
  trackEvent('social_share', 'engagement', platform);
};

export const trackBlogComment = (postTitle: string) => {
  trackEvent('comment', 'blog', postTitle);
  trackEvent('user_engagement', 'blog', 'comment');
};

// Enhanced User engagement events
export const trackSignUp = (method: string) => {
  trackEvent('sign_up', 'user', method);
  trackEvent('user_registration', 'conversion', method);
};

export const trackSignIn = (method: string) => {
  trackEvent('sign_in', 'user', method);
  trackEvent('user_login', 'engagement', method);
};

export const trackSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent('search', 'site', searchQuery, resultsCount);
  trackEvent('search_results', 'engagement', `${searchQuery}_${resultsCount}_results`);
};

export const trackFilterUsage = (filterType: string, filterValue: string) => {
  trackEvent('filter_used', 'site', `${filterType}_${filterValue}`);
  trackEvent('user_interaction', 'engagement', 'filter');
};

export const trackSortUsage = (sortType: string) => {
  trackEvent('sort_used', 'site', sortType);
  trackEvent('user_interaction', 'engagement', 'sort');
};

export const trackPagination = (pageNumber: number) => {
  trackEvent('pagination', 'site', `page_${pageNumber}`);
  trackEvent('user_interaction', 'engagement', 'pagination');
};

// Enhanced Conversion events
export const trackLeadGeneration = (source: string) => {
  trackEvent('generate_lead', 'conversion', source);
  trackEvent('form_submit', 'conversion', source);
};

export const trackNewsletterSignup = (email: string) => {
  trackEvent('newsletter_signup', 'conversion', email);
  trackEvent('email_signup', 'conversion', 'newsletter');
};

export const trackContactForm = (formType: string) => {
  trackEvent('contact_form', 'conversion', formType);
  trackEvent('form_submit', 'conversion', formType);
};

// New engagement tracking events
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', 'engagement', `${percentage}%`);
};

export const trackTimeOnPage = (seconds: number) => {
  trackEvent('time_on_page', 'engagement', `${Math.floor(seconds / 60)}_minutes`);
};

export const trackClick = (elementType: string, elementName: string) => {
  trackEvent('click', 'engagement', `${elementType}_${elementName}`);
  trackEvent('user_interaction', 'engagement', 'click');
};

export const trackHover = (elementType: string, elementName: string) => {
  trackEvent('hover', 'engagement', `${elementType}_${elementName}`);
};

export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('video_play', 'engagement', videoTitle);
  trackEvent('media_interaction', 'engagement', 'video');
};

export const trackImageZoom = (imageTitle: string) => {
  trackEvent('image_zoom', 'engagement', imageTitle);
  trackEvent('media_interaction', 'engagement', 'image');
};

// Category and filter tracking
export const trackCategoryView = (category: string) => {
  trackEvent('view_item_list', 'category', category);
  trackEvent('category_browse', 'engagement', category);
};

export const trackPriceRangeFilter = (minPrice: number, maxPrice: number) => {
  trackEvent('price_filter', 'filter', `$${minPrice}-$${maxPrice}`);
  trackEvent('filter_used', 'site', 'price_range');
};

export const trackLocationFilter = (location: string) => {
  trackEvent('location_filter', 'filter', location);
  trackEvent('filter_used', 'site', 'location');
};

export const trackYearFilter = (year: string) => {
  trackEvent('year_filter', 'filter', year);
  trackEvent('filter_used', 'site', 'year');
};

// Social media tracking
export const trackSocialMediaClick = (platform: string, postType: string) => {
  trackEvent('social_media_click', 'social', `${platform}_${postType}`);
  trackEvent('external_link', 'engagement', platform);
};

export const trackSocialMediaShare = (platform: string, contentType: string) => {
  trackEvent('social_share', 'social', `${platform}_${contentType}`);
  trackEvent('share', 'engagement', platform);
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', 'system', `${errorType}_${errorMessage}`);
};

// Performance tracking
export const trackPageLoadTime = (loadTime: number) => {
  trackEvent('page_load_time', 'performance', `${Math.floor(loadTime)}ms`);
};

export const trackImageLoadTime = (imageUrl: string, loadTime: number) => {
  trackEvent('image_load_time', 'performance', `${imageUrl}_${Math.floor(loadTime)}ms`);
};

// Mobile-specific tracking
export const trackMobileInteraction = (interactionType: string) => {
  trackEvent('mobile_interaction', 'mobile', interactionType);
  trackEvent('user_interaction', 'engagement', 'mobile');
};

export const trackMobileSwipe = (direction: string) => {
  trackEvent('mobile_swipe', 'mobile', direction);
  trackEvent('gesture', 'engagement', 'swipe');
};

// Accessibility tracking
export const trackAccessibilityUsage = (feature: string) => {
  trackEvent('accessibility_used', 'accessibility', feature);
  trackEvent('user_interaction', 'engagement', 'accessibility');
};

// Custom event tracking for specific business goals
export const trackBusinessGoal = (goalName: string, value: number) => {
  trackEvent('business_goal', 'conversion', goalName, value);
};

export const trackUserJourney = (step: string, journeyType: string) => {
  trackEvent('user_journey', 'engagement', `${journeyType}_${step}`);
};

// Enhanced e-commerce tracking
export const trackAddToCart = (itemName: string, price: number) => {
  trackEvent('add_to_cart', 'ecommerce', itemName, price);
  trackEvent('shopping_cart', 'engagement', 'add_item');
};

export const trackRemoveFromCart = (itemName: string) => {
  trackEvent('remove_from_cart', 'ecommerce', itemName);
  trackEvent('shopping_cart', 'engagement', 'remove_item');
};

export const trackBeginCheckout = (totalValue: number) => {
  trackEvent('begin_checkout', 'ecommerce', 'checkout_start', totalValue);
  trackEvent('conversion_funnel', 'conversion', 'checkout_start');
};

export const trackPurchase = (transactionId: string, totalValue: number) => {
  trackEvent('purchase', 'ecommerce', transactionId, totalValue);
  trackEvent('conversion', 'conversion', 'purchase_complete');
};
