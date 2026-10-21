export const getWeatherInfo = (code: number) => {
  switch (code) {
    case 0:
      return { desc: 'Trời quang đãng', icon: '☀️', theme: 'sunny' };
    case 1:
    case 2:
      return { desc: 'Ít mây / Trời đẹp', icon: '🌤️', theme: 'partly-cloudy' };
    case 3:
      return { desc: 'Nhiều mây / U ám', icon: '☁️', theme: 'cloudy' };
    case 45:
    case 48:
      return { desc: 'Có sương mù', icon: '🌫️', theme: 'fog' };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return { desc: 'Có mưa', icon: '🌧️', theme: 'rainy' };
    case 71:
    case 73:
    case 75:
      return { desc: 'Tuyết rơi', icon: '❄️', theme: 'cold' };
    case 95:
    case 96:
    case 99:
      return { desc: 'Có dông sét', icon: '⛈️', theme: 'thunder' };
    default:
      return { desc: 'Có mây rải rác', icon: '⛅', theme: 'partly-cloudy' };
  }
};

export const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

export const formatDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dayName = days[date.getDay()];
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  return `${dayName}, ${formattedDate}`;
};