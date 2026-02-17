interface LoginDataI {
  email?: string;
  username: string;
  password: string;
  remember: boolean;
}

interface ForgetPasswordI {
  otp: string;
}
