import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '../api/fetcher'

import moment from 'moment'

import Card from '../components/Card'

const IS_DEV = process.env['NODE_ENV'] === 'development'
const WEATHER_API_KEY = `?key=${process.env['NEXT_PUBLIC_WEATHER_API_KEY']}`
const BASE_URL = 'https://api.weatherapi.com/v1/'
const FORECAST_KEY = 'forecast.json'

export default function Home() {
  const [location, setLocation] = useState('London')
  const [forecasts, setForecasts] = useState()
  const [currentDayForecast, setCurrentDayForecast] = useState()
  const [tempertureUnit, setTempertureUnit] = useState('c')
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'))

  const { data: locationData, error: locationError } = useSWR('/api/geo', fetcher, { errorRetryCount: 3 })
  const { data: forecastData, error: forecastError } = useSWR(BASE_URL + FORECAST_KEY + WEATHER_API_KEY + `&q=${location}`, fetcher)

  useEffect(() => {
    console.log({ locationData })
    if (locationData) setLocation(locationData.geo.city)
  }, [locationData])

  useEffect(() => {
    setForecasts(forecastData)

    setCurrentDayForecast(forecastData.forecast.forecastday.find(f => f.day === selectedDate))
  }, [forecastData])

  if (!IS_DEV && !locationData) return <h1>Loading Geolocation data...</h1>
  if (!IS_DEV && locationError) return <h1>Failed to get geolocation data!</h1>

  if (!forecast) return <h1>Fetching Weather data...</h1>
  if (forecastError) return <h1>Failed to get weather data!</h1>

  return (
    <Card className="h-full w-full mx-12 my-6 radius-md flex flex-col">
      <div className="flex-row">
        <div className="flex-col">
          <div>
            {forecasts.location.localtime}
          </div>

          <div>
            <img
              src={`https:${forecasts.current.condition.icon}`}
            />

            <p>
              {forecasts.current.condition.text}
            </p>
          </div>

          <div>
            {forecasts.current['temp_' + tempertureUnit]}
            {currentDayForecast.day['maxtemp_' + tempertureUnit]}
            {currentDayForecast.day['mintemp_' + tempertureUnit]}
          </div>

          <div>
            {forecasts.location.country}{" "}{forecasts.location.region}
          </div>
        </div>

        <div className="flex-col">
          Hourly Forecasts

          <div className="flex-row">
            {currentDayForecast.hour.filter(f => f.time_epoch > (Date.now() / 1000)).map(f =>
              <div>
                {f.time.split(' ')[1]}
                {f.condition.icon}
                {f['temp_' + tempertureUnit]}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex-col">
          <p>
            Weather Details of {selectedDate}
          </p>

          <div className="flex flex-row flex-wrap">
            <div>
              {forecasts.forecast.forecastday[selectedDate].astro.sunrise}
            </div>
            <div>
              {forecasts.forecast.forecastday[selectedDate].astro.sunset}
            </div>
            <div>
              {forecasts.current.cloud}
            </div>
            <div>
              {forecasts.current.precip_mm}
            </div>
            <div>
              {forecasts.current.humidity}
            </div>
            <div>
              {forecasts.current.uv}
            </div>
            <div>
              {forecasts.current['feelslike_' + tempertureUnit]}
            </div>
            <div>
              {forecasts.current.pressure_mb}
            </div>
            <div>
              {forecasts.current.wind_kph}
            </div>
            <div>
              {forecasts.current.vis_km}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
