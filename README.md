# WeatherFlow ☀️🌧️

A beautifully styled, modern weather app built with **Next.js**, **Tailwind CSS**, and **React Leaflet**. It fetches real-time weather data from OpenWeather API (v2.5, free tier) and displays stunning **background videos** based on the searched location using the Pexels API.

---

## 📷 Project Image

<p float="left">
  <img src="https://raw.githubusercontent.com/lucasjolibois54/weatherflow/main/public/app-image.png" width="100%" />
</p>

---

## 🚀 Features

- 🌍 Search for weather by city or click anywhere on the map  
- 🗺️ Interactive map with dark styling and click-to-select  
- 📍 Location detection and reverse geocoding  
- 🌡️ Toggle between Celsius and Fahrenheit  
- 🎥 Dynamic **background videos** based on current location  
- 🌤️ Current weather and 4-day forecast  
- ⚡ Fully responsive and mobile-friendly  
- 💅 Styled using Tailwind CSS with glassmorphism UI  

---

## 🛠️ Tech Stack

- Next.js (App Router)
- React & TypeScript
- Tailwind CSS
- React Leaflet
- React Icons
- OpenWeather API (v2.5, Free Tier)
- Pexels API (for background videos)

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/lucasjolibois54/weatherflow.git
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set environment variables

Create a `.env.local` file in the root of the project and add:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key
```

> You can get your API keys from:  
> 🔗 [https://openweathermap.org/api](https://openweathermap.org/api)  
> 🔗 [https://www.pexels.com/api/](https://www.pexels.com/api/)

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Notes

- Weather data is fetched from OpenWeather API v2.5 using the free tier  
- Uses **context** to manage weather data, temperature units, and coordinates  
- Map is rendered client-side using `dynamic` import with `ssr: false`  
- Weather-based video backgrounds pulled from Pexels dynamically
- Fully commented and clean code structure

---

## 👨‍💻 Author

Developed by **Lucas Jolibois**  

🌐 [lucasjolibois.com](https://lucasjolibois.com)  
🐙 [github.com/lucasjolibois54](https://github.com/lucasjolibois54)
