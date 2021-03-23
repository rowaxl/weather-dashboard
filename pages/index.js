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

  const { data: locationData, error: locationError } = useSWR('/api/geo', fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    errorRetryCount: 1
  })
  const { data: forecastData, error: forecastError } = useSWR(BASE_URL + FORECAST_KEY + WEATHER_API_KEY + `&q=${location}`, fetcher)

  useEffect(() => {
    console.log({ locationData })
    if (locationData) setLocation(locationData.geo.city)
  }, [locationData])

  useEffect(() => {
    console.log({forecastData})
    if (forecastData) {
      setForecasts(forecastData)
  
      setCurrentDayForecast(forecastData.forecast.forecastday.find(f => f.day === selectedDate))
    }
  }, [forecastData])

  if (!IS_DEV && !locationData) return <h1>Loading Geolocation data...</h1>
  if (!IS_DEV && locationError) return <h1>Failed to get geolocation data!</h1>

  if (!forecastData) return <h1>Fetching Weather data...</h1>
  if (forecastError) return <h1>Failed to get weather data!</h1>

  console.log({ forecasts })

  return (
    <div className="px-12 py-6 flex flex-col justify-center">
      <Card className="radius-md flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <form className="w-full">
              <input
                type="text"
                className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent transition-colors duration-200 focus:ring-0 focus:border-black dark:focus:border-gray-200 w-full"
                placeholder="Enter the City Name"
              />
            </form>

            <div className="ml-6 rounded-md bg-white dark:bg-black bg-opacity-70 px-6 py-2 flex flex-row flex-nowrap">
              <button type="button" className={tempertureUnit === 'c' ? 'mx-2 text-blue-500  dark:text-blue-300 font-bold' : 'mx-2 text-gray-500 dark:text-gray-300 '}>
                C
              </button>

              <span>
                /
              </span>

              <button type="button"  className={tempertureUnit === 'f' ? 'mx-2 text-blue-500 dark:text-blue-300 font-bold' : 'mx-2 text-gray-500 dark:text-gray-300 '}>
                F
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              {forecasts && forecasts.location.localtime}
            </div>

            <div>
              {forecasts && 
                <img
                  src={`https:${forecasts.current.condition.icon}`}
                />
              }

              <p>
                {forecasts && forecasts.current.condition.text}
              </p>
            </div>

            <div>
              {forecasts && forecasts.current['temp_' + tempertureUnit]}
              {currentDayForecast && currentDayForecast.day['maxtemp_' + tempertureUnit]}
              {currentDayForecast && currentDayForecast.day['mintemp_' + tempertureUnit]}
            </div>

            <div>
              {forecasts && forecasts.location.country}{" "}{forecasts && forecasts.location.region}
            </div>
          </div>

          <div className="flex-col">
            Hourly Forecasts

            <div className="flex-row">
              {currentDayForecast && currentDayForecast.hour.filter(f => f.time_epoch > (Date.now() / 1000)).map(f =>
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
                {currentDayForecast && currentDayForecast.astro.sunrise}
              </div>
              <div>
                {currentDayForecast && currentDayForecast.astro.sunset}
              </div>
              <div>
                {forecasts && forecasts.current.cloud}
              </div>
              <div>
                {forecasts && forecasts.current.precip_mm}
              </div>
              <div>
                {forecasts && forecasts.current.humidity}
              </div>
              <div>
                {forecasts && forecasts.current.uv}
              </div>
              <div>
                {forecasts && forecasts.current['feelslike_' + tempertureUnit]}
              </div>
              <div>
                {forecasts && forecasts.current.pressure_mb}
              </div>
              <div>
                {forecasts && forecasts.current.wind_kph}
              </div>
              <div>
                {forecasts && forecasts.current.vis_km}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
