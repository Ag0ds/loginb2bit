export type LoginRequest = { email: string; password: string };

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    avatar: string | null;
    type: string;
    created: string;
    modified: string;
    role: string;
  };
  tokens: { access: string; refresh: string };
};

export type ProfileResponse = {
  id: string;
  avatar: {
    id: number;
    image_high_url: string;
    image_medium_url: string;
    image_low_url: string;
  } | null;
  name: string;
  last_name: string;
  email: string;
  role: { value: number; label: string };
  last_login: string;
  staff_role: { value: number; label: string };
};
