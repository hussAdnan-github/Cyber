export interface Hotel {
  id: number | string;
  name: string;
  email?: string;
  location?: string;
  phone?: string;
  phone2?: string;
  place?: number;
  onwer?: number;
  user?: number;
  name_place?: string;
  name_onwer?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Guest {
  id: number | string;
  name: string;
  pic?: string;
  name_hotel?: string;
  name_nationality?: string;
  number_id?: string | number;
  evaluation?: number;
  created_at?: string;
  updated_at?: string;
  nationality?: number;
  hotel?: number;
}

export interface Companion {
  id: number | string;
  name: string;
  pic?: string;
  name_person?: string;
  name_nationality?: string;
  number_id?: string | number;
  evaluation?: number;
  created_at?: string;
  updated_at?: string;
  person?: number;
  nationality?: number;
}
