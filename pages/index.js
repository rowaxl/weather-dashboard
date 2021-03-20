import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '../api/fetcher'

const IS_DEV = process.env['NODE_ENV'] === 'development'
const KEY = `?key=${process.env['NEXT_PUBLIC_API_KEY']}`
const BASE_URL = 'https://api.weatherapi.com/v1/'
const CURRENT_KEY = 'current.json'
const FORECAST_KEY = 'forecast.json'

export default function Home() {
  const [location, setLocation] = useState('London')
  const [buffer, setBuffer] = useState()
  const { data: locationData, error: locationError } = useSWR('/api/geo', fetcher)
  const { data: currentWeather, error: currentWeatherError } = useSWR(BASE_URL + CURRENT_KEY + KEY + `&q=${location}`, fetcher)
  const { data: forecast, error: forecastError } = useSWR(BASE_URL + FORECAST_KEY + KEY + `&q=${location}`, fetcher)

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
    <div>
      
    </div>
  )
}
