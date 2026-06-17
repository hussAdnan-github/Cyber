export interface Company {
  id: number;
  name_place: string;
  name_onwer: string;
  name_user: string;
  name: string;
  location: string;
  phone: string;
  phone2: string | null;
  email: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  place: number;
  onwer: number;
  user: number;
}

export interface LineTravel {
  id: number;
  name_place_from: string;
  name_place_to: string;
  name_travel: { id: number; name: string }[];
  track: string;
  type_travel: number;
  created_at: string;
  updated_at: string;
  place_from: number;
  place_to: number;
  travel: number[];
}

export interface Traveler {
  id: number;
  name_nationality: string;
  name_trip: {
    travel: string;
    place_from: string;
    place_to: string;
  };
  name: string;
  type_id: number;
  number_id: string;
  pic: string;
  phone: string;
  phone2: string | null;
  evaluation: number;
  created_at: string;
  updated_at: string;
  trip: number;
  nationality: number;
}

export interface Trip {
  id: number;
  name_travel: string;
  line_travel: {
    id: number;
    place_from: string;
    place_to: string;
  };
  driver: string;
  driver_phone: string;
  driver_phone2: string | null;
  car_number: string;
  date_trip: string;
  created_at: string;
  updated_at: string;
  travel: number;
}
