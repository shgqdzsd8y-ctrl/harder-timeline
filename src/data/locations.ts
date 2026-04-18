import type { Location } from '../types';

export const locations: Location[] = [
  {
    id: 'rheinland-pfalz',
    name: 'Rheinland-Pfalz, Germany',
    lat: 49.91,
    lng: 7.66,
    region: 'Germany',
  },
  {
    id: 'columbia-county-ny',
    name: 'Columbia County, NY',
    lat: 42.18,
    lng: -73.62,
    region: 'New York',
  },
  {
    id: 'germantown-ny',
    name: 'Germantown, NY',
    lat: 42.12,
    lng: -73.9,
    region: 'New York',
  },
  {
    id: 'little-falls-ny',
    name: 'Little Falls, Herkimer Co., NY',
    lat: 43.04,
    lng: -74.86,
    region: 'New York',
  },
  {
    id: 'thorold-on',
    name: 'Thorold, ON',
    lat: 43.11,
    lng: -79.19,
    region: 'Upper Canada',
  },
  {
    id: 'humberstone-on',
    name: 'Humberstone, ON',
    lat: 42.87,
    lng: -79.13,
    region: 'Upper Canada',
  },
  {
    id: 'rainham-on',
    name: 'Rainham Township, Haldimand Co., ON',
    lat: 42.87,
    lng: -79.77,
    region: 'Upper Canada',
  },
  {
    id: 'haldimand-on',
    name: 'Haldimand County, ON',
    lat: 42.93,
    lng: -79.8,
    region: 'Upper Canada',
  },
  {
    id: 'mosa-on',
    name: 'Mosa Township, Middlesex Co., ON',
    lat: 42.72,
    lng: -81.81,
    region: 'Upper Canada',
  },
  {
    id: 'ekfrid-on',
    name: 'Ekfrid Township, Middlesex Co., ON',
    lat: 42.72,
    lng: -81.74,
    region: 'Upper Canada',
  },
  {
    id: 'aldborough-on',
    name: 'Aldborough Township, Elgin Co., ON',
    lat: 42.6,
    lng: -81.48,
    region: 'Upper Canada',
  },
  {
    id: 'bay-port-mi',
    name: 'Bay Port, Huron Co., MI',
    lat: 43.84,
    lng: -83.38,
    region: 'Michigan',
  },
];

export const locationsById = Object.fromEntries(locations.map((l) => [l.id, l]));
