// Google Analytics 4 Event Tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Key Events için event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'User Engagement',
      event_label: eventName,
      ...parameters,
    });
  }
};

// Form gönderimi
export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submit', {
    form_type: formType,
    event_category: 'Form',
    event_label: `${formType} Form Submission`,
  });
};

// Araç favorileme
export const trackVehicleFavorite = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('vehicle_favorite', {
    vehicle_id: vehicleId,
    vehicle_title: vehicleTitle,
    event_category: 'Vehicle',
    event_label: 'Vehicle Added to Favorites',
  });
};

// Mesaj gönderme
export const trackMessageSent = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('message_sent', {
    vehicle_id: vehicleId,
    vehicle_title: vehicleTitle,
    event_category: 'Messaging',
    event_label: 'Message Sent to Seller',
  });
};

// Araç detay sayfası görüntüleme
export const trackVehicleView = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('vehicle_view', {
    vehicle_id: vehicleId,
    vehicle_title: vehicleTitle,
    event_category: 'Vehicle',
    event_label: 'Vehicle Detail Page View',
  });
};

// Newsletter kaydı
export const trackNewsletterSignup = (email: string) => {
  trackEvent('newsletter_signup', {
    email: email,
    event_category: 'Newsletter',
    event_label: 'Newsletter Subscription',
  });
};

// Araç satış işaretleme
export const trackVehicleSold = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('vehicle_sold', {
    vehicle_id: vehicleId,
    vehicle_title: vehicleTitle,
    event_category: 'Vehicle',
    event_label: 'Vehicle Marked as Sold',
  });
};

// Arama yapma
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    event_category: 'Search',
    event_label: 'Vehicle Search',
  });
};

// Sayfa görüntüleme
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      event_category: 'Navigation',
      event_label: 'Page View',
    });
  }
};

// Scroll depth tracking
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    percentage: percentage,
    event_category: 'User Engagement',
    event_label: `Scrolled ${percentage}%`,
  });
};

// Category view tracking
export const trackCategoryView = (category: string) => {
  trackEvent('category_view', {
    category: category,
    event_category: 'Navigation',
    event_label: `Viewed ${category} Category`,
  });
};

// Click tracking
export const trackClick = (elementType: string, elementName: string) => {
  trackEvent('click', {
    element_type: elementType,
    element_name: elementName,
    event_category: 'User Engagement',
    event_label: `Clicked ${elementType}: ${elementName}`,
  });
};

// Social media click tracking
export const trackSocialMediaClick = (platform: string, postType: string) => {
  trackEvent('social_media_click', {
    platform: platform,
    post_type: postType,
    event_category: 'Social Media',
    event_label: `Clicked ${platform} ${postType}`,
  });
};

// Enhanced Vehicle listing events
export const trackVehicleContact = (vehicleId: string, vehicleTitle: string) => {
  trackEvent('contact_seller', {
    vehicle_id: vehicleId,
    vehicle_title: vehicleTitle,
    event_category: 'Vehicle',
    event_label: 'Contact Seller',
  });
  trackEvent('generate_lead', {
    event_category: 'Conversion',
    event_label: 'Vehicle Contact Lead',
  });
};

export const trackVehicleList = (vehicleTitle: string, category: string, price: number) => {
  trackEvent('vehicle_list', {
    vehicle_title: vehicleTitle,
    category: category,
    price: price,
    event_category: 'Vehicle',
    event_label: 'Vehicle Listed',
  });
};

export const trackUserRegistration = (method: string) => {
  trackEvent('user_registration', {
    method: method,
    event_category: 'User',
    event_label: 'User Registration',
  });
};

export const trackUserLogin = (method: string) => {
  trackEvent('user_login', {
    method: method,
    event_category: 'User',
    event_label: 'User Login',
  });
};

export const trackFilterUsage = (filterType: string, filterValue: string) => {
  trackEvent('filter_usage', {
    filter_type: filterType,
    filter_value: filterValue,
    event_category: 'User Engagement',
    event_label: 'Filter Applied',
  });
};

export const trackConversion = (source: string) => {
  trackEvent('conversion', {
    source: source,
    event_category: 'Conversion',
    event_label: 'Conversion Completed',
  });
};

export const trackContactForm = (formType: string) => {
  trackEvent('contact_form', {
    form_type: formType,
    event_category: 'Contact',
    event_label: 'Contact Form Submitted',
  });
};
