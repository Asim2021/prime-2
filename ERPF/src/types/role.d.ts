interface PermissionI {
  id: string;
  name: string;
  code: string;
  module: string;
  action: string;
}

interface RoleI {
  id: string;
  name: string;
  code: string;
  permissions?: PermissionI[];
}

interface RolePermissionUpdatePayload {
  roleId: string;
  permissionIds: string[];
}
