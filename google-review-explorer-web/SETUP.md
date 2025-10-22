# Quick Setup Guide - Google Review Explorer Web

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd google-review-explorer-web
npm install
```

This will install all required packages including:
- React 18
- Material-UI (MUI)
- React Router
- TypeScript
- And all other dependencies

### Step 2: Configure API Key (Optional)

**Option A: Use Demo Mode (No Setup Required)**
- The app will automatically use mock data
- Perfect for testing and demo purposes

**Option B: Use Real Google Places API**
1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Open `src/services/googlePlacesApi.ts`
3. Replace the API key on line 4:
```typescript
const API_KEY: string = 'YOUR_ACTUAL_API_KEY_HERE';
```

### Step 3: Start the App
```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## 📱 What You'll See

1. **Search Page** - Type to search places (or browse popular places)
2. **Place Details** - Click any place to see:
   - Place information
   - AI review summary
   - Chat button
   - Map location
   - Customer reviews
3. **Chat** - Ask questions about the place

## 🛠️ Available Commands

```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests (if configured)
```

## 🎨 Customization

### Change Colors
Edit `src/App.tsx` - Look for the theme configuration:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#6200ea' },  // Purple
    secondary: { main: '#00b894' }, // Teal
  },
});
```

### Add More Mock Data
Edit `src/services/mockData.ts` - Add more places to the `mockPlaces` array

## 🔧 Troubleshooting

### Port Already in Use
If port 3000 is busy, you can:
- Kill the process using port 3000
- Or the app will prompt you to use a different port

### Dependencies Installation Failed
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Errors
Make sure you have:
- Node.js v14 or higher
- npm v6 or higher

Check versions:
```bash
node --version
npm --version
```

## 📝 Key Features

✅ Autocomplete search with dropdown  
✅ Real-time place search  
✅ AI-powered review summaries  
✅ Interactive chatbot  
✅ Google Maps integration  
✅ Responsive design  
✅ TypeScript for type safety  
✅ Material-UI components  

## 🆚 Differences from Mobile App

| Feature | Mobile (React Native) | Web (React) |
|---------|----------------------|-------------|
| Framework | Expo/React Native | React DOM |
| UI Library | React Native Paper | Material-UI |
| Navigation | React Navigation | React Router |
| Maps | react-native-maps | Google Maps Embed |
| Platform | iOS, Android | Web Browsers |

## 📦 Project Structure

```
src/
├── pages/           # Main page components
│   ├── SearchPage.tsx
│   ├── PlaceDetailsPage.tsx
│   └── ChatPage.tsx
├── services/        # API and data services
│   ├── googlePlacesApi.ts
│   └── mockData.ts
├── types/           # TypeScript definitions
│   └── index.ts
├── App.tsx          # Main app with routing
└── index.tsx        # Entry point
```

## 🎯 Next Steps

1. **Test the Demo**: Run with mock data first
2. **Add API Key**: Configure Google Places API
3. **Customize UI**: Change colors and styling
4. **Deploy**: Build and deploy to your hosting service

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized `build/` folder ready for deployment.

### Deploy Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `build` folder
- **GitHub Pages**: Use `gh-pages` package
- **Custom Server**: Serve the `build` folder with any web server

### Environment Variables (Production)
For production, use environment variables instead of hardcoding API keys:

1. Create `.env` file:
```
REACT_APP_GOOGLE_API_KEY=your_key_here
```

2. Update `googlePlacesApi.ts`:
```typescript
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';
```

## 🤝 Support

Need help? Check:
- README.md for detailed documentation
- Browser console for error messages
- Network tab for API issues

Happy coding! 🎉

