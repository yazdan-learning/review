# Google Places API Setup Guide

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable the following APIs**:
   - Places API (New)
   - Maps JavaScript API (optional, for enhanced map features)
   - Geocoding API (optional, for address conversion)

## Step 2: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. **Important**: Restrict your API key for security:
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose the APIs you enabled above

## Step 3: Configure API Key in Your App

### Option 1: Direct Configuration (for testing)
Open `services/googlePlacesApi.ts` and replace:
```typescript
const API_KEY = 'YOUR_API_KEY_HERE';
```
with:
```typescript
const API_KEY = 'your-actual-api-key-here';
```

### Option 2: Environment Variables (recommended for production)
1. Create a `.env` file in your project root:
```env
GOOGLE_PLACES_API_KEY=your-actual-api-key-here
```

2. Update `services/googlePlacesApi.ts`:
```typescript
import { GOOGLE_PLACES_API_KEY } from '@env';
const API_KEY = GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY_HERE';
```

## Step 4: API Usage & Pricing

**Free Tier**: Google provides $200 monthly credit
- **Text Search**: $32 per 1000 requests
- **Place Details**: $17 per 1000 requests
- **Autocomplete**: $2.83 per 1000 requests

**Cost Optimization Tips**:
- The app includes 500ms debouncing to reduce API calls
- Uses field masks to only request needed data
- Implements error handling with fallback to demo data

## Step 5: Test Your Setup

1. Add your API key to the app
2. Restart your development server
3. You should see "🌐 Using Google Places API" in the app
4. Try searching for real places like "restaurants in New York"

## Troubleshooting

**Common Issues**:
- **403 Forbidden**: Check if APIs are enabled and API key restrictions
- **400 Bad Request**: Verify API key format and request structure
- **Quota Exceeded**: Check your Google Cloud billing and quotas

**If API fails**: The app automatically falls back to demo data and shows an error message.