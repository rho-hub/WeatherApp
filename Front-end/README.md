Weather App 🌦️

A modern weather application built with Next.js (frontend) and Laravel (backend) that displays current weather conditions and 3-day forecasts. Features dark/light mode toggle and responsive design.

![Weather App Screenshot](/screenshot.png) *(Replace with your actual screenshot)*

 Features ✨

- Current Weather Data:
  - Temperature (ºC/Fº toggle)
  - Weather conditions with icons
  - Wind speed and direction
  - Humidity percentage

- 3-Day Forecast:
  - Daily min/max temperatures
  - Weather condition icons
  - Clean card layout

- User Experience:
  - Dark/Light mode toggle
  - City search functionality
  - Responsive design (mobile/desktop)
  - Loading states

- Technical:
  - Type-safe TypeScript implementation
  - Decoupled architecture (Next.js + Laravel)
  - OpenWeatherMap API integration

Technologies Used 🛠️

Frontend:
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Fetch API

Backend:
- Laravel 11
- Guzzle HTTP Client
- OpenWeatherMap API

Installation Guide 📥

Backend Setup (Laravel)

1. Clone the repository:
2. Install dependencies:

bash
composer install
Configure environment:

bash
cp .env.example .env
php artisan key:generate
Add your OpenWeatherMap API key to .env:

env
OPENWEATHER_API_KEY=your_api_key_here
Start the server:

bash
php artisan serve
Frontend Setup (Next.js)
Navigate to frontend directory:

bash
cd next-weather-app

3. Install dependencies:

bash
npm install

4. Start development server:

bash
npm run dev
Open in browser:

http://localhost:3000