export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  groups: any[];
  user_permissions: any[];
  date_joined: string;
  last_login: string | null;
}
