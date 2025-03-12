'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import { Recipe } from '@/types';
import { getRecipeById } from '@/utils/recipeUtils';

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = () => {
      const recipeData = getRecipeById(params.id);
      if (recipeData) {
        setRecipe(recipeData);
      } else {
        // Recipe not found, redirect to recipes list
        router.push('/recipes');
      }
      setIsLoading(false);
    };

    fetchRecipe();
  }, [params.id, router]);

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
        <p className="mb-6">The recipe you're trying to edit doesn't exist or has been deleted.</p>
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href={`/recipes/${recipe.id}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back to Recipe
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Edit Recipe: {recipe.title}</h1>
      
      <RecipeForm initialData={recipe} isEditing={true} />
    </div>
  );
}
