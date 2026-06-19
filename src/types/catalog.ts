export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  images: string[];
  stock: number;
  category?: { name: string };
  brand?: { name: string } | null;
};

export type ProductFilters = {
  q?: string;
  brand?: string;
  category?: string;
  min?: string;
  max?: string;
  page?: string;
  take?: string;
  sort?: string;
};
