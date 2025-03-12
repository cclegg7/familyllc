'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types';
import { getRecipeById, deleteRecipe } from '@/utils/recipeUtils';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = () => {
      const recipeData = getRecipeById(params.id);
      if (recipeData) {
        setRecipe(recipeData);
      }
      setIsLoading(false);
    };

    fetchRecipe();
  }, [params.id]);

  const handleDelete = () => {
    if (recipe) {
      const deleted = deleteRecipe(recipe.id);
      if (deleted) {
        router.push('/recipes');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
        <p className="mb-6">The recipe you're looking for doesn't exist or has been deleted.</p>
        <Link
          href="/recipes"
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-4 rounded-md inline-block transition-colors text-sm"
        >
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/recipes"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2 inline-block"
          >
            ← Back to Recipes
          </Link>
          <h1 className="text-2xl font-bold">{recipe.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md inline-block transition-colors text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-md inline-block transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipe Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>
          </div>

          {/* Ingredients */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-3">Recipe Info</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Prep Time:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.prepTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cook Time:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.cookTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Time:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.prepTime + recipe.cookTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Servings:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{recipe.servings}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-3">Actions</h2>
            <div className="space-y-2">
              <button
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                onClick={() => window.print()}
              >
                Print Recipe
              </button>
              <button
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Recipe link copied to clipboard!');
                }}
              >
                Share Recipe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Recipe</h2>
            <p className="mb-6">Are you sure you want to delete "{recipe.title}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-1.5 px-4 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
