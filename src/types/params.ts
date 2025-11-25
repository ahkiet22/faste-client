export interface TParamsSearch {
  keyword?: string;
  categoryIds?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'popular' | 'new' | 'bestseller';
}
