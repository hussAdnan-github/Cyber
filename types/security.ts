export interface Center {
  id: number;
  name_place: string;
  name_user: string;
  name: string;
  phone: string;
  phone2: string | null;
  crated_at: string;
  updated_at: string;
  place: number;
  user: number;
}

export interface Place {
  id: number;
  name: string;
  location: string;
  crated_at: string;
  updated_at: string;
}

export interface Owner {
  id: number;
  name_nationality: string;
  name: string;
  type_id: number;
  number_id: string;
  documents: string;
  phone: string;
  phone2: string | null;
  crated_at: string;
  updated_at: string;
  nationality: number;
}

export interface Nationality {
  id: number;
  name: string;
  crated_at: string;
  updated_at: string;
}

export interface BlacklistEntry {
  id: number;
  name_user_created: string;
  name: string;
  reason: string;
  crated_at: string;
  updated_at: string;
}
