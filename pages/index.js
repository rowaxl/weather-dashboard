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
  const { data: forecastData, error: forecastError } = useSWR(BASE_URL + FORECAST_KEY + WEATHER_API_KEY + `&q=${location}&days=7`, fetcher)

  useEffect(() => {
    console.log({ locationData })
    if (locationData) setLocation(locationData.geo.city)
  }, [locationData])

  useEffect(() => {
    console.log({forecastData})
    if (forecastData) {
      setForecasts(forecastData)

      setCurrentDayForecast(forecastData.forecast.forecastday.find(f => f.date === selectedDate))
    }
  }, [forecastData])

  if (!IS_DEV && !locationData) return <h1>Loading Geolocation data...</h1>
  if (!IS_DEV && locationError) return <h1>Failed to get geolocation data!</h1>

  if (!forecastData) return <h1>Fetching Weather data...</h1>
  if (forecastError) return <h1>Failed to get weather data!</h1>

  console.log({ currentDayForecast })

  return (
    <div className="px-12 py-6 flex flex-col justify-center h-full">
      <Card className="radius-md flex flex-col justify-between h-full">
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

          <div className="flex flex-row mt-4 flex-1 justify-between">
            <div className="flex flex-col min-w-max mr-4">
              <div className="text-center mt-2">
                {forecasts &&
                  <p className="text-xl font-bold">
                  {
                    new Date(forecasts.location.localtime)
                    .toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
                  }
                  </p>
                }
              </div>

              <div className="ml-2 flex flex-col items-center">
                {forecasts && 
                  <img
                    src={`https:${forecasts.current.condition.icon}`}
                    className="w-24"
                  />
                }

                <p className="text-center text-sm">
                  {forecasts && forecasts.current.condition.text}
                </p>
              </div>

              <div className="text-center my-4">
                <p className="text-2xl mb-4">
                  {forecasts && forecasts.current['temp_' + tempertureUnit]}°{tempertureUnit.toUpperCase()}
                </p>

                <p>
                  <span className="text-xl font-bold text-red-600 mr-2">
                    {currentDayForecast && currentDayForecast.day['maxtemp_' + tempertureUnit]}°{tempertureUnit.toUpperCase()}
                  </span>
                  {' / '}

                  <span className="text-xl font-bold text-blue-600 ml-2">
                    {currentDayForecast && currentDayForecast.day['mintemp_' + tempertureUnit]}°{tempertureUnit.toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="text-xl flex-row mt-4 justify-center">
                <img
                  src="/locationmark.svg"
                  alt="location"
                  className="w-12 h-12 mr-2 inline"
                />

                {forecasts &&
                  <span>
                    {`${forecasts.location.name}, ${forecasts.location.country}`}
                  </span>
                }
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <p className="font-bold text-xl">
                Forecasts
              </p>

              <div className="w-full flex flex-row flex-wrap overflow-scroll" style={{ maxWidth: 'calc(100% - 300px)'}}>
                {currentDayForecast && currentDayForecast.hour
                  .filter(f => new Date(f.time) > new Date(forecasts.location.localtime))
                  .map(f =>
                  <div key={f.time} className="text-center mr-4 mb-4 shadow-md pt-2 px-4">
                    <p className="text-lg mb-2">
                      {f.time.split(' ')[1]}
                    </p>

                    <img
                      src={`https:${f.condition.icon}`}
                      className="w-24"
                    />

                    <p>
                      {f['temp_' + tempertureUnit]}°{tempertureUnit.toUpperCase()}
                    </p>
                    <p>
                      {parseFloat(f.chance_of_rain) > 0 && `${f.chance_of_rain}%`}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-full flex flex-row flex-wrap overflow-scroll mt-4" style={{ maxWidth: 'calc(100% - 300px)'}}>
                {forecasts && forecasts.forecast.forecastday.slice(1).map(f => (
                  <div key={f.date} className="text-center mr-4 mb-4 shadow-md pt-2 px-4">
                    <p className="text-lg mb-2 font-bold">
                      {f.date}
                    </p>

                    <img
                      src={`https:${f.day.condition.icon}`}
                      className="w-24"
                    />

                    <p className="whitespace-pre">
                      <span className="text-lg font-bold text-red-600 mr-2">
                        {f.day['maxtemp_' + tempertureUnit]}°{tempertureUnit.toUpperCase()}
                      </span>
                      {' / '}
                      <span className="text-lg font-bold text-blue-600 ml-2">
                        {f.day['mintemp_' + tempertureUnit]}°{tempertureUnit.toUpperCase()}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-row flex-1 mt-4">
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
        </div>
      </Card>
    </div>
  )
}
