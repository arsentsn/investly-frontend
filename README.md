# Investly Frontend

Investly is our 2 day hackathon project! An AI-powered investment assistant frontend built with React that provides an intuitive chat interface for cryptocurrency trading and portfolio management.

**🔗 Backend Repository**: [investly-backend](https://github.com/pgiannopoulos/investly-backend/tree/main)

https://github.com/user-attachments/assets/de449a2f-9ca6-4b29-b2e3-db56baf42d6c

## Features

- **AI Chat Interface**: Real-time conversation with AI investment assistant
- **Interactive Widgets**: Dynamic trading widgets for quick buy/sell operations
- **Portfolio Visualization**: Chart-based portfolio overview with Recharts
- **Trade History Display**: Comprehensive trade history with detailed information
- **Real-time Updates**: WebSocket integration for live data updates
- **Responsive Design**: Mobile-friendly interface with modern styling
- **Price Fetching**: Integration with CoinGecko API for real-time crypto prices
- **Order Management**: Visual order displays with execution details
- **Multi-Widget Support**: Dynamic widget rendering for different trading interfaces

## Technology Stack

- **React 19.0.0** - Frontend framework
- **JavaScript (ES6+)** - Programming language
- **WebSocket** - Real-time communication
  - SockJS Client 1.6.1
  - STOMP.js 7.0.0
- **Charts & Visualization**
  - Recharts 2.15.1
  - Chart.js 4.4.8
  - React-Chartjs-2 5.3.0
- **HTTP Client** - Axios 1.7.9
- **CSS3** - Custom styling with animations
- **React Context API** - State management
- **GitHub Pages** - Deployment platform

## Prerequisites

- Node.js 16+ or higher
- npm or yarn package manager
- Backend server running on `http://localhost:8086`
- CoinGecko API access (free tier available)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd investly-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will start on `http://localhost:3000` by default.

## Available Scripts

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder with optimized performance.

### `npm run deploy`

Deploys the app to GitHub Pages (requires `gh-pages` package).

## Configuration

The frontend connects to the backend WebSocket server at `http://localhost:8086/ws`. Make sure the backend is running before starting the frontend.

### Environment Variables

No additional environment variables are required for basic functionality. The app uses:

- Backend WebSocket: `http://localhost:8086/ws`
- CoinGecko API: `https://api.coingecko.com/api/v3/simple/price`

## Project Structure

```
src/
├── components/
│   ├── ChatDisplay.js           # Main chat interface with message formatting
│   ├── HeaderComponents.js      # Header with logo and profile
│   ├── InputComponents.js       # Message input with WebSocket integration
│   ├── WidgetRenderer.js        # Dynamic widget rendering logic
│   └── WidgetsBar.js           # Widgets container management
├── constants/
│   └── userConstants.js        # User configuration constants
├── utils/
│   ├── CryptoNameConverter.js   # Crypto symbol to CoinGecko ID mapping
│   ├── CryptoPriceFetcher.js   # Real-time price fetching utility
│   ├── OrderDisplay.js         # Order information display component
│   ├── PortfolioChartWidget.js # Portfolio chart visualization
│   ├── PriceContext.js         # Price management context provider
│   └── TradeHistoryDisplay.js  # Trade history component
├── static/
│   ├── logo.png               # Application logo
│   ├── logo.svg               # Vector logo
│   ├── profile-pic.jpg        # Profile picture
│   └── profile.webp           # Optimized profile picture
├── App.js                     # Main application component
├── App.css                    # Application styles
├── index.js                   # Application entry point
└── index.css                  # Global styles
```

## Key Components

### Chat Interface

- **ChatDisplay**: Main chat component with message formatting and WebSocket message handling
- **InputBox**: Message input with WebSocket integration for real-time communication
- **Message Types**:
  - User messages with loading states
  - AI responses with formatted content
  - Widget displays for trading interfaces
  - Order confirmations and trade history

### Trading Widgets

- **QUICK_TRADE**: Quick buy/sell interface with real-time price conversion
- **PORTFOLIO**: Portfolio overview with balance visualization
- **PROFIT_LOSS**: P&L tracking with percentage changes
- **MARKET_OVERVIEW**: Market analysis and top movers

### Data Management

- **PriceContext**: React Context for managing cryptocurrency prices
- **CryptoNameConverter**: Maps trading symbols to CoinGecko IDs
- **CryptoPriceFetcher**: Fetches real-time prices from CoinGecko API

### Visualization

- **PortfolioChartWidget**: Bar charts for portfolio distribution using Recharts
- **OrderDisplay**: Formatted order information with execution details
- **TradeHistoryDisplay**: Comprehensive trade history with filtering

## WebSocket Integration

The frontend uses STOMP over SockJS for real-time communication:

- **Connection**: `http://localhost:8086/ws`
- **Send Endpoint**: `/messages/new`
- **Subscribe Topic**: `/topic/messages`

### Message Flow

1. User types message in InputBox
2. Message sent via WebSocket to backend
3. AI processes message and responds
4. Response received and formatted in ChatDisplay
5. Widgets dynamically rendered based on response content

## API Integration

### CoinGecko API

- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Purpose**: Real-time cryptocurrency price fetching
- **Rate Limits**: Free tier limitations apply

### Backend API

- **WebSocket**: Real-time chat communication
- **REST Endpoints**: Via backend for trading operations

## Styling

- **CSS Modules**: Component-specific styling
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and loading states
- **Theme**: Modern, clean interface with professional trading aesthetics

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Deployment to GitHub Pages

```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.
