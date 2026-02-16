import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

export const fetchAllRoles = async (
  params: QueryParamsI,
): Promise<PaginationResponse<RoleI[]>> => {
  const url = `${ENDPOINT.BASE}roles` + paramsToQueryString(params);
  const res: any = await erpApi.get(url);
  return res.data;
};

export const fetchAllPermissions = async (
  params: QueryParamsI,
): Promise<PaginationResponse<PermissionI[]>> => {
  const url = `/settings/permissions` + paramsToQueryString(params);
  const res: any = await erpApi.get(url);
  return res.data;
};

export const updateRolePermissions = async (
  roleId: string,
  permissionIds: string[],
): Promise<ErpResponse<null>> => {
  const url = `${ENDPOINT.BASE}roles/${roleId}/permissions`;
  const res: any = await erpApi.put(url, { permissionIds });
  return res;
};

export const createRole = async (
  data: Partial<RoleI>,
): Promise<ErpResponse<RoleI>> => {
  const url = `${ENDPOINT.BASE}roles`;
  const res: any = await erpApi.post(url, data);
  return res;
};
