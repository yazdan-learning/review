# Google Review Explorer - Web Version

A React web application that allows users to search for places using the Google Places API, view AI-generated review summaries, and chat with an AI assistant about the reviews.

## Features

- 🔍 **Search Places**: Search for restaurants, hotels, cafes, and more
- 📊 **AI Review Summary**: Get AI-generated summaries of customer reviews
- 💬 **Chat Assistant**: Ask questions about the place and get AI-powered answers
- 🗺️ **Location Map**: View the place location on Google Maps
- ⭐ **Reviews**: Read individual customer reviews

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Google Places API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Places API Key

### Installation

1. Clone the repository or navigate to this directory:
```bash
cd google-review-explorer-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Google Places API Key:
   - Open `src/services/googlePlacesApi.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - For Google Maps embed, update the key in `src/pages/PlaceDetailsPage.tsx`

### Running the App

Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000)

### Building for Production

Build the app for production:
```bash
npm run build
```

The optimized build will be in the `build` folder.

## Project Structure

```
google-review-explorer-web/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── SearchPage.tsx       # Main search page
│   │   ├── PlaceDetailsPage.tsx # Place details and reviews
│   │   └── ChatPage.tsx         # Chat with AI assistant
│   ├── services/
│   │   ├── googlePlacesApi.ts   # Google Places API integration
│   │   └── mockData.ts          # Mock data for testing
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── App.tsx                  # Main app component with routing
│   ├── index.tsx                # Entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## API Configuration

### Google Places API

To use the Google Places API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Places API (New)" 
4. Create an API key
5. Add the API key to `src/services/googlePlacesApi.ts`

### Demo Mode

If no API key is configured, the app will automatically use mock data for demonstration purposes.

## Features Overview

### Search Page
- Autocomplete search with dropdown
- Real-time search results
- Popular places section
- API/Demo mode indicator

### Place Details Page
- Place information card (name, rating, address)
- AI-generated review summary with pros/cons
- Chat button to ask questions
- Google Maps location
- Expandable customer reviews section

### Chat Page
- Interactive AI chatbot
- Context-aware responses about the place
- Real-time message interface
- Smart suggestions based on common questions

## Customization

### Changing Theme Colors

Edit `src/App.tsx` to customize the color scheme:
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // Change primary color
    },
    secondary: {
      main: '#00b894', // Change secondary color
    },
  },
});
```

### Adding More Mock Data

Add more places in `src/services/mockData.ts` in the `mockPlaces` array.

## Troubleshooting

### API Not Working
- Check that your API key is correctly configured
- Verify the Places API (New) is enabled in Google Cloud Console
- Check browser console for error messages

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

