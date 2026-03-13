export type TAdminBrand = {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: number;
  updatedById?: number | null;
  deletedAt?: string | null;
  deletedById?: number | null;
};

export type TAdminBrandListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type TAdminBrandListResponse = {
  data: TAdminBrand[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TCreateBrandInput = {
  name: string;
  description?: string;
  logo?: string;
};

export type TUpdateBrandInput = Partial<TCreateBrandInput>;
