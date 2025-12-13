# Google Analytics 4 (GA4) Integration

RoomMap uses Google Analytics 4 for tracking user behavior and engagement. This guide covers setup, available events, and debugging.

## Setup

### 1. Get Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new **GA4 property** (or use existing)
3. Go to **Admin** → **Data Streams** → **Web**
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add to `.env.local`:

```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Verify Installation

1. Open your site with `?debug_mode=true` in the URL
2. Open GA4 → **Admin** → **DebugView**
3. You should see events appearing in real-time

## Cookie Consent

RoomMap implements GDPR-compliant cookie consent with two tiers:

| Event Type | Consent Required | Examples                       |
| ---------- | ---------------- | ------------------------------ |
| Standard   | No               | `page_view`, `login`, `logout` |
| Sensitive  | Yes              | `generate_lead`, `purchase`    |

Users see a consent banner on first visit. Their choice is stored in `localStorage`.

## Available Events

### Authentication

- `login` - User signs in with Google
- `logout` - User signs out
- `sign_up` - New user registration (not yet implemented)

### Engagement

- `view_item` - View post details
- `select_item` - Click on post card/marker
- `view_item_list` - View listings on map
- `search` - Search/filter actions

### Conversions (Consent Required)

- `generate_lead` - Contact host (call/Zalo)
- `begin_checkout` - Start creating post
- `purchase` - Publish post successfully

## Usage Examples

```typescript
import { trackViewItem, trackGenerateLead } from "@/lib/analytics";

// Track viewing a post
trackViewItem({
  itemId: post.id,
  itemName: post.title,
  propertyType: post.propertyTypes?.name,
  price: post.price,
});

// Track contact action (requires consent)
trackGenerateLead({
  itemId: post.id,
  contactMethod: "phone",
});
```

## Debugging

### Development Console

Events are logged to console in development:

```
[GA4] Event tracked: view_item {...}
[GA4] Event "generate_lead" skipped - no consent
```

### GA4 DebugView

1. Add `?debug_mode=true` to any URL
2. Open GA4 → **Admin** → **DebugView**
3. See events in real-time

### Check Consent State

```javascript
// In browser console
JSON.parse(localStorage.getItem("roommap_cookie_consent"));
```

## File Structure

```
src/lib/analytics/
├── index.ts          # Public API exports
├── analytics.ts      # Core GA4 init & tracking
├── events.ts         # Typed event functions
└── constants.ts      # Event names & config

src/components/shared/
├── analytics-provider.tsx    # GA4 script loader
└── cookie-consent-banner.tsx # GDPR consent UI

src/hooks/
└── use-cookie-consent.ts     # Consent state hook
```

## Notes

- If `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is not set, GA4 is disabled
- Events are only sent after user grants consent for sensitive actions
- Debug mode is enabled automatically in development
