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
  role: { value: number; label: string } | null;      
  last_login: string | null;                            
  staff_role: { value: number; label: string } | null; 
};
