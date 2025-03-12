'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe, Ingredient, RecipeFormData } from '@/types';
import { createRecipe, updateRecipe, createIngredient } from '@/utils/recipeUtils';
import { v4 as uuidv4 } from 'uuid';

interface RecipeFormProps {
  initialData?: Recipe;
  isEditing?: boolean;
}

const defaultRecipe: RecipeFormData = {
  title: '',
  description: '',
  ingredients: [],
  instructions: [''],
  prepTime: 0,
  cookTime: 0,
  servings: 1,
  category: '',
  imageUrl: '',
};

const categories = [
  'Breakfast',
  'Main Dish',
  'Side Dish',
  'Appetizer',
  'Soup',
  'Salad',
  'Dessert',
  'Snack',
  'Beverage',
  'Bread',
  'Other'
];

export default function RecipeForm({ initialData, isEditing = false }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>(initialData || defaultRecipe);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle numeric input changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle ingredient input changes
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new ingredient
  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) {
      setErrors((prev) => ({
        ...prev,
        ingredients: 'Ingredient name and quantity are required'
      }));
      return;
    }

    const ingredient = createIngredient(
      newIngredient.name,
      newIngredient.quantity,
      newIngredient.unit
    );

    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }));

    setNewIngredient({ name: '', quantity: '', unit: '' });
    
    // Clear error
    if (errors.ingredients) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.ingredients;
        return newErrors;
      });
    }
  };

  // Remove an ingredient
  const handleRemoveIngredient = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ingredient) => ingredient.id !== id)
    }));
  };

  // Handle instruction changes
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    
    setFormData((prev) => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  // Add a new instruction
  const handleAddInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  // Remove an instruction
  const handleRemoveInstruction = (index: number) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }
    
    if (formData.instructions.length === 0 || !formData.instructions[0].trim()) {
      newErrors.instructions = 'At least one instruction is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.prepTime <= 0) {
      newErrors.prepTime = 'Prep time must be greater than 0';
    }
    
    if (formData.cookTime < 0) {
      newErrors.cookTime = 'Cook time cannot be negative';
    }
    
    if (formData.servings <= 0) {
      newErrors.servings = 'Servings must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && initialData) {
        updateRecipe(initialData.id, formData);
        router.push(`/recipes/${initialData.id}`);
      } else {
        const newRecipe = createRecipe(formData);
        router.push(`/recipes/${newRecipe.id}`);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      setErrors((prev) => ({
        ...prev,
        form: 'An error occurred while saving the recipe'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipe Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prep Time (minutes)*
              </label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleNumericChange}
                min="0"
                className={`w-full px-3 py-2 border ${errors.prepTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.prepTime && <p className="mt-1 text-sm text-red-500">{errors.prepTime}</p>}
            </div>
            
            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cook Time (minutes)*
              </label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleNumericChange}
                min="0"
                className={`w-full px-3 py-2 border ${errors.cookTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.cookTime && <p className="mt-1 text-sm text-red-500">{errors.cookTime}</p>}
            </div>
            
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Servings*
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleNumericChange}
                min="1"
                className={`w-full px-3 py-2 border ${errors.servings ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white`}
              />
              {errors.servings && <p className="mt-1 text-sm text-red-500">{errors.servings}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL (optional)
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>
      
      {/* Ingredients */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
        
        {/* Add Ingredient Form */}
        <div className="grid grid-cols-12 gap-2 mb-4">
          <div className="col-span-5 sm:col-span-6">
            <input
              type="text"
              placeholder="Ingredient name"
              value={newIngredient.name}
              onChange={handleIngredientChange}
              name="name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="col-span-3 sm:col-span-2">
            <input
              type="text"
              placeholder="Qty"
              value={newIngredient.quantity}
              onChange={handleIngredientChange}
              name="quantity"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="col-span-3 sm:col-span-2">
            <input
              type="text"
              placeholder="Unit"
              value={newIngredient.unit}
              onChange={handleIngredientChange}
              name="unit"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <button
              type="button"
              onClick={handleAddIngredient}
              className="w-full h-full bg-amber-600 hover:bg-amber-700 text-white rounded-md"
            >
              +
            </button>
          </div>
        </div>
        
        {errors.ingredients && <p className="mt-1 mb-2 text-sm text-red-500">{errors.ingredients}</p>}
        
        {/* Ingredients List */}
        {formData.ingredients.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {formData.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="py-2 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No ingredients added yet</p>
        )}
      </div>
      
      {/* Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Instructions</h2>
        
        {errors.instructions && <p className="mt-1 mb-2 text-sm text-red-500">{errors.instructions}</p>}
        
        {/* Instructions List */}
        <div className="space-y-3">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <span className="mt-2 text-gray-500 dark:text-gray-400 font-medium">{index + 1}.</span>
              <div className="flex-1">
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveInstruction(index)}
                className="text-red-500 hover:text-red-700 self-start mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleAddInstruction}
          className="mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-1.5 px-4 rounded-md text-sm"
        >
          Add Step
        </button>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-1.5 px-4 rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-4 rounded-md text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </div>
      
      {errors.form && (
        <p className="text-center text-red-500 mt-2">{errors.form}</p>
      )}
    </form>
  );
}
