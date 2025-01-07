export interface FoodEntry {
  id: string;
  name: string;
  location: string;
  rating: number;
  average_cost: number | null;
  review: string | null;
  image_url: string | null;
  recommended_by: string | null;
  visit_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodEntryFormData {
  name: string;
  location: string;
  rating: number;
  average_cost: number | null;
  review: string | null;
  imageUrl: string | null;
  recommended_by: string | null;
  visitDate: Date;
}