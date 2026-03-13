export type TAdminCategory = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentCategoryId?: number | null;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  updatedById?: number | null;
  deletedAt?: string | null;
  deletedById?: number | null;
  parentCategory?: TAdminCategory | null;
};

export type TAdminCategoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type TAdminCategoryListResponse = {
  data: TAdminCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TCreateCategoryInput = {
  name: string;
  description?: string;
  parentCategoryId?: number | null;
};

export type TUpdateCategoryInput = Partial<TCreateCategoryInput>;
