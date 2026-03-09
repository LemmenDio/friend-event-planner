# Friend Event Planner 🎉

A collaborative event planning app that lets you and your friends create, share, and sync events in real-time.

## Features

- 📅 **Interactive Calendar** - Beautiful monthly, weekly, and daily views
- 🔄 **Real-time Sync** - Events update instantly for everyone
- 👥 **Multi-user** - All friends can add and edit events
- 🎨 **Color Coding** - Organize events with different colors
- 📍 **Location Support** - Add event locations
- 📝 **Descriptions** - Add details to your events
- 📱 **Responsive** - Works on desktop and mobile
- **100% Free** - No costs involved

## Quick Start

### Prerequisites
- Node.js installed on your machine

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Install client dependencies**
```bash
cd client
npm install
cd ..
```

3. **Start the app**
```bash
npm run dev
```

This will start both the backend server (port 3001) and frontend (port 3000) simultaneously.

### Usage

1. Open your browser and go to `http://localhost:3000`
2. Click on any date to add a new event
3. Click existing events to edit or delete them
4. All changes sync in real-time with everyone who has the app open

## How It Works

- **Backend**: Node.js with Express and Socket.io for real-time communication
- **Frontend**: React with FullCalendar for the calendar interface
- **Real-time**: Socket.io handles instant updates across all connected users
- **Storage**: In-memory storage (events persist while server is running)

## Deployment (Free Options)

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy with one click - it's free!

### Option 2: Railway
1. Sign up for Railway
2. Connect your GitHub repo
3. Railway will automatically deploy your app

### Option 3: Heroku (Free tier)
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Push to Heroku: `git push heroku main`

## Customization

### Change Colors
Edit the color options in `client/src/App.js`:
```javascript
{['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
```

### Add More Fields
Add new fields to the form in `client/src/App.js` and update the backend in `server.js`.

## Tech Stack

- **Frontend**: React 18, TailwindCSS, FullCalendar
- **Backend**: Node.js, Express, Socket.io
- **Real-time**: WebSocket connections
- **Styling**: TailwindCSS with Lucide icons

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this for your own projects!
