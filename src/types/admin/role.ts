export type TAdminRole = {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  createdById?: number | null;
  updatedById?: number | null;
  deletedById?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  permissions?: TAdminPermission[];
};

export type TAdminPermission = {
  id: number;
  name: string;
  description: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  module: string;
  isActive: boolean;
  createdById?: number | null;
  updatedById?: number | null;
  deletedById?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TCreateRoleInput = {
  name: string;
  description: string;
  isActive: boolean;
};

export type TUpdateRoleInput = TCreateRoleInput & {
  permissionIds: number[];
};

export type TAdminRoleListResponse = {
  data: TAdminRole[];
  total: number;
};

export type TAdminPermissionListResponse = {
  data: TAdminPermission[];
  total: number;
};
