import React, { useState, useMemo, useCallback } from 'react';
import { CITIES } from './cities';
import type { City, WeatherApiResponse } from './types';
import { getWeatherInfo, removeVietnameseTones, formatDay } from './weatherUtils';
import './App.css';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  

  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fav_cities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (cityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId];
      localStorage.setItem('fav_cities', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchWeather = useCallback(async (city: City) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Không thể tải dữ liệu thời tiết.');
      const data: WeatherApiResponse = await res.json();
      setWeatherData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectCity = (city: City) => {
    if (selectedCity?.id === city.id && weatherData) return;
    setSelectedCity(city);
    fetchWeather(city);
  };

  const convertTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const filteredCities = useMemo(() => {
    const term = removeVietnameseTones(searchTerm);
    return CITIES.filter((city) =>
      removeVietnameseTones(city.name).includes(term)
    );
  }, [searchTerm]);

  const currentTheme = weatherData
    ? getWeatherInfo(weatherData.current.weather_code).theme
    : 'default';

  return (
    <div className={`app-container theme-${currentTheme}`}>
      <header className="header">
        <h1>🌤️ Thời Tiết Việt Nam</h1>
        <div className="unit-toggle">
          <button
            className={unit === 'C' ? 'active' : ''}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={unit === 'F' ? 'active' : ''}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Cột trái: YC1 Danh sách thành phố */}
        <aside className="city-panel">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm thành phố..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ul className="city-list">
            {filteredCities.map((city) => {
              const isSelected = selectedCity?.id === city.id;
              const isFav = favorites.includes(city.id);
              return (
                <li
                  key={city.id}
                  className={`city-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectCity(city)}
                >
                  <span className="city-name">{city.name}</span>
                  <button
                    className={`fav-btn ${isFav ? 'starred' : ''}`}
                    title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                    onClick={(e) => toggleFavorite(city.id, e)}
                  >
                    ★
                  </button>
                </li>
              );
            })}
            {filteredCities.length === 0 && (
              <li className="no-result">Không tìm thấy thành phố</li>
            )}
          </ul>
        </aside>

        {/* Cột phải: YC2, YC3, YC4 */}
        <main className="weather-panel">
          {!selectedCity && !loading && !error && (
            <div className="state-box">
              <span className="state-icon">📍</span>
              <p>Vui lòng chọn một thành phố để xem thông tin thời tiết.</p>
            </div>
          )}

          {loading && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu thời tiết của {selectedCity?.name}...</p>
            </div>
          )}

          {error && !loading && (
            <div className="state-box error">
              <span className="state-icon">⚠️</span>
              <p>{error}</p>
              <button
                className="btn-retry"
                onClick={() => selectedCity && fetchWeather(selectedCity)}
              >
                🔄 Thử lại
              </button>
            </div>
          )}

          {weatherData && !loading && !error && selectedCity && (
            <div className="weather-details">
              <section className="current-weather-card">
                <h2>{selectedCity.name}</h2>
                <div className="current-main">
                  <div className="weather-icon">
                    {getWeatherInfo(weatherData.current.weather_code).icon}
                  </div>
                  <div>
                    <div className="current-temp">
                      {convertTemp(weatherData.current.temperature_2m)}
                    </div>
                    <div className="weather-desc">
                      {getWeatherInfo(weatherData.current.weather_code).desc}
                    </div>
                  </div>
                </div>

                <div className="weather-stats">
                  <div className="stat-item">
                    <span>💧 Độ ẩm: </span>
                    <strong>{weatherData.current.relative_humidity_2m}%</strong>
                  </div>
                  <div className="stat-item">
                    <span>💨 Tốc độ gió: </span>
                    <strong>{weatherData.current.wind_speed_10m} km/h</strong>
                  </div>
                  <div className="stat-item">
                    <span>🕒 Cập nhật: </span>
                    <strong>{weatherData.current.time.replace('T', ' ')}</strong>
                  </div>
                </div>
              </section>

              <section className="forecast-section">
                <h3>Dự báo thời tiết 7 ngày tới</h3>
                <div className="forecast-grid">
                  {weatherData.daily.time.map((dateStr, index) => {
                    const code = weatherData.daily.weather_code[index];
                    const info = getWeatherInfo(code);
                    const max = weatherData.daily.temperature_2m_max[index];
                    const min = weatherData.daily.temperature_2m_min[index];

                    return (
                      <div key={dateStr} className="forecast-card">
                        <span className="forecast-day">{formatDay(dateStr)}</span>
                        <span className="forecast-icon" title={info.desc}>
                          {info.icon}
                        </span>
                        <div className="forecast-temps">
                          <span className="temp-max">{convertTemp(max)}</span>
                          <span className="temp-min">{convertTemp(min)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;