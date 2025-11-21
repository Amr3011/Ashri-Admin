export interface Size {
  name: string;
  quantity: number;
  status: string;
  available: boolean;
}

export interface Variant {
  color: string;
  sizes: Size[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  variants: Variant[];
  images: string[];
  totalStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}
