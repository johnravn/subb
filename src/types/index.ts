export interface UserLogIn {
  email: string;
  password: string;
}

export interface UserSignIn {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  born: string;
  address: string;
  zip: string;
  area: string;
}

export interface UserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  born?: string;
  address?: string;
  zip?: string;
  area?: string;
}
