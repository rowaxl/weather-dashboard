import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '../api/fetcher'

const KEY = process.env['NEXT_PUBLIC_API_KEY']
const BASE_URL = 'https://api.weatherapi.com/v1/current.json?key='

export default function Home() {
  const [location, setLocation] = useState('London')
  const [buffer, setBuffer] = useState()
  const { data: locationData, error: locationError } = useSWR('/api/geo', fetcher)
  const { data: weatherData, error: weatherError } = useSWR(BASE_URL + KEY + `&q=${location}`, fetcher)

  useEffect(() => {
    console.log({ locationData })
    if (locationData) setLocation(locationData.geo.city)
  }, [locationData])

  useEffect(() => {
    console.log({ weatherData })
  }, [weatherData])

  if (!locationData) return <h1>Loading Geolocation data...</h1>
  if (locationError) return <h1>Failed to get geolocation data!</h1>

  if (!weatherData) return <h1>Fetching Weather data...</h1>
  if (weatherError) return <h1>Failed to get weather data!</h1>

  return (
    <div>
      
    </div>
  )
}
