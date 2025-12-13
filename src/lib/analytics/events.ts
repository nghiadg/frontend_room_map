/**
 * Typed GA4 Event Tracking Functions
 * Provides type-safe wrappers for tracking specific events
 */

import { trackEvent } from "./analytics";
import { GA4_EVENTS } from "./constants";

// ============================================
// Authentication Events
// ============================================

/**
 * Track user login
 */
export const trackLogin = (method: "google" = "google") => {
  trackEvent(GA4_EVENTS.LOGIN, { method });
};

/**
 * Track new user registration (first-time sign up)
 */
export const trackSignUp = (method: "google" = "google") => {
  trackEvent(GA4_EVENTS.SIGN_UP, { method });
};

/**
 * Track user logout
 */
export const trackLogout = () => {
  trackEvent(GA4_EVENTS.LOGOUT);
};

// ============================================
// Post/Listing Events
// ============================================

type ItemParams = {
  itemId: string | number;
  itemName: string;
  propertyType?: string;
  price?: number;
  currency?: string;
};

/**
 * Track viewing a post detail page
 */
export const trackViewItem = ({
  itemId,
  itemName,
  propertyType,
  price,
  currency = "VND",
}: ItemParams) => {
  trackEvent(GA4_EVENTS.VIEW_ITEM, {
    currency,
    value: price,
    items: [
      {
        item_id: String(itemId),
        item_name: itemName,
        item_category: propertyType,
        price,
      },
    ],
  });
};

/**
 * Track clicking on a post card or map marker
 */
export const trackSelectItem = ({
  itemId,
  itemName,
  propertyType,
  listName,
}: ItemParams & { listName?: string }) => {
  trackEvent(GA4_EVENTS.SELECT_ITEM, {
    item_list_name: listName,
    items: [
      {
        item_id: String(itemId),
        item_name: itemName,
        item_category: propertyType,
      },
    ],
  });
};

/**
 * Track viewing listings on map
 */
export const trackViewItemList = (
  listName: string,
  itemCount: number,
  filters?: Record<string, unknown>
) => {
  trackEvent(GA4_EVENTS.VIEW_ITEM_LIST, {
    item_list_name: listName,
    items_count: itemCount,
    ...filters,
  });
};

// ============================================
// Lead Generation Events
// ============================================

type ContactParams = {
  itemId: string | number;
  contactMethod: "phone" | "zalo" | "message";
};

/**
 * Track when user contacts a host (requires consent)
 */
export const trackGenerateLead = ({ itemId, contactMethod }: ContactParams) => {
  trackEvent(GA4_EVENTS.GENERATE_LEAD, {
    item_id: String(itemId),
    contact_method: contactMethod,
  });
};

// ============================================
// Post Creation Funnel Events
// ============================================

/**
 * Track starting post creation (requires consent)
 */
export const trackBeginCheckout = () => {
  trackEvent(GA4_EVENTS.BEGIN_CHECKOUT, {
    content_type: "rental_listing",
  });
};

/**
 * Track successful post publication (requires consent)
 */
export const trackPostPublished = ({
  itemId,
  itemName,
  propertyType,
  price,
}: ItemParams) => {
  trackEvent(GA4_EVENTS.PURCHASE, {
    currency: "VND",
    value: price || 0,
    transaction_id: String(itemId),
    items: [
      {
        item_id: String(itemId),
        item_name: itemName,
        item_category: propertyType,
        price,
      },
    ],
  });
};

// ============================================
// Search & Discovery Events
// ============================================

type SearchParams = {
  searchTerm?: string;
  filters?: Record<string, unknown>;
  resultsCount?: number;
};

/**
 * Track search/filter actions
 */
export const trackSearch = ({
  searchTerm,
  filters,
  resultsCount,
}: SearchParams) => {
  trackEvent(GA4_EVENTS.SEARCH, {
    search_term: searchTerm,
    results_count: resultsCount,
    ...filters,
  });
};
