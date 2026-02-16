interface UserI {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string; // Virtual field from backend
  email?: string;
  active?: string | boolean;
  password?: string;
  roleName?: string;
  roleCode?: string;
  confirmPassword?: string;
  dob?: string | Date | undefined | number | null;
  address?: string | null;
  pincode?: string | null;
  profile?: string | null;
  countryCode?: string | null;
  state?: string | null;
  phone?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

interface ProfileI {
  name: string | null;
  fileBase64: Blob | string | ArrayBuffer | object | null;
  type: string | null;
  size: string | number | null;
}

interface UserData {
  user: UserI;
  accessToken: string;
  require2FA?: boolean;
  userId?: string;
  remember?: boolean;
}

interface ProfileUploadI {
  src: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}
