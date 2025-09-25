export type AvatarApi = {
  id: number;
  image_high_url?: string;
  image_medium_url?: string;
  image_low_url?: string;
  high?: string;
  medium?: string;
  low?: string;
};

export type ProfileResponse = {
  id: string;
  avatar: AvatarApi | null;
  name: string;
  last_name: string;
  email: string;
  role?: { value: number; label: string };
  staff_role?: { value: number; label: string };
  last_login?: string;
};
