import { Recipe, Ingredient, RecipeFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// In a real application, this would be replaced with API calls to a backend
// For now, we'll use localStorage to persist data

const STORAGE_KEY = 'family-recipes';

// Initialize with some sample recipes
const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Spaghetti Bolognese',
    description: 'A family favorite Italian pasta dish with rich meat sauce.',
    ingredients: [
      { id: '1-1', name: 'Ground beef', quantity: '1', unit: 'lb' },
      { id: '1-2', name: 'Onion', quantity: '1', unit: 'medium' },
      { id: '1-3', name: 'Garlic', quantity: '3', unit: 'cloves' },
      { id: '1-4', name: 'Tomato paste', quantity: '2', unit: 'tbsp' },
      { id: '1-5', name: 'Crushed tomatoes', quantity: '28', unit: 'oz' },
      { id: '1-6', name: 'Spaghetti', quantity: '1', unit: 'lb' },
    ],
    instructions: [
      'Brown the ground beef in a large skillet over medium heat.',
      'Add diced onion and minced garlic, cook until softened.',
      'Stir in tomato paste and cook for 1 minute.',
      'Add crushed tomatoes and simmer for 20 minutes.',
      'Meanwhile, cook spaghetti according to package directions.',
      'Serve sauce over pasta with grated Parmesan cheese.'
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    category: 'Main Dish',
    imageUrl: '/images/spaghetti.jpg',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: '2',
    title: 'Homemade Chocolate Chip Cookies',
    description: 'Soft and chewy cookies with melty chocolate chips.',
    ingredients: [
      { id: '2-1', name: 'Butter', quantity: '1', unit: 'cup' },
      { id: '2-2', name: 'Brown sugar', quantity: '1', unit: 'cup' },
      { id: '2-3', name: 'White sugar', quantity: '1/2', unit: 'cup' },
      { id: '2-4', name: 'Eggs', quantity: '2', unit: 'large' },
      { id: '2-5', name: 'Vanilla extract', quantity: '2', unit: 'tsp' },
      { id: '2-6', name: 'All-purpose flour', quantity: '2 1/4', unit: 'cups' },
      { id: '2-7', name: 'Baking soda', quantity: '1', unit: 'tsp' },
      { id: '2-8', name: 'Salt', quantity: '1/2', unit: 'tsp' },
      { id: '2-9', name: 'Chocolate chips', quantity: '2', unit: 'cups' },
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'Cream together butter and sugars until light and fluffy.',
      'Beat in eggs one at a time, then stir in vanilla.',
      'Combine flour, baking soda, and salt; gradually add to the creamed mixture.',
      'Fold in chocolate chips.',
      'Drop by rounded tablespoons onto ungreased cookie sheets.',
      'Bake for 9 to 11 minutes or until golden brown.',
      'Cool on wire racks.'
    ],
    prepTime: 20,
    cookTime: 10,
    servings: 24,
    category: 'Dessert',
    imageUrl: '/images/cookies.jpg',
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 1, 10).toISOString()
  }
];

// Initialize localStorage with sample recipes if empty
const initializeRecipes = (): void => {
  if (typeof window !== 'undefined') {
    const existingRecipes = localStorage.getItem(STORAGE_KEY);
    if (!existingRecipes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRecipes));
    }
  }
};

// Get all recipes
export const getAllRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return [];
  
  initializeRecipes();
  const recipesJson = localStorage.getItem(STORAGE_KEY);
  return recipesJson ? JSON.parse(recipesJson) : [];
};

// Get a single recipe by ID
export const getRecipeById = (id: string): Recipe | undefined => {
  const recipes = getAllRecipes();
  return recipes.find(recipe => recipe.id === id);
};

// Create a new recipe
export const createRecipe = (recipeData: RecipeFormData): Recipe => {
  const recipes = getAllRecipes();
  
  const newRecipe: Recipe = {
    ...recipeData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedRecipes = [...recipes, newRecipe];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
  
  return newRecipe;
};

// Update an existing recipe
export const updateRecipe = (id: string, recipeData: RecipeFormData): Recipe | undefined => {
  const recipes = getAllRecipes();
  const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
  
  if (recipeIndex === -1) return undefined;
  
  const updatedRecipe: Recipe = {
    ...recipeData,
    id,
    createdAt: recipes[recipeIndex].createdAt,
    updatedAt: new Date().toISOString()
  };
  
  const updatedRecipes = [...recipes];
  updatedRecipes[recipeIndex] = updatedRecipe;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
  
  return updatedRecipe;
};

// Delete a recipe
export const deleteRecipe = (id: string): boolean => {
  const recipes = getAllRecipes();
  const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
  
  if (updatedRecipes.length === recipes.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
  return true;
};

// Helper function to create a new ingredient
export const createIngredient = (name: string, quantity: string, unit: string): Ingredient => {
  return {
    id: uuidv4(),
    name,
    quantity,
    unit
  };
};
