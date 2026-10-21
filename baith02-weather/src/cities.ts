export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const CITIES: City[] = [
  { id: 'hn', name: 'Hà Nội', latitude: 21.0285, longitude: 105.8542 },
  { id: 'hp', name: 'Hải Phòng', latitude: 20.8449, longitude: 106.6881 },
  { id: 'hue', name: 'Huế', latitude: 16.4637, longitude: 107.5909 },
  { id: 'dn', name: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022 },
  { id: 'nt', name: 'Nha Trang', latitude: 12.2388, longitude: 109.1967 },
  { id: 'dl', name: 'Đà Lạt', latitude: 11.9404, longitude: 108.4583 },
  { id: 'hcm', name: 'TP. Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297 },
  { id: 'ct', name: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469 },
];