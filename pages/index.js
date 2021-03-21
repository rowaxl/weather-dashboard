import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '../api/fetcher'
import Card from '../components/Card'

const IS_DEV = process.env['NODE_ENV'] === 'development'
const WEATHER_API_KEY = `?key=${process.env['NEXT_PUBLIC_WEATHER_API_KEY']}`
const BASE_URL = 'https://api.weatherapi.com/v1/'
const CURRENT_KEY = 'current.json'
const FORECAST_KEY = 'forecast.json'

export default function Home() {
  const [location, setLocation] = useState('London')
  const [buffer, setBuffer] = useState()
  const [tempertureUnit, setTempertureUnit] = useState('c')

  const { data: locationData, error: locationError } = useSWR('/api/geo', fetcher, { errorRetryCount: 3 })
  const { data: currentWeather, error: currentWeatherError } = useSWR(BASE_URL + CURRENT_KEY + WEATHER_API_KEY + `&q=${location}`, fetcher)
  const { data: forecast, error: forecastError } = useSWR(BASE_URL + FORECAST_KEY + WEATHER_API_KEY + `&q=${location}`, fetcher)

  useEffect(() => {
    console.log({ locationData })
    if (locationData) setLocation(locationData.geo.city)
  }, [locationData])

  useEffect(() => {
    console.log({ weatherData: currentWeather })
  }, [currentWeather])

  if (!IS_DEV && !locationData) return <h1>Loading Geolocation data...</h1>
  if (!IS_DEV && locationError) return <h1>Failed to get geolocation data!</h1>

  if (!currentWeather) return <h1>Fetching Weather data...</h1>
  if (currentWeatherError) return <h1>Failed to get weather data!</h1>

  return (
    <Card className="h-full w-full mx-12 my-6 radius-md flex flex-col">
      <div className="flex-row">
        <div className="flex-col">
          <div>
            {currentWeather.location.localtime}
          </div>

          <div>
            <img
              src={`https:${currentWeather.current.condition.icon}`}
            />

            <p>
              {currentWeather.current.condition.text}
            </p>
          </div>

          <div>
            {currentWeather.current['temp_' + tempertureUnit]}
          </div>

          <div>
            {currentWeather.location.country}{" "}{currentWeather.location.region}
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex-col">
          <p>
            Weather Details
          </p>

          <div className="flex flex-row flex-wrap">
            <div>
              {currentWeather.current.cloud}
            </div>
            <div>
              {currentWeather.current.precip_mm}
            </div>
            <div>
              {currentWeather.current.humidity}
            </div>
            <div>
              {currentWeather.current.uv}
            </div>
            <div>
              {currentWeather.current['feelslike_' + tempertureUnit]}
            </div>
            <div>
              {currentWeather.current.pressure_mb}
            </div>
            <div>
              {currentWeather.current.wind_kph}
            </div>
            <div>
              {currentWeather.current.vis_km}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
