import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY
  const capital = country.capital[0]
  
  useEffect(() => {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          units: 'metric',
          appid: api_key
        }
      })
      .then(response => setWeather(response.data))
      .catch(err => console.error('Weather fetch error:', err))
  }, [capital, api_key])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages:</h2>
      <ul>
        {Object.entries(country.languages).map(([code, lang]) => (
          <li key={code}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

      {weather && (
        <>
          <h2>Weather in {capital}</h2>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </>
      )}
    </div>
  )
}

const DisplayCountries = ({ search, matchingCountries }) => {
  const [shownCountries, setShownCountries] = useState([])

  const toggleShownCountry = (country) => {
    setShownCountries(
      shownCountries.includes(country.ccn3)
        ? shownCountries.filter(id => id !== country.ccn3)
        : [...shownCountries, country.ccn3]
    )
  }

  useEffect(() => {
    setShownCountries([])
  }, [matchingCountries])

  if (!search) return null
  if (matchingCountries.length > 10) return <div>Too many matches, specify another filter</div>
  if (matchingCountries.length === 1) return <CountryDetails country={matchingCountries[0]} />

  return (
    <div>
      {matchingCountries.map(country => (
        <div key={country.ccn3}>
          {country.name.common}
          <button onClick={() => toggleShownCountry(country)}>
            {shownCountries.includes(country.ccn3) ? 'Hide' : 'Show'}
          </button>
          {shownCountries.includes(country.ccn3) && <CountryDetails country={country} />}
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const matchingCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <div>
        Find countries:
        <input
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <DisplayCountries
        search={search}
        matchingCountries={matchingCountries}
      />
    </div>
  )
}

export default App
