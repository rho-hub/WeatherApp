"use client"

import { useState, useEffect } from "react"
import { Search, Wind, Droplets, MapPin, Calendar, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"

interface WeatherData {
  name?: string
  main?: {
    temp: number
    humidity: number
    temp_min: number
    temp_max: number
  }
  weather?: Array<{
    description: string
    icon: string
    main: string
  }>
  wind?: {
    speed: number
    deg: number
  }
  dt?: number
}

interface ForecastData {
  dt?: number
  main?: {
    temp_min: number
    temp_max: number
  }
  weather?: Array<{
    icon: string
    main: string
  }>
}

export default function Home() {
  const [city, setCity] = useState("Nairobi")
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Fetch weather data
  const fetchWeatherData = async () => {
    if (!city) return

    setLoading(true)
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/weather/current?city=${city}&units=${unit}`),
        fetch(`http://127.0.0.1:8000/api/weather/forecast?city=${city}&units=${unit}`)
      ])

      if (!weatherRes.ok || !forecastRes.ok) throw new Error('Failed to fetch')
      
      const weatherData = await weatherRes.json()
      const forecastData = await forecastRes.json()
      
      setWeather(weatherData)
      setForecast(forecastData.list?.slice(0, 3) || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const getWindDirection = (degrees: number = 0) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.round((degrees % 360) / 45) % 8]
  }

  const formatDate = (timestamp: number = Date.now() / 1000) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    })
  }

  const getWeatherIcon = (iconCode: string = "01d") => {
    const icons: Record<string, string> = {
      '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
      '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️'
    }
    return icons[iconCode.substring(0, 2)] || '☀️'
  }

  useEffect(() => {
    fetchWeatherData()
  }, [city, unit])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchWeatherData()
  }



  return (
    <div className={`min-h-screen p-4 md:p-8 flex items-center justify-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900'
    }`}>
      <div className={`w-full max-w-5xl card shadow-xl overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}>
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 text-amber-400' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Panel - Current Weather */}
          <div className={`md:w-2/5 p-8 flex flex-col items-center justify-between transition-colors duration-300 ${
            darkMode ? 'bg-gradient-to-b from-gray-700 to-gray-800' : 'bg-gradient-to-b from-amber-500 to-orange-600 text-white'
          }`}>
            <div className="w-full flex justify-between items-start">
              <div className="flex items-center gap-1 text-sm opacity-90">
                <MapPin size={14} />
                <span>{weather?.name || "Location"}</span>
              </div>
              <div className="flex items-center gap-1 text-sm opacity-90">
                <Calendar size={14} />
                <span>{formatDate(weather?.dt)}</span>
              </div>
            </div>

            <div className="flex flex-col items-center py-8">
              <div className="relative">
                {weather?.weather?.[0]?.icon ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt="Weather icon"
                    className="w-48 h-48 drop-shadow-lg"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-6xl">
                    {getWeatherIcon()}
                  </div>
                )}
              </div>
              
              <div className="text-6xl font-light mt-2">
                {Math.round(weather?.main?.temp || 0)}°{unit === "metric" ? "C" : "F"}
              </div>
              
              <div className="text-xl font-medium capitalize mt-2">
                {weather?.weather?.[0]?.description || "Sunny"}
              </div>
              
              <div className="flex gap-6 mt-8">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-sm opacity-80">
                    <Wind size={14} />
                    <span>Wind</span>
                  </div>
                  <div className="text-lg font-medium mt-1">
                    {weather?.wind?.speed?.toFixed(1) || "--"} {unit === "metric" ? "km/h" : "mph"}
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-sm opacity-80">
                    <Droplets size={14} />
                    <span>Humidity</span>
                  </div>
                  <div className="text-lg font-medium mt-1">
                    {weather?.main?.humidity || "--"}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Search and Forecast */}
          <div className="md:w-3/5 p-8">
            {/* Search Bar */}
            <div className="relative mb-8 flex items-center">
              <div className="absolute left-3 pointer-events-none">
                <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-amber-600'}`} />
              </div>
              <input
                type="text"
                placeholder="Search city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-20 py-3 rounded-full focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500' 
                    : 'border border-amber-300 text-black focus:ring-amber-400'
                }`}
              />
              <button
                onClick={fetchWeatherData}
                disabled={loading || !city}
                className={`absolute right-2 px-4 py-1.5 rounded-full font-medium transition-colors ${
                  loading || !city
                    ? 'bg-gray-300 text-gray-500'
                    : darkMode
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {loading ? "..." : "Go"}
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div className={`flex items-center rounded-full p-1 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <button
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    unit === "metric" 
                      ? darkMode 
                        ? 'bg-gray-600 text-amber-400' 
                        : 'bg-white text-amber-600 shadow-sm'
                      : darkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                  }`}
                  onClick={() => setUnit("metric")}
                >
                  °C
                </button>
                <button
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    unit === "imperial" 
                      ? darkMode 
                        ? 'bg-gray-600 text-amber-400' 
                        : 'bg-white text-amber-600 shadow-sm'
                      : darkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                  }`}
                  onClick={() => setUnit("imperial")}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Forecast Section */}
            <div className="mb-8">
              <h2 className={`text-lg font-medium mb-4 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                3-Day Forecast
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {forecast.length > 0 ? (
                  forecast.map((day, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl flex flex-col items-center transition-colors duration-300 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-50 hover:bg-amber-100'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {formatDate(day.dt)}
                      </div>
                      <div className="text-3xl my-2">
                        {getWeatherIcon(day.weather?.[0]?.icon)}
                      </div>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {Math.round(day.main?.temp_min || 0)}-{Math.round(day.main?.temp_max || 0)}°
                        {unit === "metric" ? "C" : "F"}
                      </div>
                    </div>
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl flex flex-col items-center ${
                        darkMode ? 'bg-gray-700' : 'bg-amber-50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Day {index + 1}
                      </div>
                      <div className="text-3xl my-2">☀️</div>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        --°{unit === "metric" ? "C" : "F"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Weather Details */}
            <div className="mt-8">
              <h2 className={`text-lg font-medium mb-4 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Weather Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-50 hover:bg-amber-100'
                }`}>
                  <div className={`text-sm mb-2 font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Wind Status
                  </div>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {weather?.wind?.speed?.toFixed(1) || "--"}
                    </span>
                    <span className={`mb-0.5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {unit === "metric" ? "km/h" : "mph"}
                    </span>
                  </div>
                  <div className="flex items-center mt-3">
                    <Wind size={16} className="text-amber-500 mr-2" />
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {getWindDirection(weather?.wind?.deg)}
                    </span>
                  </div>
                </div>
                
                <div className={`p-5 rounded-xl transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-50 hover:bg-amber-100'
                }`}>
                  <div className={`text-sm mb-2 font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Humidity
                  </div>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {weather?.main?.humidity || "--"}
                    </span>
                    <span className={`mb-0.5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      %
                    </span>
                  </div>
                  <div className="w-full mt-3">
                    <progress
                      className={`progress w-full ${
                        darkMode ? 'progress-warning' : 'progress-primary'
                      }`}
                      value={weather?.main?.humidity || 0}
                      max="100"
                    ></progress>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}