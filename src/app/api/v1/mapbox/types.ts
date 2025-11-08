export type MapboxGeocodingForwardResponse = {
  type: string;
  features: Feature[];
  attribution: string;
};

export type Feature = {
  type: string;
  id: string;
  geometry: Geometry;
  properties: Properties;
};

export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Properties = {
  mapbox_id: string;
  feature_type: string;
  full_address: string;
  name: string;
  name_preferred: string;
  coordinates: Coordinates;
  place_formatted: string;
  context: Context;
};

export type Context = {
  street: Postcode;
  neighborhood: Locality;
  postcode: Postcode;
  locality: Locality;
  place: Locality;
  region: Region;
  country: Country;
};

export type Country = {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  country_code: string;
  country_code_alpha_3: string;
};

export type Locality = {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  short_code?: string;
};

export type Postcode = {
  mapbox_id: string;
  name: string;
};

export type Region = {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  region_code: string;
  region_code_full: string;
};

export type Coordinates = {
  longitude: number;
  latitude: number;
};
