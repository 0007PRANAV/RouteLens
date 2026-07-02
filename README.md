# RouteLens - Smart Commute Optimizer

## Overview
RouteLens is a full-stack web application that helps users find the most efficient routes considering cost, time, and environmental impact. The app compares multiple transportation modes (driving, transit, cycling, walking) and provides real-time recommendations.

## Features
- ✅ Multi-modal route comparison (driving, transit, biking, walking)
- ✅ Real-time cost calculation including fuel, tolls, and transit fares
- ✅ CO₂ emissions tracking and eco-friendly recommendations
- ✅ Smart commute scheduling and optimization
- ✅ User profiles with saved preferences
- ✅ Analytics dashboard with weekly commute stats
- ✅ Interactive map integration with Google Maps API
- ✅ Responsive design for mobile and desktop

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive features
- **Google Maps API** - Map integration and routing
- **LocalStorage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database (can upgrade to PostgreSQL)
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

## Project Structure
```
routelens/
├── index.html              # Main app interface
├── css/
│   └── style.css          # All styling
├── js/
│   ├── app.js             # Main application logic
│   ├── api.js             # API calls and utilities
│   └── maps.js            # Google Maps integration
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Node dependencies
│   ├── .env               # Environment variables
│   └── routes/
│       ├── routes.js      # Route calculation endpoints
│       ├── auth.js        # Authentication endpoints
│       └── user.js        # User profile endpoints
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Google Maps API key
- Modern web browser

### Setup

1. **Clone or download the repository**
```bash
git clone https://github.com/yourusername/routelens.git
cd routelens
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
Create `backend/.env` file:
```
PORT=5000
JWT_SECRET=your_secret_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
ENVIRONMENT=development
```

4. **Get Google Maps API Key**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project
- Enable Maps JavaScript API, Places API, and Directions API
- Create an API key
- Add the key to both `backend/.env` and `index.html`

5. **Start the backend server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

6. **Start the frontend**
- Open `index.html` in your browser or use a local server:
```bash
# In the root directory
python -m http.server 8000
# Or use live-server if installed
live-server
```

## Usage

### Finding Routes
1. Enter your starting location in the "From" field
2. Enter your destination in the "To" field
3. Select a date and time
4. Choose transportation modes (you can select multiple)
5. Click "Find Routes" button
6. Compare options by cost, time, and environmental impact
7. Click "Select Route" to view details and save to history

### Managing Profile
1. Navigate to "Profile" section
2. Enter your home and work addresses
3. Select your car type for accurate cost calculations
4. Set your budget per trip
5. Click "Save Profile"

### Viewing Analytics
- Check your "Analytics" dashboard for weekly commute stats
- View total distance traveled, money saved, and CO₂ reduced
- See your favorite route and commute patterns

## API Endpoints

### Routes
- `POST /api/routes/calculate` - Calculate available routes
  ```json
  {
    "origin": "Times Square, NYC",
    "destination": "Central Park, NYC",
    "date": "2024-07-15",
    "time": "09:00",
    "modes": ["driving", "transit", "cycling"]
  }
  ```

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/profile` - Save user profile
- `GET /api/user/analytics` - Get user analytics
- `POST /api/user/history` - Save route to history

## Cost Calculation

### Driving
- Sedan: $0.12/km
- SUV: $0.15/km
- Hybrid: $0.08/km
- Electric: $0.05/km

### Transit
- Average: $2.50 per trip

### Cycling
- Bike-share: $1.00 per trip

### Walking
- Free

## Emissions Calculation

### CO₂ per km
- Sedan: 0.21 kg
- SUV: 0.28 kg
- Hybrid: 0.10 kg
- Electric: 0 kg
- Transit: 0.05 kg
- Cycling: 0 kg
- Walking: 0 kg

## Customization

### Change Default Location
Edit `js/maps.js`:
```javascript
const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
// Change to your city coordinates
```

### Adjust Rates
Edit `js/api.js` to modify cost and emission rates

### Add More Transport Modes
1. Add checkbox in `index.html`
2. Add logic in `generateMockRoutes()` function
3. Add API calculation in backend

## Future Enhancements
- Real-time traffic data integration
- Weather impact on route recommendations
- Integration with ride-sharing services (Uber, Lyft)
- Public transit schedule integration
- Parking availability checker
- Carbon offset options
- Social features (carpool matching)
- Mobile app (React Native)
- Machine learning for prediction
- Advanced analytics and reporting

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
MIT License - feel free to use this project for personal or commercial purposes

## Support
For issues or questions:
- Open a GitHub issue
- Email: support@routelens.com
- Visit: [RouteLens Website](https://routelens.com)

## Roadmap
- Q3 2024: Beta launch with core features
- Q4 2024: Mobile app release
- Q1 2025: AI-powered recommendations
- Q2 2025: Corporate partnerships

---
**Made with ❤️ for smarter commuting**