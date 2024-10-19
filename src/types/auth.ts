export interface LoginProps {
    email: string;
    password: string;
    clientorganizationid: string;
    name: string;
  }

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  roleid?: number;
}