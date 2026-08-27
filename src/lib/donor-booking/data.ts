import type { Center, DonationType, Locality } from "./types";

// Datos mock. En producción, las coordenadas de los centros son cargadas
// por la clínica (no se usa geolocalización del dispositivo del donante).

export const donationTypes: DonationType[] = [
  {
    id: "sangre-entera",
    name: "Sangre",
    description: "La donación más común. Sirve para transfusiones generales.",
    durationLabel: "Dura unos 10 minutos",
  },
  {
    id: "plaquetas",
    name: "Plaquetas",
    description: "Por aféresis. Fundamental para pacientes oncológicos.",
    durationLabel: "Dura 60-90 minutos",
  },
  {
    id: "plasma",
    name: "Plasma",
    description: "Por aféresis. Se usa para tratar quemaduras y coagulopatías.",
    durationLabel: "Dura 45-60 minutos",
  },
];

export const localities: Locality[] = [
  { id: "caba", name: "Ciudad Autónoma de Buenos Aires", province: "CABA", lat: -34.6037, lng: -58.3816 },
  { id: "la-plata", name: "La Plata", province: "Buenos Aires", lat: -34.9214, lng: -57.9544 },
  { id: "mar-del-plata", name: "Mar del Plata", province: "Buenos Aires", lat: -37.995, lng: -57.5561 },
  { id: "rosario", name: "Rosario", province: "Santa Fe", lat: -32.9442, lng: -60.6505 },
  { id: "cordoba", name: "Córdoba", province: "Córdoba", lat: -31.4201, lng: -64.1888 },
  { id: "mendoza", name: "Mendoza", province: "Mendoza", lat: -32.8895, lng: -68.8458 },
  { id: "quilmes", name: "Quilmes", province: "Buenos Aires", lat: -34.7206, lng: -58.2544 },
  { id: "san-isidro", name: "San Isidro", province: "Buenos Aires", lat: -34.4708, lng: -58.5127 },
  { id: "chascomus", name: "Chascomús", province: "Buenos Aires", lat: -35.5713, lng: -58.0006 },
  { id: "dolores", name: "Dolores", province: "Buenos Aires", lat: -36.3132, lng: -57.6788 },
  { id: "pinamar", name: "Pinamar", province: "Buenos Aires", lat: -37.1075, lng: -56.8612 },
  { id: "necochea", name: "Necochea", province: "Buenos Aires", lat: -38.5545, lng: -58.7392 },
  { id: "villa-maria", name: "Villa María", province: "Córdoba", lat: -32.4076, lng: -63.2419 },
  { id: "san-rafael", name: "San Rafael", province: "Mendoza", lat: -34.6177, lng: -68.3301 },
  { id: "santa-fe", name: "Santa Fe", province: "Santa Fe", lat: -31.6333, lng: -60.7 },
];

export const centers: Center[] = [
  {
    id: "centro-caba",
    name: "Centro de Donación Pluvie CABA",
    localityId: "caba",
    address: "Av. Callao 1450, CABA",
    phone: "011 4800-1234",
    lat: -34.5928,
    lng: -58.3969,
  },
  {
    id: "centro-la-plata",
    name: "Centro de Donación Pluvie La Plata",
    localityId: "la-plata",
    address: "Calle 47 n° 620, La Plata",
    phone: "0221 421-5678",
    lat: -34.9205,
    lng: -57.9536,
  },
  {
    id: "centro-mdp",
    name: "Centro de Donación Pluvie Mar del Plata",
    localityId: "mar-del-plata",
    address: "Av. Colón 2830, Mar del Plata",
    phone: "0223 495-3344",
    lat: -37.9968,
    lng: -57.5546,
  },
  {
    id: "centro-rosario",
    name: "Centro de Donación Pluvie Rosario",
    localityId: "rosario",
    address: "Bv. Oroño 1250, Rosario",
    phone: "0341 448-9900",
    lat: -32.9468,
    lng: -60.6522,
  },
  {
    id: "centro-cordoba",
    name: "Centro de Donación Pluvie Córdoba",
    localityId: "cordoba",
    address: "Av. Colón 350, Córdoba",
    phone: "0351 423-7788",
    lat: -31.4167,
    lng: -64.1833,
  },
  {
    id: "centro-mendoza",
    name: "Centro de Donación Pluvie Mendoza",
    localityId: "mendoza",
    address: "San Martín 780, Mendoza",
    phone: "0261 429-6655",
    lat: -32.8908,
    lng: -68.8272,
  },
];
