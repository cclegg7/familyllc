export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export type RecipeFormData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
