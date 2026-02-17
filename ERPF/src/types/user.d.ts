interface UserI {
  id?: string;
  username?: string; // Virtual field from backend
  email?: string;
  is_active?: string | boolean;
  role_name?: string;
  role_code?: string;
  role_id?: string;
  password_hash?: string;
  password?: string;
  confirm_password?: string;
  updated_at?: string | null;
  created_at?: string | null;
  last_login_at?: string | null;
  role? : RoleI
}

interface UserDataI {
  user: UserI;
  accessToken: string;
  require2FA?: boolean;
  userId?: string;
  remember?: boolean;
}

interface RoleI {
  id: string;
  name: string;
  code: string;
}


